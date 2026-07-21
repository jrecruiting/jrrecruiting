import { NextResponse } from "next/server";
import { get } from "@vercel/blob";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { Session } from "next-auth";

async function isAllowedToViewPhoto(
  user: NonNullable<Session["user"]>,
  pathname: string
): Promise<boolean> {
  if (user.role === "ADMIN") return true;

  if (user.role === "COACH") {
    return user.coachVerificationStatus === "APPROVED";
  }

  if (user.role === "PARENT") {
    const player = await prisma.player.findFirst({
      where: { primaryPhotoUrl: pathname },
      select: { parentId: true },
    });
    return player?.parentId === user.id;
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
