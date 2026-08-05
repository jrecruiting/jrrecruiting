import { NextResponse } from "next/server";
import { get } from "@vercel/blob";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { Session } from "next-auth";

// A pathname can belong to a player either as its primaryPhotoUrl or as one
// of its extra-photo MediaAsset rows (type PHOTO) -- check both so the same
// ownership/access rules apply to every photo in the rotating gallery, not
// just the first one.
function findPlayerForPathname(pathname: string) {
  return prisma.player.findFirst({
    where: {
      OR: [{ primaryPhotoUrl: pathname }, { media: { some: { type: "PHOTO", url: pathname } } }],
    },
    select: { id: true, parentId: true },
  });
}

async function isAllowedToViewPhoto(
  user: NonNullable<Session["user"]>,
  pathname: string
): Promise<boolean> {
  if (user.role === "ADMIN") return true;

  if (user.role === "COACH") {
    return user.coachVerificationStatus === "APPROVED";
  }

  if (user.role === "PARENT") {
    const player = await findPlayerForPathname(pathname);
    return player?.parentId === user.id;
  }

  if (user.role === "TEAM_COACH") {
    const player = await findPlayerForPathname(pathname);
    if (!player) return false;
    const access = await prisma.teamCoachAccess.findUnique({
      where: { teamCoachId_playerId: { teamCoachId: user.id, playerId: player.id } },
    });
    return Boolean(access);
  }

  return false;
}

export async function GET(request: Request): Promise<NextResponse> {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const pathname = new URL(request.url).searchParams.get("pathname");
  if (!pathname) {
    return NextResponse.json({ error: "Missing pathname" }, { status: 400 });
  }

  // Enforce the same access rule here as at the display layer, so the
  // photo can't be fetched directly by an unverified coach or a parent
  // who doesn't own this player, even with the exact URL in hand.
  const allowed = await isAllowedToViewPhoto(session.user, pathname);
  if (!allowed) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const result = await get(pathname, { access: "private" });
  if (result === null || result.statusCode !== 200) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return new NextResponse(result.stream, {
    headers: {
      "Cache-Control": "private, no-cache",
      "Content-Type": result.blob.contentType,
      "X-Content-Type-Options": "nosniff",
    },
  });
}
