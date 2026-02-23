import { createClient } from '@/lib/supabase/server';

export type ProjectWithTags = {
  id: string;
  title: Record<string, string>;
  slug: Record<string, string>;
  client_name: string | null;
  featured_image_path: string | null;
  gallery: { video_url?: string } | null;
  project_project_tags: { project_tags: { key: string; label: Record<string, string> } }[];
};

const CATEGORY_IDS: Record<string, string> = {
  design:           '2073fd02-2302-4601-a2c3-bbe8a7a1d99f',
  marketing:        'd5bee894-e5fd-45f3-8047-6d825ac9b2ff',
  audiovisual:      '09380c9b-e06e-48d7-bb6b-337ec26a2214',
  animacao:         '663e84b9-1300-454a-be62-d971e8921067',
  'projetos-sociais': 'aa449a51-19e5-4786-84b7-d09e0429788f',
};

export async function fetchProjectsByCategory(
  categoryKey: keyof typeof CATEGORY_IDS
): Promise<ProjectWithTags[]> {
  const supabase = await createClient();
  if (!supabase) return [];

  const categoryId = CATEGORY_IDS[categoryKey];
  if (!categoryId) return [];

  // Step 1: Get all project IDs that belong to this category via the junction tables
  const { data: links } = await supabase
    .from('category_section_projects')
    .select(`project_id, project_category_sections!inner(category_id)`)
    .eq('project_category_sections.category_id', categoryId);

  const projectIds = links?.map(l => l.project_id).filter(Boolean) ?? [];
  if (projectIds.length === 0) return [];

  // Step 2: Fetch those projects with their tags
  const { data: projects } = await supabase
    .from('projects')
    .select(`id, title, slug, client_name, featured_image_path, gallery,
             project_project_tags(project_tags(key, label))`)
    .in('id', projectIds)
    .eq('status', 'published')
    .order('published_at', { ascending: false });

  return (projects ?? []) as ProjectWithTags[];
}
