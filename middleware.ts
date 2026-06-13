import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const oldPathRedirects: Record<string, string> = {
  "/welcome": "/",
  "/cross-heart-pray": "/",
  "/cross-heart-pray/cross": "/cross",
  "/cross-heart-pray/heart": "/heart",
  "/cross-heart-pray/pray": "/pray",
  "/cross-heart-pray/reflect": "/reflect",
  "/bible-explorer": "/explorebible",
  "/open-mirror-platform": "/",
};

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const host = request.headers.get("host")?.toLowerCase() ?? "";

  if (host === "openmirrorllc.com" || host === "www.openmirrorllc.com") {
    return NextResponse.redirect("https://crossheartpray.com/", 308);
  }

  const cleanPath = oldPathRedirects[url.pathname];

  if (cleanPath) {
    url.pathname = cleanPath;
    url.search = "";
    return NextResponse.redirect(url, 308);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/welcome",
    "/cross-heart-pray",
    "/cross-heart-pray/:path*",
    "/bible-explorer",
    "/open-mirror-platform",
    "/((?!_next/static|_next/image|favicon.ico|brand).*)",
  ],
};
