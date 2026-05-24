# Backup Guide

This MVP uses SQLite and local uploads. Both live on one server, so backups are required.

## What to Back Up

- SQLite database file from `DATABASE_URL`, for example `dev.db`.
- Upload folder, usually `public/uploads`.
- `.env` file with production secrets.

Store backups outside the server when possible, such as another VPS, object storage, or a secure local machine.

## Manual Backup

Create a backup directory:

```bash
mkdir -p ~/backups/undangan-digital
```

Back up SQLite:

```bash
cd /path/to/undangan-digital
sqlite3 dev.db ".backup '$HOME/backups/undangan-digital/dev-$(date +%F-%H%M%S).db'"
```

If `sqlite3` is not installed:

```bash
sudo apt-get update
sudo apt-get install -y sqlite3
```

Back up uploads:

```bash
cd /path/to/undangan-digital
tar -czf "$HOME/backups/undangan-digital/uploads-$(date +%F-%H%M%S).tar.gz" public/uploads
```

Back up `.env`:

```bash
cd /path/to/undangan-digital
cp .env "$HOME/backups/undangan-digital/env-$(date +%F-%H%M%S).backup"
chmod 600 "$HOME/backups/undangan-digital"/env-*.backup
```

Create one combined archive:

```bash
cd /path/to/undangan-digital
tar -czf "$HOME/backups/undangan-digital/full-$(date +%F-%H%M%S).tar.gz" dev.db public/uploads .env
```

## Restore

Stop the app first:

```bash
pm2 stop undangan-digital
```

Restore database:

```bash
cd /path/to/undangan-digital
cp ~/backups/undangan-digital/dev-YYYY-MM-DD-HHMMSS.db dev.db
```

Restore uploads:

```bash
cd /path/to/undangan-digital
rm -rf public/uploads
tar -xzf ~/backups/undangan-digital/uploads-YYYY-MM-DD-HHMMSS.tar.gz
```

Restore `.env` if needed:

```bash
cd /path/to/undangan-digital
cp ~/backups/undangan-digital/env-YYYY-MM-DD-HHMMSS.backup .env
chmod 600 .env
```

Start the app:

```bash
pm2 start undangan-digital
```

## Suggested Schedule

- Daily database backup.
- Daily uploads backup if invitations are actively edited.
- Backup `.env` whenever secrets change.
- Keep at least 7 daily backups and 4 weekly backups.
- Periodically copy backups off the ECS instance.

## Important Warnings

- SQLite and local uploads are single-server storage.
- If the ECS disk is lost and backups are only on that disk, production data is lost.
- Uploaded images are not automatically stored in Cloudflare, OSS, R2, or S3.
- Before upgrading or migrating the server, take a fresh database and uploads backup.
