import type { MetadataRoute } from "next";
import { BLOG_POSTS } from "@/lib/blog-posts";

const APP_URL = process.env.AUTH_URL || "http://localhost:3000";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "",
    "/how-it-works",
    "/pricing",
    "/about",
    "/testimonials",
    "/blog",
    "/contact",
    "/sign-in",
    "/sign-up",
  ];

  const staticRoutes: MetadataRoute.Sitemap = routes.map((route) => ({
    url: `${APP_URL}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : 0.7,
  }));

  const blogRoutes: MetadataRoute.Sitemap = BLOG_POSTS.map((post) => ({
    url: `${APP_URL}/blog/${post.meta.slug}`,
    lastModified: new Date(post.meta.publishedAt),
    changeFrequency: "yearly",
    priority: 0.6,
  }));

  return [...staticRoutes, ...blogRoutes];
}
