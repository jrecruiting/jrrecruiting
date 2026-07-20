import type { MetadataRoute } from "next";

const APP_URL = process.env.AUTH_URL || "http://localhost:3000";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/dashboard", "/coach", "/players", "/search", "/admin", "/api"],
    },
    sitemap: `${APP_URL}/sitemap.xml`,
  };
}
