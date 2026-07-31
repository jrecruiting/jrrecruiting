import Link from "next/link";
import type { ReactNode } from "react";

// Announcements support one lightweight markdown-style pattern for linking
// to an athlete's profile: [Display Name](/players/playerId). The admin
// announcement form inserts this automatically via a player picker, so
// nobody has to type player IDs by hand.
const LINK_PATTERN = /\[([^\]]+)\]\((\/players\/[a-zA-Z0-9_-]+)\)/g;

export function renderAnnouncementBody(body: string): ReactNode[] {
  const parts: ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let key = 0;

  LINK_PATTERN.lastIndex = 0;
  while ((match = LINK_PATTERN.exec(body)) !== null) {
    if (match.index > lastIndex) {
      parts.push(body.slice(lastIndex, match.index));
    }
    parts.push(
      <Link key={key++} href={match[2]} className="font-semibold text-gold hover:underline">
        {match[1]}
      </Link>
    );
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < body.length) {
    parts.push(body.slice(lastIndex));
  }
  return parts;
}
