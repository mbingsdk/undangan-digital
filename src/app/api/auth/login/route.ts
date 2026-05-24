import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { loginSchema } from "@/lib/validations/auth";
import {
  adminSessionCookieName,
  adminSessionMaxAgeSeconds,
  createAdminSessionToken,
} from "@/lib/session";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = loginSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Data login tidak valid.",
        fields: parsed.error.flatten().fieldErrors,
      },
      { status: 400 },
    );
  }

  const admin = await prisma.user.findUnique({
    where: {
      email: parsed.data.email,
    },
  });

  const isValidAdmin =
    admin?.role === "ADMIN" &&
    (await bcrypt.compare(parsed.data.password, admin.passwordHash));

  if (!admin || !isValidAdmin) {
    return NextResponse.json(
      { error: "Email atau password salah." },
      { status: 401 },
    );
  }

  const token = await createAdminSessionToken({
    userId: admin.id,
    email: admin.email,
    role: "ADMIN",
  });
  const response = NextResponse.json({ ok: true });

  response.cookies.set(adminSessionCookieName, token, {
    httpOnly: true,
    maxAge: adminSessionMaxAgeSeconds,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });

  return response;
}
