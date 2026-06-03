export type BlogAuthor = {
  name?: string | null;
  jobTitle?: string | null;
  bio?: string | null;
  avatarUrl?: string | null;
};

export type BlogAuthorLocales = Record<string, BlogAuthor>;

function hasAuthorContent(author: BlogAuthor): boolean {
  return !!(author.name || author.bio || author.jobTitle);
}

/** Normalize Witflow CMS author object from webhook/API. */
export function parseCmsAuthor(raw: unknown): BlogAuthor | null {
  if (!raw || typeof raw !== 'object') return null;
  const o = raw as Record<string, unknown>;
  const name = typeof o.name === 'string' ? o.name : null;
  const jobTitle =
    typeof o.jobTitle === 'string'
      ? o.jobTitle
      : typeof o.job_title === 'string'
        ? o.job_title
        : null;
  const bio = typeof o.bio === 'string' ? o.bio : null;
  const avatarUrl =
    typeof o.avatarUrl === 'string'
      ? o.avatarUrl
      : typeof o.avatar_url === 'string'
        ? o.avatar_url
        : null;

  if (!name && !jobTitle && !bio && !avatarUrl) return null;

  return { name, jobTitle, bio, avatarUrl };
}

/**
 * Author for the active route locale only — never substitute another locale's bio.
 * Legacy flat columns are used only for English until webhook backfill populates `author`.
 */
export function resolveBlogAuthor(
  post: {
    author?: BlogAuthorLocales | null;
    author_name?: string | null;
    author_job_title?: string | null;
    author_bio?: string | null;
    author_avatar_url?: string | null;
  },
  locale: string,
): BlogAuthor | null {
  const authors = post.author;
  if (authors && typeof authors === 'object' && Object.keys(authors).length > 0) {
    const localized = authors[locale];
    if (localized && hasAuthorContent(localized)) {
      return localized;
    }
    return null;
  }

  if (locale === 'en' && (post.author_name || post.author_bio || post.author_job_title)) {
    return {
      name: post.author_name,
      jobTitle: post.author_job_title,
      bio: post.author_bio,
      avatarUrl: post.author_avatar_url,
    };
  }

  return null;
}
