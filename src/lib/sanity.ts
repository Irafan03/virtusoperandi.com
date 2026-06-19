import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';
import type { SanityImageSource } from '@sanity/image-url/lib/types/types';

export const sanity = createClient({
  projectId: import.meta.env.SANITY_PROJECT_ID,
  dataset:   import.meta.env.SANITY_DATASET ?? 'production',
  apiVersion: '2024-01-01',
  useCdn: true,
});

const builder = imageUrlBuilder(sanity);
export const urlFor = (source: SanityImageSource) => builder.image(source);

// ── Types ────────────────────────────────────────────────────

export interface Post {
  _id:         string;
  title:       string;
  slug:        string;
  date:        string;
  author:      string;
  excerpt:     string;
  body:        unknown[];   // Portable Text blocks
  coverImage?: { asset: SanityImageSource; alt: string };
  tags:        string[];
  readingTime?: number;
}

// ── Queries ──────────────────────────────────────────────────

const POST_FIELDS = `
  _id,
  title,
  "slug": slug.current,
  date,
  author,
  excerpt,
  body,
  coverImage { asset, alt },
  tags,
  readingTime
`;

/** All published posts, newest first */
export async function getAllPosts(): Promise<Post[]> {
  return sanity.fetch(
    `*[_type == "post" && status == "published"] | order(date desc) { ${POST_FIELDS} }`
  );
}

/** Single post by slug */
export async function getPost(slug: string): Promise<Post | null> {
  return sanity.fetch(
    `*[_type == "post" && status == "published" && slug.current == $slug][0] { ${POST_FIELDS} }`,
    { slug }
  );
}

/** All published slugs — used by getStaticPaths */
export async function getAllSlugs(): Promise<string[]> {
  const results: { slug: string }[] = await sanity.fetch(
    `*[_type == "post" && status == "published"] { "slug": slug.current }`
  );
  return results.map(r => r.slug);
}
