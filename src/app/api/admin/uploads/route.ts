import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
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

function getUploadsDir() {
  const configuredDir = process.env.UPLOAD_DIR?.trim();

  if (configuredDir) {
    return path.resolve(configuredDir);
  }

  return path.join(process.cwd(), "public", "uploads");
}

export async function POST(request: Request) {
  await requireAdmin();

  const formData = await request.formData().catch(() => null);
  const file = formData?.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json(
      { error: "File gambar wajib diisi." },
      { status: 400 },
    );
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

  const uploadsDir = getUploadsDir();
  const filename = `${randomUUID()}${extension}`;
  const fileBuffer = Buffer.from(await file.arrayBuffer());

  await mkdir(uploadsDir, { recursive: true });
  await writeFile(path.join(uploadsDir, filename), fileBuffer);

  return NextResponse.json({
    url: `/uploads/${filename}`,
  });
}
