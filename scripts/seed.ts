import "dotenv/config";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

async function main() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    throw new Error("ADMIN_EMAIL dan ADMIN_PASSWORD wajib diisi di .env");
  }

  const existingAdmin = await prisma.user.findUnique({
    where: { email },
  });

  if (existingAdmin) {
    const passwordMatches = await bcrypt.compare(
      password,
      existingAdmin.passwordHash,
    );
    const shouldUpdate =
      existingAdmin.role !== "ADMIN" || !existingAdmin.name || !passwordMatches;

    if (shouldUpdate) {
      await prisma.user.update({
        where: { email },
        data: {
          name: existingAdmin.name || "Admin",
          role: "ADMIN",
          ...(passwordMatches
            ? {}
            : { passwordHash: await bcrypt.hash(password, 12) }),
        },
      });
    }
  } else {
    await prisma.user.create({
      data: {
        name: "Admin",
        email,
        passwordHash: await bcrypt.hash(password, 12),
        role: "ADMIN",
      },
    });
  }

  console.log(`Admin siap: ${email}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
