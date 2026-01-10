-- Bilingual Blog Database Schema for Supabase
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Posts table
CREATE TABLE IF NOT EXISTS posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug VARCHAR(255) UNIQUE NOT NULL,

    -- English content
    title_en VARCHAR(500) NOT NULL,
    content_en TEXT NOT NULL,
    excerpt_en VARCHAR(1000) NOT NULL,
    meta_description_en VARCHAR(160),

    -- Arabic content
    title_ar VARCHAR(500) NOT NULL,
    content_ar TEXT NOT NULL,
    excerpt_ar VARCHAR(1000) NOT NULL,
    meta_description_ar VARCHAR(160),

    -- Categorization
    category VARCHAR(50) NOT NULL CHECK (category IN ('news', 'how-to', 'tutorial', 'insights')),
    tags TEXT[] DEFAULT '{}',

    -- Media
    cover_image VARCHAR(500),
    cover_image_alt_en VARCHAR(255),
    cover_image_alt_ar VARCHAR(255),

    -- Metadata
    author VARCHAR(100) DEFAULT 'Abo-Elmakarem Shohoud',
    reading_time_minutes INTEGER DEFAULT 5,
    featured BOOLEAN DEFAULT FALSE,
    published BOOLEAN DEFAULT TRUE,

    -- Source tracking (for news articles)
    source_url VARCHAR(500),
    source_name VARCHAR(100),

    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    published_at TIMESTAMPTZ DEFAULT NOW(),

    -- Search vectors for full-text search
    search_vector_en TSVECTOR,
    search_vector_ar TSVECTOR
);

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug VARCHAR(50) UNIQUE NOT NULL,
    name_en VARCHAR(100) NOT NULL,
    name_ar VARCHAR(100) NOT NULL,
    description_en TEXT,
    description_ar TEXT,
    icon VARCHAR(50),
    color VARCHAR(7),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tags table
CREATE TABLE IF NOT EXISTS tags (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug VARCHAR(50) UNIQUE NOT NULL,
    name_en VARCHAR(100) NOT NULL,
    name_ar VARCHAR(100) NOT NULL,
    post_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_posts_slug ON posts(slug);
CREATE INDEX IF NOT EXISTS idx_posts_category ON posts(category);
CREATE INDEX IF NOT EXISTS idx_posts_published_at ON posts(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_posts_featured ON posts(featured) WHERE featured = TRUE;
CREATE INDEX IF NOT EXISTS idx_posts_published ON posts(published) WHERE published = TRUE;
CREATE INDEX IF NOT EXISTS idx_posts_tags ON posts USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_posts_search_en ON posts USING GIN(search_vector_en);
CREATE INDEX IF NOT EXISTS idx_posts_search_ar ON posts USING GIN(search_vector_ar);

-- Function to update search vectors and timestamps
CREATE OR REPLACE FUNCTION update_post_metadata()
RETURNS TRIGGER AS $$
BEGIN
    NEW.search_vector_en := to_tsvector('english', COALESCE(NEW.title_en, '') || ' ' || COALESCE(NEW.excerpt_en, '') || ' ' || COALESCE(NEW.content_en, ''));
    NEW.search_vector_ar := to_tsvector('simple', COALESCE(NEW.title_ar, '') || ' ' || COALESCE(NEW.excerpt_ar, '') || ' ' || COALESCE(NEW.content_ar, ''));
    NEW.updated_at := NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for automatic updates
DROP TRIGGER IF EXISTS posts_metadata_update ON posts;
CREATE TRIGGER posts_metadata_update
    BEFORE INSERT OR UPDATE ON posts
    FOR EACH ROW
    EXECUTE FUNCTION update_post_metadata();

-- Insert default categories
INSERT INTO categories (slug, name_en, name_ar, description_en, description_ar, icon, color) VALUES
    ('news', 'News', 'أخبار', 'Latest news in AI, software, and automation', 'آخر الأخبار في الذكاء الاصطناعي والبرمجيات والأتمتة', 'HiNewspaper', '#6366f1'),
    ('how-to', 'How-To Guides', 'دليل عملي', 'Step-by-step tutorials and guides', 'شروحات ودلائل خطوة بخطوة', 'HiLightBulb', '#8b5cf6'),
    ('tutorial', 'Tutorials', 'دروس تعليمية', 'In-depth technical tutorials', 'دروس تقنية متعمقة', 'HiCode', '#ec4899'),
    ('insights', 'Insights', 'رؤى', 'Industry insights and analysis', 'رؤى وتحليلات الصناعة', 'HiChartBar', '#10b981')
ON CONFLICT (slug) DO NOTHING;

-- Row Level Security (RLS)
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;

-- Public read access for published posts
DROP POLICY IF EXISTS "Public can read published posts" ON posts;
CREATE POLICY "Public can read published posts" ON posts
    FOR SELECT USING (published = TRUE);

DROP POLICY IF EXISTS "Public can read categories" ON categories;
CREATE POLICY "Public can read categories" ON categories
    FOR SELECT USING (TRUE);

DROP POLICY IF EXISTS "Public can read tags" ON tags;
CREATE POLICY "Public can read tags" ON tags
    FOR SELECT USING (TRUE);

-- Service role can do everything (for the AI agent)
DROP POLICY IF EXISTS "Service role full access posts" ON posts;
CREATE POLICY "Service role full access posts" ON posts
    FOR ALL USING (auth.role() = 'service_role');
