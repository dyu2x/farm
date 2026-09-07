-- ============================================================
-- Mesina Farms - Cloudflare D1 Database Schema
-- Serverless SQLite at the Edge (Replacing Firebase)
-- ============================================================
-- You can execute this schema directly via Cloudflare Wrangler CLI:
-- npx wrangler d1 execute mesina-farms-db --file=d1-schema.sql
-- ============================================================

-- 1. Fingerlings Products & Inventory
CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  size_inches TEXT NOT NULL,
  size_cm TEXT NOT NULL,
  stock_count INTEGER NOT NULL DEFAULT 0,
  low_stock_threshold INTEGER NOT NULL DEFAULT 1000,
  base_price REAL NOT NULL DEFAULT 0,
  is_active INTEGER NOT NULL DEFAULT 1,
  pricing_tiers TEXT, -- JSON array of pricing tiers
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

-- 2. Customer Order Inquiries
CREATE TABLE IF NOT EXISTS inquiries (
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
  status TEXT DEFAULT 'new', -- 'new' | 'contacted' | 'reserved' | 'cancelled'
  contacted INTEGER DEFAULT 0,
  contacted_by TEXT,
  contacted_at TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);

-- 3. System & Farm Settings
CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  data TEXT NOT NULL, -- JSON blob of full settings
  updated_at TEXT DEFAULT (datetime('now'))
);

-- 4. Aquaculture Fish Care & Farm Blog Articles
CREATE TABLE IF NOT EXISTS blogs (
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
);

-- 5. Rotating Hero Banner Pictures
CREATE TABLE IF NOT EXISTS hero_images (
  id TEXT PRIMARY KEY,
  url TEXT NOT NULL,
  caption TEXT,
  sub_caption TEXT,
  active INTEGER DEFAULT 1,
  order_idx INTEGER DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now'))
);

-- 6. About Us Facility Slides
CREATE TABLE IF NOT EXISTS about_slides (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  subtitle TEXT,
  image_url TEXT NOT NULL,
  order_idx INTEGER DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now'))
);

-- 7. Why Choose Us Highlights
CREATE TABLE IF NOT EXISTS why_choose_us (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL,
  order_idx INTEGER DEFAULT 0
);

-- 8. Admin Accounts & Roles
CREATE TABLE IF NOT EXISTS admin_users (
  id TEXT PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'staff', -- 'super_admin' | 'manager' | 'staff'
  full_name TEXT NOT NULL,
  created_at TEXT DEFAULT (datetime('now'))
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_products_active ON products(is_active);
CREATE INDEX IF NOT EXISTS idx_inquiries_status ON inquiries(status);
CREATE INDEX IF NOT EXISTS idx_blogs_slug ON blogs(slug);
