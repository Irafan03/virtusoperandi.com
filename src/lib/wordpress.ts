const BASE = 'https://cms.virtusoperandi.com/wp-json/wp/v2';

// ── Types ────────────────────────────────────────────────────

export interface WpPost {
  id:       number;
  slug:     string;
  date:     string;          // ISO 8601
  title:    { rendered: string };
  excerpt:  { rendered: string };
  content:  { rendered: string };
  tags:     number[];        // tag IDs — resolve via _embedded if needed
  _embedded?: {
    'wp:featuredmedia'?: [{ source_url: string; alt_text: string }];
    'wp:term'?:          [{ name: string; slug: string }[]][];
    author?:             [{ name: string }];
  };
}

// ── Helpers ──────────────────────────────────────────────────

export function coverUrl(post: WpPost): string | undefined {
  return post._embedded?.['wp:featuredmedia']?.[0]?.source_url;
}

/** First taxonomy term treated as the post category/tag label */
export function primaryTag(post: WpPost): string {
  return post._embedded?.['wp:term']?.[0]?.[0]?.name ?? '';
}

/** Slug of the first taxonomy term — used for filter matching */
export function categorySlug(post: WpPost): string {
  return post._embedded?.['wp:term']?.[0]?.[0]?.slug ?? '';
}

/** Author display name from embedded author */
export function authorName(post: WpPost): string {
  return post._embedded?.author?.[0]?.name ?? '';
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric',
  });
}

/** Strip HTML tags from WP excerpt */
export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').trim();
}

// ── API calls ────────────────────────────────────────────────

/** All published posts, newest first (max 100 per page — extend if needed) */
export async function getAllPosts(): Promise<WpPost[]> {
  const res = await fetch(
    `${BASE}/posts?_embed&status=publish&per_page=100&orderby=date&order=desc`,
    { headers: { Accept: 'application/json' } }
  );
  if (!res.ok) throw new Error(`WP API error ${res.status}: getAllPosts`);
  return res.json();
}

/** Single post by slug */
export async function getPostBySlug(slug: string): Promise<WpPost | null> {
  const res = await fetch(
    `${BASE}/posts?_embed&status=publish&slug=${encodeURIComponent(slug)}`,
    { headers: { Accept: 'application/json' } }
  );
  if (!res.ok) throw new Error(`WP API error ${res.status}: getPostBySlug(${slug})`);
  const posts: WpPost[] = await res.json();
  return posts[0] ?? null;
}
