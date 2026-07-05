-- Create tables for the AI Blog CMS

-- Posts table
CREATE TABLE IF NOT EXISTS posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    excerpt TEXT,
    category TEXT DEFAULT 'Uncategorized',
    seo_title TEXT,
    meta_description TEXT,
    json_ld JSONB,
    read_time TEXT DEFAULT '5 min',
    image_url TEXT,
    status TEXT DEFAULT 'draft', -- 'draft' or 'published'
    published_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Categories table (optional for dropdowns)
CREATE TABLE IF NOT EXISTS categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT UNIQUE NOT NULL
);

-- Insert default categories
INSERT INTO categories (name) VALUES ('Frontend'), ('DevOps'), ('AI'), ('Design'), ('Career') ON CONFLICT DO NOTHING;

-- RLS (Row Level Security) - allow public read of published posts, but restrict writes.
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to published posts" ON posts
    FOR SELECT USING (status = 'published');

-- Note: The admin will use a service role key on the backend to bypass RLS,
-- or we can use the JWT auth on our TanStack start server to bypass it safely.
