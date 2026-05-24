import { NextResponse } from "next/server";
import { adminSessionCookieName } from "@/lib/session";

export async function POST() {
  const response = NextResponse.json({ ok: true });

  response.cookies.set(adminSessionCookieName, "", {
    httpOnly: true,
    maxAge: 0,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });

  return response;
}
