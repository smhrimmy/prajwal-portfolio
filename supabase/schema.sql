-- Create projects table
CREATE TABLE projects (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  codename TEXT,
  description TEXT,
  tags JSONB,
  category TEXT,
  github TEXT,
  live TEXT,
  featured BOOLEAN DEFAULT false,
  accent TEXT
);

-- Create site table (only holds 1 row)
CREATE TABLE site (
  id INTEGER PRIMARY KEY DEFAULT 1,
  name TEXT,
  role TEXT,
  bio TEXT,
  email TEXT,
  location TEXT,
  "calendarUrl" TEXT
);

-- Create skills table
CREATE TABLE skills (
  id SERIAL PRIMARY KEY,
  category TEXT NOT NULL,
  items JSONB NOT NULL
);

-- Create theme table (only holds 1 row)
CREATE TABLE IF NOT EXISTS theme (
  id INTEGER PRIMARY KEY DEFAULT 1,
  "accentColor" TEXT,
  "glassOpacity" TEXT,
  "borderRadius" TEXT,
  font TEXT
);

-----------------------------------------------------
-- ENTERPRISE AI CMS & BLOG MANAGEMENT SYSTEM
-----------------------------------------------------

-- Authors
CREATE TABLE IF NOT EXISTS authors (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  bio TEXT,
  avatar_url TEXT,
  twitter_handle TEXT,
  github_handle TEXT
);

-- Categories
CREATE TABLE IF NOT EXISTS categories (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT
);

-- Tags
CREATE TABLE IF NOT EXISTS tags (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL
);

-- Articles
CREATE TABLE IF NOT EXISTS articles (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  excerpt TEXT,
  content_md TEXT,
  content_html TEXT,
  author_id TEXT REFERENCES authors(id),
  category_id TEXT REFERENCES categories(id),
  status TEXT DEFAULT 'draft', -- draft, in_review, scheduled, published, archived
  reading_time INTEGER DEFAULT 0,
  word_count INTEGER DEFAULT 0,
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Article Tags (Many-to-Many)
CREATE TABLE IF NOT EXISTS article_tags (
  article_id TEXT REFERENCES articles(id) ON DELETE CASCADE,
  tag_id TEXT REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (article_id, tag_id)
);

-- Article SEO
CREATE TABLE IF NOT EXISTS article_seo (
  article_id TEXT PRIMARY KEY REFERENCES articles(id) ON DELETE CASCADE,
  meta_title TEXT,
  meta_description TEXT,
  canonical_url TEXT,
  focus_keyword TEXT,
  og_image TEXT,
  twitter_card TEXT,
  json_ld JSONB
);

-- Article Revisions (Autosaves & Version History)
CREATE TABLE IF NOT EXISTS article_revisions (
  id TEXT PRIMARY KEY,
  article_id TEXT REFERENCES articles(id) ON DELETE CASCADE,
  content_snapshot TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Media System
CREATE TABLE IF NOT EXISTS media (
  id TEXT PRIMARY KEY,
  url TEXT NOT NULL,
  filename TEXT NOT NULL,
  alt_text TEXT,
  type TEXT, -- image/webp, video/mp4, etc.
  size INTEGER,
  width INTEGER,
  height INTEGER,
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Analytics (Lightweight internal tracking)
CREATE TABLE IF NOT EXISTS analytics (
  id TEXT PRIMARY KEY,
  article_id TEXT REFERENCES articles(id) ON DELETE CASCADE,
  views INTEGER DEFAULT 0,
  unique_visitors INTEGER DEFAULT 0,
  click_through_rate NUMERIC,
  last_calculated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
