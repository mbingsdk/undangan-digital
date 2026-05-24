import { jwtVerify, SignJWT } from "jose";
import { z } from "zod";

export const adminSessionCookieName = "undangan_admin_session";
export const adminSessionMaxAgeSeconds = 60 * 60 * 24 * 7;

const adminSessionSchema = z.object({
  userId: z.string().min(1),
  email: z.string().email(),
  role: z.literal("ADMIN"),
});

export type AdminSession = z.infer<typeof adminSessionSchema>;

function getSessionSecret() {
  const secret = process.env.AUTH_SECRET;

  if (!secret) {
    throw new Error("AUTH_SECRET wajib diisi di .env");
  }

  return new TextEncoder().encode(secret);
}

export async function createAdminSessionToken(session: AdminSession) {
  return new SignJWT(session)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${adminSessionMaxAgeSeconds}s`)
    .sign(getSessionSecret());
}

export async function verifyAdminSessionToken(token?: string) {
  if (!token) {
    return null;
  }

  try {
    const { payload } = await jwtVerify(token, getSessionSecret());
    const result = adminSessionSchema.safeParse(payload);

    if (!result.success) {
      return null;
    }

    return result.data;
  } catch {
    return null;
  }
}
