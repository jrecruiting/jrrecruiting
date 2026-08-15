import type { MediaAsset } from "@prisma/client";
import { getVideoEmbedUrl } from "@/lib/video-embed";
import { Card, CardContent } from "@/components/ui/card";
import { FilmSlate } from "@phosphor-icons/react/dist/ssr";

// Renders a player's videos in submitted order. A single video keeps the
// original look (its own title as the section heading); multiple videos get
// a generic heading with each clip's title shown above it instead, since
// per-clip titles matter more once there's more than one to tell apart.
export function HighlightVideos({ videos }: { videos: MediaAsset[] }) {
  if (videos.length === 0) return null;

  return (
    <Card className="border-border/60">
      <CardContent className="flex flex-col gap-5">
        <div className="flex items-center gap-2">
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-gold/10 text-gold">
            <FilmSlate className="h-3.5 w-3.5" weight="duotone" />
          </span>
          <p className="text-xs font-bold uppercase tracking-wide">
            {videos.length === 1 ? videos[0].title || "Highlight video" : "Highlight Videos"}
          </p>
        </div>
        {videos.map((video) => {
          const embedUrl = getVideoEmbedUrl(video.provider, video.url);
          return (
            <div key={video.id} className="flex flex-col gap-1.5">
              {videos.length > 1 && video.title && (
                <p className="text-xs font-medium text-muted-foreground">{video.title}</p>
              )}
              {embedUrl ? (
                <div className="aspect-video w-full overflow-hidden rounded-lg border border-border/60">
                  <iframe
                    src={embedUrl}
                    className="h-full w-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    title={video.title || "Highlight video"}
                  />
                </div>
              ) : (
                <a
                  href={video.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-gold hover:underline"
                >
                  {video.url}
                </a>
              )}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
