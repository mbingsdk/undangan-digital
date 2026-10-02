import { cp, mkdir, rm, symlink } from "node:fs/promises";
import path from "node:path";

const projectRoot = process.cwd();
const standaloneDir = path.join(projectRoot, ".next", "standalone");
const projectPublicDir = path.join(projectRoot, "public");
const projectUploadsDir = path.join(projectPublicDir, "uploads");
const standalonePublicDir = path.join(standaloneDir, "public");
const standaloneUploadsDir = path.join(standalonePublicDir, "uploads");

async function copyIntoStandalone(source, destination) {
  await rm(destination, { force: true, recursive: true });
  await mkdir(path.dirname(destination), { recursive: true });
  await cp(source, destination, {
    force: true,
    recursive: true,
  });
}

await mkdir(projectUploadsDir, { recursive: true });

await copyIntoStandalone(projectPublicDir, standalonePublicDir);

// Keep uploaded files persistent outside the disposable standalone build.
// The standalone server reads /public from .next/standalone, so make its
// uploads directory point to the project's persistent public/uploads folder.
await rm(standaloneUploadsDir, { force: true, recursive: true });
await symlink(projectUploadsDir, standaloneUploadsDir, "dir");

await copyIntoStandalone(
  path.join(projectRoot, ".next", "static"),
  path.join(standaloneDir, ".next", "static"),
);

console.log(
  "Standalone assets prepared. Uploads are linked to persistent public/uploads.",
);
