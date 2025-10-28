import { NextResponse } from "next/server";

export function middleware(request) {
  const url = request.nextUrl.clone();
  const pathname = url.pathname;

  if (pathname.startsWith("/job-portal")) {
    const userCookie = request.cookies.get("user");
    const hasAuth = userCookie?.value;

    if (!hasAuth) {
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }
  }

  if (pathname === "/login" || pathname === "/register") {
    const userCookie = request.cookies.get("user");
    const hasAuth = userCookie?.value;

    if (hasAuth) {
      url.pathname = "/job-portal";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/job-portal/:path*", "/login", "/register"],
};
