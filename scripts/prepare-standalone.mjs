import { cp, mkdir, rm } from "node:fs/promises";
import path from "node:path";

const projectRoot = process.cwd();
const standaloneDir = path.join(projectRoot, ".next", "standalone");

async function copyIntoStandalone(source, destination) {
  await rm(destination, { force: true, recursive: true });
  await mkdir(path.dirname(destination), { recursive: true });
  await cp(source, destination, {
    force: true,
    recursive: true,
  });
}

await copyIntoStandalone(
  path.join(projectRoot, "public"),
  path.join(standaloneDir, "public"),
);

await copyIntoStandalone(
  path.join(projectRoot, ".next", "static"),
  path.join(standaloneDir, ".next", "static"),
);

console.log("Standalone assets copied into .next/standalone.");
