import { designCarouselProjects } from '@/lib/designCarouselProjects';

export type ProjectNavigationCategory =
  | 'animacao'
  | 'audiovisual'
  | 'design'
  | 'marketing-social'
  | 'marketing-content'
  | 'projetos-sociais';

export const PROJECT_CATEGORY_SLUG_ORDER: Record<ProjectNavigationCategory, readonly string[]> = {
  animacao: [
    'ultima-gota',
    'likewise',
    'medwater',
    'one-select-properties',
    'mia',
    'barturs',
    'lets-communicate',
    'kipt',
    'emjogo',
    'travel-tech-partners',
    'toma-la-da-ca',
  ],
  audiovisual: [
    'witfy',
    'dias-medievais-de-castro-marim',
    'details-old-course-vilamoura',
    'pro-am-vilamoura',
    'dom-jose-beach-hotel',
    'designer-outlet-algarve',
    'ibc-security',
    'indasa',
    'rocamar-beach-hotel',
    'kubidoce',
    'odyssea',
    'the-originals',
    'ria-shopping',
    'albufeira-digital-nomads',
    'parque-mineiro-aljustrel',
    'fujifilm',
    'algarseafood',
    'liga-portuguesa-contra-o-cancro',
  ],
  design: designCarouselProjects.map((project) => project.slug),
  'marketing-social': [
    'dental-hpa',
    'albufeira-digital-nomads',
    'kubidoce',
    'rb-woodfinish',
    'adm-24',
    'nature-soul-food',
    'jardim-aurora',
  ],
  'marketing-content': [
    'dias-medievais-de-castro-marim',
    'mia',
    'witfy',
    'pro-am-vilamoura',
    'dom-jose-beach-hotel',
    'ria-shopping',
  ],
  'projetos-sociais': [
    'liga-portuguesa-contra-o-cancro',
    'aequum',
    'hackathon',
    'social-hackathon',
    'refood',
  ],
};

const CATEGORY_RESOLUTION_ORDER: ProjectNavigationCategory[] = [
  'animacao',
  'audiovisual',
  'design',
  'marketing-content',
  'marketing-social',
  'projetos-sociais',
];

const TAG_TO_CATEGORY: Partial<Record<string, ProjectNavigationCategory>> = {
  animacao: 'animacao',
  video: 'audiovisual',
  design: 'design',
  marketing: 'marketing-social',
  'projetos-sociais': 'projetos-sociais',
};

export function isProjectNavigationCategory(
  value: string | undefined
): value is ProjectNavigationCategory {
  return value != null && value in PROJECT_CATEGORY_SLUG_ORDER;
}

export function projectDetailHref(
  slug: string,
  category?: ProjectNavigationCategory
): `/projetos/${string}` | `/projetos/${string}?categoria=${ProjectNavigationCategory}` {
  if (!category) return `/projetos/${slug}`;
  return `/projetos/${slug}?categoria=${category}`;
}

export function categoryPageHref(
  category: ProjectNavigationCategory
): '/animacao' | '/audiovisual' | '/design' | '/marketing' | '/projetos-sociais' {
  switch (category) {
    case 'animacao':
      return '/animacao';
    case 'audiovisual':
      return '/audiovisual';
    case 'design':
      return '/design';
    case 'marketing-social':
    case 'marketing-content':
      return '/marketing';
    case 'projetos-sociais':
      return '/projetos-sociais';
    default: {
      const _exhaustive: never = category;
      return _exhaustive;
    }
  }
}

export function categoryPageLabel(
  category: ProjectNavigationCategory,
  locale: string
): string {
  const labels: Record<ProjectNavigationCategory, Record<string, string>> = {
    animacao: { pt: 'Animação', en: 'Animation', fr: 'Animation' },
    audiovisual: { pt: 'Audiovisual', en: 'Audiovisual', fr: 'Audiovisual' },
    design: { pt: 'Design', en: 'Design', fr: 'Design' },
    'marketing-social': { pt: 'Marketing', en: 'Marketing', fr: 'Marketing' },
    'marketing-content': { pt: 'Marketing', en: 'Marketing', fr: 'Marketing' },
    'projetos-sociais': {
      pt: 'Projetos Sociais',
      en: 'Social Projects',
      fr: 'Projets Sociaux',
    },
  };

  return labels[category][locale] || labels[category].pt;
}

function categoriesContainingSlug(slug: string): ProjectNavigationCategory[] {
  return CATEGORY_RESOLUTION_ORDER.filter((category) =>
    PROJECT_CATEGORY_SLUG_ORDER[category].includes(slug)
  );
}

export function resolveProjectNavigationCategory(
  slug: string,
  tagKeys: string[],
  requestedCategory?: string
): ProjectNavigationCategory | null {
  if (isProjectNavigationCategory(requestedCategory)) {
    if (PROJECT_CATEGORY_SLUG_ORDER[requestedCategory].includes(slug)) {
      return requestedCategory;
    }
  }

  const matches = categoriesContainingSlug(slug);
  if (matches.length === 0) return null;
  if (matches.length === 1) return matches[0];

  for (const tagKey of Object.keys(TAG_TO_CATEGORY)) {
    if (!tagKeys.includes(tagKey)) continue;
    const preferred = TAG_TO_CATEGORY[tagKey];
    if (preferred && matches.includes(preferred)) return preferred;
  }

  return matches[0];
}

type ProjectNavRecord = {
  title: Record<string, string>;
  slug: Record<string, string>;
};

export async function fetchAdjacentProjectsInCategory(
  supabase: NonNullable<Awaited<ReturnType<typeof import('@/lib/supabase/server').createClient>>>,
  currentSlug: string,
  category: ProjectNavigationCategory
): Promise<{ prev: ProjectNavRecord | null; next: ProjectNavRecord | null }> {
  const orderedSlugs = PROJECT_CATEGORY_SLUG_ORDER[category];
  const currentIndex = orderedSlugs.indexOf(currentSlug);
  if (currentIndex === -1) return { prev: null, next: null };

  const prevSlug = currentIndex > 0 ? orderedSlugs[currentIndex - 1] : null;
  const nextSlug =
    currentIndex < orderedSlugs.length - 1 ? orderedSlugs[currentIndex + 1] : null;

  const slugsToFetch = [prevSlug, nextSlug].filter((value): value is string => Boolean(value));
  if (slugsToFetch.length === 0) return { prev: null, next: null };

  const filter = slugsToFetch.map((value) => `slug->>pt.eq.${value}`).join(',');
  const { data } = await supabase
    .from('projects')
    .select('title, slug')
    .eq('status', 'published')
    .or(filter);

  const byPtSlug = new Map(
    (data ?? []).map((project) => [project.slug?.pt as string, project as ProjectNavRecord])
  );

  return {
    prev: prevSlug ? byPtSlug.get(prevSlug) ?? null : null,
    next: nextSlug ? byPtSlug.get(nextSlug) ?? null : null,
  };
}
