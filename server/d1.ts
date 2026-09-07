import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config();
import {
  INITIAL_PRODUCTS,
  INITIAL_BLOGS,
  INITIAL_HERO_IMAGES,
  INITIAL_ABOUT_SLIDES,
  INITIAL_WHY_CHOOSE_US,
  INITIAL_SETTINGS,
  INITIAL_INQUIRIES,
  INITIAL_ADMIN_USERS,
} from '../src/data/initialData';

export interface D1StatusResponse {
  engine: string;
  configured: boolean;
  connected: boolean;
  mode: 'cloudflare-d1' | 'local-fallback';
  accountId: string;
  databaseId: string;
  databaseName: string;
  tables: Record<string, number>;
  message: string;
  lastChecked: string;
}

const LOCAL_STORE_FILE = path.join(process.cwd(), '.d1_local_store.json');

// Memory store fallback
interface DatabaseStore {
  products: any[];
  inquiries: any[];
  settings: any;
  blogs: any[];
  heroImages: any[];
  aboutSlides: any[];
  whyChooseUs: any[];
  adminUsers: any[];
}

function loadLocalStore(): DatabaseStore {
  try {
    if (fs.existsSync(LOCAL_STORE_FILE)) {
      const content = fs.readFileSync(LOCAL_STORE_FILE, 'utf-8');
      return JSON.parse(content);
    }
  } catch (err) {
    console.warn('[D1 Store] Failed reading local store fallback, initializing new:', err);
  }

  const initialStore: DatabaseStore = {
    products: INITIAL_PRODUCTS,
    inquiries: INITIAL_INQUIRIES,
    settings: INITIAL_SETTINGS,
    blogs: INITIAL_BLOGS,
    heroImages: INITIAL_HERO_IMAGES,
    aboutSlides: INITIAL_ABOUT_SLIDES,
    whyChooseUs: INITIAL_WHY_CHOOSE_US,
    adminUsers: INITIAL_ADMIN_USERS,
  };

  saveLocalStore(initialStore);
  return initialStore;
}

function saveLocalStore(store: DatabaseStore) {
  try {
    fs.writeFileSync(LOCAL_STORE_FILE, JSON.stringify(store, null, 2), 'utf-8');
  } catch (err) {
    console.error('[D1 Store] Failed saving local store fallback:', err);
  }
}

let memoryStore: DatabaseStore = loadLocalStore();

export function getD1Config() {
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID || memoryStore.settings?.cloudflareD1Config?.accountId || '';
  const databaseId = process.env.CLOUDFLARE_D1_DATABASE_ID || memoryStore.settings?.cloudflareD1Config?.databaseId || '';
  const apiToken =
    process.env.CLOUDFLARE_API_TOKEN ||
    process.env.CLOUDFLARE_API_KEY ||
    'cfut_f8Z0EDKW6ou1cuHbyap72poiA3JAspKhDRIy9EaT84d0f6b9';
  const isConfigured = Boolean(accountId && databaseId && apiToken);

  return {
    accountId,
    databaseId,
    apiToken,
    isConfigured,
  };
}

/**
 * Execute a SQL query directly against Cloudflare D1 REST API
 */
export async function executeD1Query<T = any>(
  sql: string,
  params: any[] = []
): Promise<{ success: boolean; results: T[]; error?: string }> {
  const { accountId, databaseId, apiToken, isConfigured } = getD1Config();

  if (!isConfigured) {
    return {
      success: false,
      results: [],
      error: 'Cloudflare D1 credentials (CLOUDFLARE_ACCOUNT_ID, CLOUDFLARE_D1_DATABASE_ID, CLOUDFLARE_API_TOKEN) are not set in environment.',
    };
  }

  const url = `https://api.cloudflare.com/client/v4/accounts/${accountId}/d1/database/${databaseId}/query`;

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ sql, params }),
    });

    const data: any = await res.json();

    if (!res.ok || !data.success) {
      const errMsg = data.errors?.[0]?.message || `HTTP ${res.status}: ${res.statusText}`;
      return { success: false, results: [], error: errMsg };
    }

    const firstResult = data.result?.[0];
    return {
      success: true,
      results: (firstResult?.results as T[]) || [],
    };
  } catch (err: any) {
    return {
      success: false,
      results: [],
      error: err?.message || 'Network error querying Cloudflare D1',
    };
  }
}

/**
 * Initialize D1 Schema tables in Cloudflare D1
 */
export async function initializeD1Schema(): Promise<{ success: boolean; message: string }> {
  const { isConfigured } = getD1Config();
  if (!isConfigured) {
    return {
      success: true,
      message: 'Cloudflare D1 credentials not provided; operating in local database mode.',
    };
  }

  const tables = [
    `CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      size_inches TEXT NOT NULL,
      size_cm TEXT NOT NULL,
      stock_count INTEGER NOT NULL DEFAULT 0,
      low_stock_threshold INTEGER NOT NULL DEFAULT 1000,
      base_price REAL NOT NULL DEFAULT 0,
      is_active INTEGER NOT NULL DEFAULT 1,
      pricing_tiers TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );`,
    `CREATE TABLE IF NOT EXISTS inquiries (
      id TEXT PRIMARY KEY,
      full_name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT NOT NULL,
      location TEXT,
      product_id TEXT,
      product_name TEXT,
      size_preference TEXT,
      quantity INTEGER NOT NULL,
      estimated_price_per_piece REAL DEFAULT 0,
      estimated_total_php REAL DEFAULT 0,
      preferred_date TEXT,
      purpose TEXT,
      notes TEXT,
      status TEXT DEFAULT 'new',
      contacted INTEGER DEFAULT 0,
      contacted_by TEXT,
      contacted_at TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    );`,
    `CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      data TEXT NOT NULL,
      updated_at TEXT DEFAULT (datetime('now'))
    );`,
    `CREATE TABLE IF NOT EXISTS blogs (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      excerpt TEXT,
      content TEXT NOT NULL,
      category TEXT NOT NULL,
      read_time TEXT,
      published_at TEXT,
      cover_image TEXT,
      author TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    );`,
    `CREATE TABLE IF NOT EXISTS hero_images (
      id TEXT PRIMARY KEY,
      url TEXT NOT NULL,
      caption TEXT,
      sub_caption TEXT,
      active INTEGER DEFAULT 1,
      order_idx INTEGER DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now'))
    );`,
    `CREATE TABLE IF NOT EXISTS about_slides (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      subtitle TEXT,
      image_url TEXT NOT NULL,
      order_idx INTEGER DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now'))
    );`,
    `CREATE TABLE IF NOT EXISTS admin_users (
      id TEXT PRIMARY KEY,
      username TEXT UNIQUE NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'staff',
      full_name TEXT NOT NULL,
      created_at TEXT DEFAULT (datetime('now'))
    );`,
  ];

  for (const statement of tables) {
    const res = await executeD1Query(statement);
    if (!res.success) {
      return { success: false, message: `Failed creating D1 table: ${res.error}` };
    }
  }

  return { success: true, message: 'Cloudflare D1 tables successfully initialized.' };
}

/**
 * Get D1 status and row statistics
 */
export async function getD1Status(): Promise<D1StatusResponse> {
  const { accountId, databaseId, isConfigured } = getD1Config();

  if (isConfigured) {
    const check = await executeD1Query('SELECT 1 as live');
    if (check.success) {
      // Gather row counts
      const counts: Record<string, number> = {};
      const tables = ['products', 'inquiries', 'settings', 'blogs', 'hero_images', 'about_slides', 'admin_users'];
      for (const tbl of tables) {
        const c = await executeD1Query(`SELECT count(*) as total FROM ${tbl}`);
        counts[tbl] = c.results?.[0]?.total ?? 0;
      }

      return {
        engine: 'Cloudflare D1',
        configured: true,
        connected: true,
        mode: 'cloudflare-d1',
        accountId,
        databaseId,
        databaseName: 'mesina_farms_db',
        tables: counts,
        message: 'Successfully connected to Cloudflare D1 serverless SQLite edge database.',
        lastChecked: new Date().toISOString(),
      };
    } else {
      return {
        engine: 'Cloudflare D1',
        configured: true,
        connected: false,
        mode: 'local-fallback',
        accountId,
        databaseId,
        databaseName: 'mesina_farms_db',
        tables: {
          products: memoryStore.products.length,
          inquiries: memoryStore.inquiries.length,
          blogs: memoryStore.blogs.length,
        },
        message: `Cloudflare D1 credentials set, but connection test failed: ${check.error}. Using local fallback.`,
        lastChecked: new Date().toISOString(),
      };
    }
  }

  return {
    engine: 'Cloudflare D1',
    configured: false,
    connected: false,
    mode: 'local-fallback',
    accountId: 'not-configured',
    databaseId: 'mesina-farms-d1',
    databaseName: 'mesina_farms_db',
    tables: {
      products: memoryStore.products.length,
      inquiries: memoryStore.inquiries.length,
      blogs: memoryStore.blogs.length,
      heroImages: memoryStore.heroImages.length,
      aboutSlides: memoryStore.aboutSlides.length,
      adminUsers: memoryStore.adminUsers.length,
    },
    message: 'Running with local database engine. Configure CLOUDFLARE_ACCOUNT_ID, CLOUDFLARE_D1_DATABASE_ID, and CLOUDFLARE_API_TOKEN in Settings to sync directly with Cloudflare D1 edge.',
    lastChecked: new Date().toISOString(),
  };
}

// -------------------------------------------------------------
// Data Access Methods (Products, Inquiries, Settings, etc.)
// -------------------------------------------------------------

export async function getAllData() {
  const { isConfigured } = getD1Config();

  if (isConfigured) {
    try {
      const prodRes = await executeD1Query('SELECT * FROM products');
      const inqRes = await executeD1Query('SELECT * FROM inquiries ORDER BY created_at DESC');
      const setRes = await executeD1Query("SELECT data FROM settings WHERE key = 'main_settings'");
      const blogRes = await executeD1Query('SELECT * FROM blogs');
      const heroRes = await executeD1Query('SELECT * FROM hero_images ORDER BY order_idx ASC');
      const slideRes = await executeD1Query('SELECT * FROM about_slides ORDER BY order_idx ASC');

      if (prodRes.success && prodRes.results.length > 0) {
        const products = prodRes.results.map((r: any) => ({
          id: r.id,
          name: r.name,
          sizeInches: r.size_inches,
          sizeCm: r.size_cm,
          stockCount: r.stock_count,
          lowStockThreshold: r.low_stock_threshold,
          basePrice: r.base_price,
          isActive: Boolean(r.is_active),
          pricingTiers: r.pricing_tiers ? JSON.parse(r.pricing_tiers) : [],
        }));

        let parsedSettings = memoryStore.settings;
        if (setRes.success && setRes.results?.[0]?.data) {
          try {
            parsedSettings = JSON.parse(setRes.results[0].data);
          } catch {
            // fallback
          }
        }

        return {
          products,
          inquiries: inqRes.results || memoryStore.inquiries,
          settings: parsedSettings,
          blogs: blogRes.results || memoryStore.blogs,
          heroImages: heroRes.results || memoryStore.heroImages,
          aboutSlides: slideRes.results || memoryStore.aboutSlides,
          whyChooseUs: memoryStore.whyChooseUs,
          adminUsers: memoryStore.adminUsers,
        };
      }
    } catch (e) {
      console.warn('[D1] Query failed, using memory store:', e);
    }
  }

  return memoryStore;
}

export async function saveProducts(products: any[]) {
  memoryStore.products = products;
  saveLocalStore(memoryStore);

  const { isConfigured } = getD1Config();
  if (isConfigured) {
    for (const p of products) {
      const sql = `INSERT INTO products (id, name, size_inches, size_cm, stock_count, low_stock_threshold, base_price, is_active, pricing_tiers, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
        ON CONFLICT(id) DO UPDATE SET
          name = excluded.name,
          size_inches = excluded.size_inches,
          size_cm = excluded.size_cm,
          stock_count = excluded.stock_count,
          low_stock_threshold = excluded.low_stock_threshold,
          base_price = excluded.base_price,
          is_active = excluded.is_active,
          pricing_tiers = excluded.pricing_tiers,
          updated_at = datetime('now');`;
      await executeD1Query(sql, [
        p.id,
        p.name,
        p.sizeInches,
        p.sizeCm,
        p.stockCount,
        p.lowStockThreshold,
        p.basePrice,
        p.isActive ? 1 : 0,
        JSON.stringify(p.pricingTiers || []),
      ]);
    }
  }
}

export async function saveInquiry(inquiry: any) {
  const existingIdx = memoryStore.inquiries.findIndex((i) => i.id === inquiry.id);
  if (existingIdx >= 0) {
    memoryStore.inquiries[existingIdx] = inquiry;
  } else {
    memoryStore.inquiries = [inquiry, ...memoryStore.inquiries];
  }
  saveLocalStore(memoryStore);

  const { isConfigured } = getD1Config();
  if (isConfigured) {
    const sql = `INSERT INTO inquiries (
      id, full_name, email, phone, location, product_id, product_name, size_preference,
      quantity, estimated_price_per_piece, estimated_total_php, preferred_date, purpose, notes, status, contacted, contacted_by, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(id) DO UPDATE SET
      status = excluded.status,
      contacted = excluded.contacted,
      contacted_by = excluded.contacted_by;`;

    await executeD1Query(sql, [
      inquiry.id,
      inquiry.fullName,
      inquiry.email,
      inquiry.phone,
      inquiry.location || '',
      inquiry.productId || '',
      inquiry.productName || '',
      inquiry.sizePreference || '',
      inquiry.quantity || 0,
      inquiry.estimatedPricePerPiece || 0,
      inquiry.estimatedTotalPhp || 0,
      inquiry.preferredDate || '',
      inquiry.purpose || '',
      inquiry.notes || '',
      inquiry.status || 'new',
      inquiry.contacted ? 1 : 0,
      inquiry.contactedBy || '',
      inquiry.createdAt || new Date().toISOString(),
    ]);
  }
}

export async function deleteInquiry(id: string) {
  memoryStore.inquiries = memoryStore.inquiries.filter((i) => i.id !== id);
  saveLocalStore(memoryStore);

  const { isConfigured } = getD1Config();
  if (isConfigured) {
    await executeD1Query('DELETE FROM inquiries WHERE id = ?', [id]);
  }
}

export async function saveSettings(settings: any) {
  memoryStore.settings = settings;
  saveLocalStore(memoryStore);

  const { isConfigured } = getD1Config();
  if (isConfigured) {
    const sql = `INSERT INTO settings (key, data, updated_at)
      VALUES ('main_settings', ?, datetime('now'))
      ON CONFLICT(key) DO UPDATE SET
        data = excluded.data,
        updated_at = datetime('now');`;
    await executeD1Query(sql, [JSON.stringify(settings)]);
  }
}

export async function saveBlogs(blogs: any[]) {
  memoryStore.blogs = blogs;
  saveLocalStore(memoryStore);

  const { isConfigured } = getD1Config();
  if (isConfigured) {
    for (const b of blogs) {
      const sql = `INSERT INTO blogs (id, title, slug, excerpt, content, category, read_time, published_at, cover_image, author)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(id) DO UPDATE SET
          title = excluded.title,
          slug = excluded.slug,
          excerpt = excluded.excerpt,
          content = excluded.content,
          category = excluded.category,
          read_time = excluded.read_time,
          published_at = excluded.published_at,
          cover_image = excluded.cover_image,
          author = excluded.author;`;
      await executeD1Query(sql, [
        b.id,
        b.title,
        b.slug,
        b.excerpt,
        b.content,
        b.category,
        b.readTime,
        b.publishedAt,
        b.coverImage,
        b.author,
      ]);
    }
  }
}

export async function deleteBlog(id: string) {
  memoryStore.blogs = memoryStore.blogs.filter((b) => b.id !== id);
  saveLocalStore(memoryStore);

  const { isConfigured } = getD1Config();
  if (isConfigured) {
    await executeD1Query('DELETE FROM blogs WHERE id = ?', [id]);
  }
}
