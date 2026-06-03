-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles (linked to auth.users)
CREATE TABLE profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  role text NOT NULL DEFAULT 'editor' CHECK (role IN ('admin', 'editor')),
  created_at timestamptz DEFAULT now()
);

-- Services
CREATE TABLE services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  title jsonb NOT NULL,
  subtitle jsonb,
  "order" int NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Service items (sub-services)
CREATE TABLE service_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id uuid REFERENCES services(id) ON DELETE CASCADE,
  label jsonb NOT NULL,
  "order" int NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Team members
CREATE TABLE team_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  role_title jsonb NOT NULL,
  "order" int NOT NULL,
  photo_path text,
  is_active bool DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Testimonials
CREATE TABLE testimonials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  quote jsonb NOT NULL,
  person_name text,
  company_name text,
  avatar_path text,
  "order" int NOT NULL,
  is_featured bool DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Project categories
CREATE TABLE project_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  title jsonb NOT NULL,
  intro jsonb,
  "order" int NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Project category sections
CREATE TABLE project_category_sections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid REFERENCES project_categories(id) ON DELETE CASCADE,
  title jsonb,
  "order" int NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Projects
CREATE TABLE projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title jsonb NOT NULL,
  slug jsonb NOT NULL,
  summary jsonb,
  content jsonb,
  client_name text,
  year_label jsonb,
  published_at timestamptz,
  featured_image_path text,
  gallery jsonb,
  is_featured bool DEFAULT false,
  status text DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Project tags
CREATE TABLE project_tags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  label jsonb NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Project-Tag junction table
CREATE TABLE project_project_tags (
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE,
  tag_id uuid REFERENCES project_tags(id) ON DELETE CASCADE,
  PRIMARY KEY (project_id, tag_id)
);

-- Category section projects
CREATE TABLE category_section_projects (
  category_section_id uuid REFERENCES project_category_sections(id) ON DELETE CASCADE,
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE,
  "order" int NOT NULL,
  PRIMARY KEY (category_section_id, project_id)
);

-- Blog posts
CREATE TABLE blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title jsonb NOT NULL,
  slug jsonb NOT NULL,
  excerpt jsonb,
  content jsonb,
  featured_image_path text,
  author_name text DEFAULT 'Flow Productions',
  author_job_title text,
  author_bio text,
  author_avatar_url text,
  author jsonb,
  cms_id text,
  published_at timestamptz,
  status text DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Blog tags
CREATE TABLE blog_tags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  label jsonb NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Blog post-Tag junction table
CREATE TABLE blog_post_tags (
  post_id uuid REFERENCES blog_posts(id) ON DELETE CASCADE,
  tag_id uuid REFERENCES blog_tags(id) ON DELETE CASCADE,
  PRIMARY KEY (post_id, tag_id)
);

-- Newsletter subscribers
CREATE TABLE newsletter_subscribers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  locale text NOT NULL,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'unsubscribed')),
  consent_at timestamptz,
  source text,
  created_at timestamptz DEFAULT now()
);

-- Contact messages
CREATE TABLE contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  message text NOT NULL,
  locale text NOT NULL,
  consent bool NOT NULL,
  consent_at timestamptz,
  status text DEFAULT 'new' CHECK (status IN ('new', 'replied', 'archived')),
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_category_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_project_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE category_section_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_post_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Public read for published content

-- Services (public read)
CREATE POLICY "Public can view services"
  ON services FOR SELECT
  USING (true);

CREATE POLICY "Public can view service items"
  ON service_items FOR SELECT
  USING (true);

-- Team members (public read active members)
CREATE POLICY "Public can view active team members"
  ON team_members FOR SELECT
  USING (is_active = true);

-- Testimonials (public read featured)
CREATE POLICY "Public can view testimonials"
  ON testimonials FOR SELECT
  USING (true);

-- Project categories (public read)
CREATE POLICY "Public can view project categories"
  ON project_categories FOR SELECT
  USING (true);

CREATE POLICY "Public can view project category sections"
  ON project_category_sections FOR SELECT
  USING (true);

-- Projects (public read published only)
CREATE POLICY "Public can view published projects"
  ON projects FOR SELECT
  USING (status = 'published');

-- Project tags (public read)
CREATE POLICY "Public can view project tags"
  ON project_tags FOR SELECT
  USING (true);

CREATE POLICY "Public can view project-tag relations"
  ON project_project_tags FOR SELECT
  USING (true);

CREATE POLICY "Public can view category section projects"
  ON category_section_projects FOR SELECT
  USING (true);

-- Blog posts (public read published only)
CREATE POLICY "Public can view published blog posts"
  ON blog_posts FOR SELECT
  USING (status = 'published');

-- Blog tags (public read)
CREATE POLICY "Public can view blog tags"
  ON blog_tags FOR SELECT
  USING (true);

CREATE POLICY "Public can view blog post-tag relations"
  ON blog_post_tags FOR SELECT
  USING (true);

-- Contact messages (users can insert, admins can read all)
CREATE POLICY "Anyone can insert contact messages"
  ON contact_messages FOR INSERT
  WITH CHECK (true);

-- Newsletter subscribers (users can insert/update their own)
CREATE POLICY "Anyone can subscribe to newsletter"
  ON newsletter_subscribers FOR INSERT
  WITH CHECK (true);

-- Admin policies (full access for authenticated admins)
-- You'll need to create these for each table following this pattern:
CREATE POLICY "Admins full access to services"
  ON services FOR ALL
  USING (
    auth.role() = 'authenticated' AND
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Repeat similar admin policies for other tables...

-- Create indexes for performance
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_projects_published_at ON projects(published_at);
CREATE INDEX idx_blog_posts_status ON blog_posts(status);
CREATE INDEX idx_blog_posts_published_at ON blog_posts(published_at);
CREATE INDEX idx_service_items_service_id ON service_items(service_id);
CREATE INDEX idx_project_category_sections_category_id ON project_category_sections(category_id);

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = now();
   RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_blog_posts_updated_at BEFORE UPDATE ON blog_posts
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
