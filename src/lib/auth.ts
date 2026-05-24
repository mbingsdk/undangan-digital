import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import {
  adminSessionCookieName,
  verifyAdminSessionToken,
} from "@/lib/session";

export async function getCurrentAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get(adminSessionCookieName)?.value;
  const session = await verifyAdminSessionToken(token);

  if (!session) {
    return null;
  }

  const admin = await prisma.user.findUnique({
    where: {
      id: session.userId,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
    },
  });

  if (!admin || admin.role !== "ADMIN" || admin.email !== session.email) {
    return null;
  }

  return admin;
}

export async function requireAdmin() {
  const admin = await getCurrentAdmin();

  if (!admin) {
    redirect("/admin/login");
  }

  return admin;
}
