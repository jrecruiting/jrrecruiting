import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

const adminPrefix = "/admin";
const coachPrefixes = ["/search", "/coach", "/players"];
const parentPrefix = "/dashboard";

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const role = req.auth?.user?.role;

  const isAdminRoute = pathname.startsWith(adminPrefix);
  const isCoachRoute = !isAdminRoute && coachPrefixes.some((p) => pathname.startsWith(p));
  const isParentRoute = !isAdminRoute && pathname.startsWith(parentPrefix);

  if ((isParentRoute || isCoachRoute || isAdminRoute) && !req.auth) {
    const signInUrl = new URL("/sign-in", req.url);
    signInUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(signInUrl);
  }

  if (isParentRoute && role !== "PARENT") {
    return NextResponse.redirect(new URL("/", req.url));
  }
  if (isCoachRoute && role !== "COACH") {
    return NextResponse.redirect(new URL("/", req.url));
  }
  if (isAdminRoute && role !== "ADMIN") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/dashboard/:path*", "/search/:path*", "/coach/:path*", "/admin/:path*"],
};
