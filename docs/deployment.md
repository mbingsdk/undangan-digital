# Deployment Guide

This guide targets Alibaba ECS 1 vCPU / 1 GB RAM with Ubuntu, Node.js, SQLite, local uploads, PM2, and Caddy or Nginx.

## Server Requirements

- Ubuntu server on Alibaba ECS 1 vCPU / 1 GB RAM.
- Node.js LTS.
- PM2.
- Caddy or Nginx as reverse proxy.
- A domain connected through Cloudflare.
- Persistent disk space for SQLite and `public/uploads`.

Building Next.js on a 1 GB RAM server can run out of memory. If that happens, build locally or in CI, then upload the repository/build artifact to the server.

## Install Node.js LTS

Example with NodeSource:

```bash
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt-get install -y nodejs
node -v
npm -v
```

## Install PM2

```bash
sudo npm install -g pm2
pm2 -v
```

## Install Reverse Proxy

Caddy:

```bash
sudo apt-get install -y debian-keyring debian-archive-keyring apt-transport-https curl
curl -1sLf https://dl.cloudsmith.io/public/caddy/stable/gpg.key | sudo gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
curl -1sLf https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt | sudo tee /etc/apt/sources.list.d/caddy-stable.list
sudo apt-get update
sudo apt-get install -y caddy
```

Or Nginx:

```bash
sudo apt-get update
sudo apt-get install -y nginx
```

## Clone Repo

```bash
git clone <repo-url> undangan-digital
cd undangan-digital
```

## Create `.env`

```bash
cp .env.example .env
nano .env
```

Example values:

```env
DATABASE_URL="file:./dev.db"
APP_URL="https://undangan.example.com"
AUTH_SECRET="use-a-long-random-secret"
ADMIN_EMAIL="admin@example.com"
ADMIN_PASSWORD="use-a-strong-password"
```

Generate a strong `AUTH_SECRET`, for example:

```bash
openssl rand -base64 32
```

## Install Dependencies

```bash
npm ci
```

## Prisma Setup

```bash
npm run prisma:generate
npm run prisma:deploy
npm run db:seed
```

For a fresh MVP SQLite deployment, `prisma:deploy` applies committed migrations. Use `prisma:migrate` only during development.

## Build and Prepare Standalone

```bash
npm run build
npm run prepare:standalone
```

The prepare step copies:

- `public` to `.next/standalone/public`
- `.next/static` to `.next/standalone/.next/static`

## Start with PM2

```bash
pm2 start ecosystem.config.cjs
pm2 save
pm2 startup
```

Run the command printed by `pm2 startup`, then save again:

```bash
pm2 save
```

Useful PM2 commands:

```bash
pm2 status
pm2 logs undangan-digital
pm2 restart undangan-digital
```

## Configure Caddy

Copy `deploy/Caddyfile.example` to your Caddy config and change the domain:

```bash
sudo cp deploy/Caddyfile.example /etc/caddy/Caddyfile
sudo nano /etc/caddy/Caddyfile
sudo systemctl reload caddy
```

If Cloudflare proxy is enabled, use SSL mode Full or Full (strict).

## Configure Nginx

Copy `deploy/nginx.example.conf` and change the domain:

```bash
sudo cp deploy/nginx.example.conf /etc/nginx/sites-available/undangan-digital
sudo ln -s /etc/nginx/sites-available/undangan-digital /etc/nginx/sites-enabled/undangan-digital
sudo nginx -t
sudo systemctl reload nginx
```

Add TLS with Certbot or use Cloudflare with an origin certificate.

## Connect Domain with Cloudflare

1. Create an `A` record for `undangan.example.com` pointing to the ECS public IP.
2. Enable or disable Cloudflare proxy based on your SSL plan.
3. Set `APP_URL` to the final HTTPS URL.
4. Restart the app:

```bash
pm2 restart undangan-digital
```

## Persistence and Backups

SQLite and local uploads are single-server storage. Back up:

- SQLite database file from `DATABASE_URL`.
- `public/uploads`.
- `.env`.

See `docs/backup.md`.

## Troubleshooting

- Build fails on 1 GB RAM: build locally/CI, add swap, or stop other processes.
- `PrismaClient` errors: run `npm run prisma:generate`.
- Database schema missing: run `npm run prisma:deploy`.
- Admin login fails: verify `.env`, then run `npm run db:seed`.
- Static files missing in standalone: run `npm run prepare:standalone`.
- App not reachable: check `pm2 logs undangan-digital`, reverse proxy config, firewall, and ECS security group.
- Health check: open `https://your-domain/api/health`.
