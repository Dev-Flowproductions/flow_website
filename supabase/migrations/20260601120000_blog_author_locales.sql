-- Per-locale author data from Witflow CMS (translations.{locale}.author)
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS author jsonb;
