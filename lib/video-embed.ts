import type { MediaProvider } from "@prisma/client";

// Only YouTube and Vimeo offer a public, embeddable iframe URL from a plain
// share link. Hudl requires their own player integration and "OTHER" is
// unknowable, so both fall back to a styled link instead of an embed.
export function getVideoEmbedUrl(provider: MediaProvider, url: string): string | null {
  if (provider === "YOUTUBE") {
    const id = extractYouTubeId(url);
    return id ? `https://www.youtube.com/embed/${id}` : null;
  }
  if (provider === "VIMEO") {
    const id = extractVimeoId(url);
    return id ? `https://player.vimeo.com/video/${id}` : null;
  }
  return null;
}

function extractYouTubeId(url: string): string | null {
  try {
    const parsed = new URL(url);
    if (parsed.hostname.includes("youtu.be")) {
      return parsed.pathname.slice(1).split("/")[0] || null;
    }
    if (parsed.pathname.startsWith("/shorts/")) {
      return parsed.pathname.split("/")[2] || null;
    }
    if (parsed.pathname.startsWith("/embed/")) {
      return parsed.pathname.split("/")[2] || null;
    }
    return parsed.searchParams.get("v");
  } catch {
    return null;
  }
}

function extractVimeoId(url: string): string | null {
  try {
    const parsed = new URL(url);
    const match = parsed.pathname.match(/(\d+)/);
    return match ? match[1] : null;
  } catch {
    return null;
  }
}
