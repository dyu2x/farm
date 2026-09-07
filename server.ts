import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import {
  getD1Status,
  initializeD1Schema,
  getAllData,
  saveProducts,
  saveInquiry,
  deleteInquiry,
  saveSettings,
  saveBlogs,
  deleteBlog,
} from './server/d1';

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middlewares
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // ==========================================================
  // Cloudflare D1 Database API Routes (FIRST)
  // ==========================================================

  // 1. D1 Status & Diagnostics
  app.get('/api/d1/status', async (req, res) => {
    try {
      const status = await getD1Status();
      res.json(status);
    } catch (err: any) {
      res.status(500).json({ error: err?.message || 'Failed checking D1 status' });
    }
  });

  // 2. Initialize / Migrate Cloudflare D1 Schema Tables
  app.post('/api/d1/migrate', async (req, res) => {
    try {
      const result = await initializeD1Schema();
      res.json(result);
    } catch (err: any) {
      res.status(500).json({ success: false, error: err?.message || 'Migration failed' });
    }
  });

  // 3. Get Full Application Data (Synchronized from D1)
  app.get('/api/data', async (req, res) => {
    try {
      const data = await getAllData();
      res.json(data);
    } catch (err: any) {
      res.status(500).json({ error: err?.message || 'Failed loading data' });
    }
  });

  // 4. Products & Stock (Cloudflare D1)
  app.post('/api/products', async (req, res) => {
    try {
      const { products } = req.body;
      if (Array.isArray(products)) {
        await saveProducts(products);
        res.json({ success: true, count: products.length });
      } else {
        res.status(400).json({ error: 'Expected products array' });
      }
    } catch (err: any) {
      res.status(500).json({ error: err?.message });
    }
  });

  // 5. Inquiries (Cloudflare D1)
  app.post('/api/inquiries', async (req, res) => {
    try {
      const inquiry = req.body;
      await saveInquiry(inquiry);
      res.json({ success: true, inquiry });
    } catch (err: any) {
      res.status(500).json({ error: err?.message });
    }
  });

  app.delete('/api/inquiries/:id', async (req, res) => {
    try {
      await deleteInquiry(req.params.id);
      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ error: err?.message });
    }
  });

  // 6. Settings (Cloudflare D1)
  app.get('/api/settings', async (req, res) => {
    try {
      const data = await getAllData();
      res.json(data.settings);
    } catch (err: any) {
      res.status(500).json({ error: err?.message });
    }
  });

  app.put('/api/settings', async (req, res) => {
    try {
      await saveSettings(req.body);
      res.json({ success: true, settings: req.body });
    } catch (err: any) {
      res.status(500).json({ error: err?.message });
    }
  });

  // 7. Blogs (Cloudflare D1)
  app.post('/api/blogs', async (req, res) => {
    try {
      const { blogs } = req.body;
      if (Array.isArray(blogs)) {
        await saveBlogs(blogs);
        res.json({ success: true });
      } else {
        res.status(400).json({ error: 'Expected blogs array' });
      }
    } catch (err: any) {
      res.status(500).json({ error: err?.message });
    }
  });

  app.delete('/api/blogs/:id', async (req, res) => {
    try {
      await deleteBlog(req.params.id);
      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ error: err?.message });
    }
  });

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', database: 'cloudflare-d1' });
  });

  // ==========================================================
  // Vite Middleware / Production Static Handling
  // ==========================================================
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Mesina Farms] Server running on http://0.0.0.0:${PORT}`);
    console.log(`[Database] Cloudflare D1 Engine active (Firebase removed).`);
  });
}

startServer();
