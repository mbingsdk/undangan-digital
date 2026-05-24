# Sprint Plan - Undangan Digital MVP

## Sprint 0 - Foundation

Goal: make the project bootable and consistent with the PRD.

Tasks:

- Verify Next.js App Router setup
- Verify Tailwind setup
- Verify Prisma 7 SQLite setup
- Verify generated Prisma client path
- Verify seed admin works
- Add `prd_undangan_digital_mvp.md`
- Add `AGENTS.md`
- Add base app layout
- Add basic homepage placeholder

Acceptance criteria:

- `npm run dev` works
- `npx prisma generate` works
- `npx prisma migrate dev` works
- `npm run db:seed` works
- Generated Prisma client exists
- No Prisma import from `@prisma/client`

## Sprint 1 - Auth and Admin Shell

Goal: admin can login and access protected admin pages.

Tasks:

- Build auth validation schema
- Build password verification
- Build session cookie helper
- Build login route
- Build logout route
- Add middleware protection for `/admin`
- Create `/admin/login`
- Create admin layout
- Create dashboard placeholder

Acceptance criteria:

- Admin can login using seeded account
- Unauthenticated user cannot access `/admin`
- Logout clears session
- Admin layout is visible after login

## Sprint 2 - Invitation CRUD

Goal: admin can create and manage invitations.

Tasks:

- Create invitation repository/service
- Create invitation validation schemas
- Create invitation list page
- Create invitation create page
- Create invitation edit page
- Implement create/update/delete
- Implement draft/published/archived status
- Validate unique slug

Acceptance criteria:

- Admin can create invitation
- Admin can edit invitation
- Admin can soft delete invitation
- Slug is unique
- Status can be changed

## Sprint 3 - Events, Gallery, Gifts

Goal: admin can complete invitation content.

Tasks:

- Manage invitation events
- Manage gallery images
- Manage gift accounts
- Add local upload endpoint
- Validate uploaded image type and size
- Add sort order support

Acceptance criteria:

- Invitation can have one or more events
- Gallery images can be added
- Gift accounts can be added
- Upload only accepts valid image files

## Sprint 4 - Public Invitation Page

Goal: published invitation is viewable by slug.

Tasks:

- Create `src/app/[slug]/page.tsx`
- Fetch invitation by slug
- Show unpublished invitation as unavailable
- Build public template sections
- Add opening screen
- Add countdown
- Add maps button
- Add gallery
- Add gift copy button
- Add WhatsApp share button
- Add music after user interaction

Acceptance criteria:

- `/some-slug` displays published invitation
- Invalid slug shows 404
- Draft invitation is not publicly visible
- Page is mobile-first and lightweight

## Sprint 5 - RSVP and Wishes

Goal: guests can RSVP and send wishes.

Tasks:

- Create RSVP API route
- Create wish API route
- Add RSVP form
- Add wish form
- Add admin RSVP list
- Add admin wishes list
- Add hide/delete wish action
- Add basic rate limiting

Acceptance criteria:

- Guest can submit RSVP
- Guest can submit wish
- Admin can see RSVP data
- Admin can hide/delete wishes
- Invalid input is rejected

## Sprint 6 - Build and Deployment Prep

Goal: app is ready for Alibaba ECS standalone deployment.

Tasks:

- Verify `output: "standalone"`
- Add standalone copy script for `public` and `.next/static`
- Add PM2 ecosystem config
- Add Caddyfile example
- Add deployment guide
- Add backup guide for SQLite and uploads

Acceptance criteria:

- `npm run build` succeeds
- Standalone server can run locally
- Deployment docs are clear
- Backup docs are clear