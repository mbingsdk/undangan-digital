import { NextResponse, type NextRequest } from "next/server";
import {
  adminSessionCookieName,
  verifyAdminSessionToken,
} from "@/lib/session";

export async function proxy(request: NextRequest) {
  const { nextUrl } = request;
  const isLoginPage = nextUrl.pathname === "/admin/login";
  const token = request.cookies.get(adminSessionCookieName)?.value;
  const session = await verifyAdminSessionToken(token);

  if (!session && !isLoginPage) {
    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set(
      "next",
      `${nextUrl.pathname}${nextUrl.search}`,
    );

    return NextResponse.redirect(loginUrl);
  }

  if (session && isLoginPage) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
