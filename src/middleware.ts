import { NextRequest, NextResponse } from "next/server";

const DOMAIN_ROOTS: Record<string, string> = {
  "crossheartpray.com": "/crossheartpray",
  "www.crossheartpray.com": "/crossheartpray",
};

export function middleware(request: NextRequest) {
  const host = request.headers.get("host") ?? "";
  const target = DOMAIN_ROOTS[host];
  if (target && request.nextUrl.pathname === "/") {
    return NextResponse.rewrite(new URL(target, request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/"],
};
