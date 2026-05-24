# AGENTS.md

## Project Context

This project is a digital invitation MVP based on `prd_undangan_digital_mvp.md`.

The product is a self-hosted Next.js application for creating and publishing digital wedding invitations. The initial MVP is not a full SaaS platform. It is an internal admin-operated system.

Always read and follow `prd_undangan_digital_mvp.md` before making implementation decisions.

## Tech Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Prisma 7
- SQLite for MVP
- Prisma generated client at `src/generated/prisma`
- Next.js standalone output
- Target deployment: Alibaba ECS 1 vCPU / 1 GB RAM
- Reverse proxy: Caddy or Nginx
- Process manager: PM2 or systemd

## Prisma 7 Rules

Do not import Prisma Client from `@prisma/client`.

Use the generated Prisma 7 client path:

```ts
import { PrismaClient } from "@/generated/prisma/client";

or use the shared helper:
import { prisma } from "@/lib/prisma";