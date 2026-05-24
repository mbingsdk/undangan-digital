import { randomUUID } from "node:crypto";
import { access, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";

export const runtime = "nodejs";

const maxFileSize = 2 * 1024 * 1024;
const allowedImageTypes = new Map([
  ["image/jpeg", ".jpg"],
  ["image/png", ".png"],
  ["image/webp", ".webp"],
]);

async function pathExists(targetPath: string) {
  return access(targetPath)
    .then(() => true)
    .catch(() => false);
}

async function getUploadDirs() {
  const projectPublicUploads = path.join(process.cwd(), "public", "uploads");
  const standalonePublic = path.join(process.cwd(), ".next", "standalone", "public");
  const standaloneUploads = path.join(standalonePublic, "uploads");

  if (await pathExists(standalonePublic)) {
    return [standaloneUploads, projectPublicUploads];
  }

  return [projectPublicUploads];
}

export async function POST(request: Request) {
  await requireAdmin();

  const formData = await request.formData().catch(() => null);
  const file = formData?.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "File gambar wajib diisi." }, { status: 400 });
  }

  if (file.size > maxFileSize) {
    return NextResponse.json(
      { error: "Ukuran file maksimal 2 MB." },
      { status: 400 },
    );
  }

  const extension = allowedImageTypes.get(file.type);

  if (!extension) {
    return NextResponse.json(
      { error: "Format gambar harus JPG, JPEG, PNG, atau WebP." },
      { status: 400 },
    );
  }

  const filename = `${randomUUID()}${extension}`;
  const uploadDirs = await getUploadDirs();

  const fileBuffer = Buffer.from(await file.arrayBuffer());

  await Promise.all(
    uploadDirs.map(async (uploadsDir) => {
      await mkdir(uploadsDir, { recursive: true });
      await writeFile(path.join(uploadsDir, filename), fileBuffer);
    }),
  );

  return NextResponse.json({
    url: `/uploads/${filename}`,
  });
}
