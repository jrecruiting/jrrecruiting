import type { ComponentType } from "react";

export type BlogPostMeta = {
  slug: string;
  title: string;
  description: string;
  publishedAt: string; // ISO date
  category: string;
};

export type BlogPost = {
  meta: BlogPostMeta;
  Content: ComponentType;
};

// Manually registered (not filesystem-scanned) so the list order, the
// sitemap, and generateStaticParams all read from one source of truth.
// Add new posts to content/blog/ and register them here, newest first.
import * as howToGetRecruited from "@/content/blog/how-to-get-recruited-for-college-sports";
import * as doCoachesLookAtProfiles from "@/content/blog/do-college-coaches-look-at-recruiting-profiles";
import * as jucoToFourYear from "@/content/blog/juco-to-four-year-transfer-recruiting-guide";

export const BLOG_POSTS: BlogPost[] = [
  { meta: jucoToFourYear.meta, Content: jucoToFourYear.default },
  { meta: doCoachesLookAtProfiles.meta, Content: doCoachesLookAtProfiles.default },
  { meta: howToGetRecruited.meta, Content: howToGetRecruited.default },
];

export function getBlogPost(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((post) => post.meta.slug === slug);
}
