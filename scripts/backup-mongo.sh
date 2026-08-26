#!/usr/bin/env bash
#
# Nightly MongoDB backup for the Inkarp site.
#
# Atlas M0 (the free tier) has no automated backups, so this is the only copy of
# customer accounts, saved product lists and quote history if the cluster is ever
# lost. It reads the connection string from the app's .env so no credential is
# ever written into this file or into cron.
#
# Install (once, on the server):
#   chmod +x scripts/backup-mongo.sh
#   sudo apt-get install -y mongodb-database-tools
#
# Schedule (crontab -e), 2:15am daily:
#   15 2 * * * /home/inkarpnext/htdocs/nextapp.72.60.98.245.nip.io/scripts/backup-mongo.sh >> /home/inkarpnext/backups/backup.log 2>&1

set -euo pipefail

APP_DIR="${APP_DIR:-$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)}"
BACKUP_DIR="${BACKUP_DIR:-$HOME/backups/mongo}"
KEEP_DAYS="${KEEP_DAYS:-14}"
STAMP="$(date +%Y-%m-%d_%H%M)"

log() { echo "[$(date '+%Y-%m-%d %H:%M:%S')] $*"; }

# --- credentials -------------------------------------------------------------
# Pulled from .env at run time. Never echoed, never stored beside the archive.
if [[ -f "$APP_DIR/.env" ]]; then
  MONGODB_URI="$(grep -E '^MONGODB_URI=' "$APP_DIR/.env" | head -1 | cut -d= -f2- | tr -d '\r"'"'"'')"
  MONGODB_DB="$(grep -E '^MONGODB_DB=' "$APP_DIR/.env" | head -1 | cut -d= -f2- | tr -d '\r"'"'"'')"
fi

if [[ -z "${MONGODB_URI:-}" ]]; then
  log "ERROR: MONGODB_URI not found in $APP_DIR/.env"
  exit 1
fi
MONGODB_DB="${MONGODB_DB:-inkarp}"

if ! command -v mongodump >/dev/null 2>&1; then
  log "ERROR: mongodump not installed. Run: sudo apt-get install -y mongodb-database-tools"
  exit 1
fi

# --- dump --------------------------------------------------------------------
mkdir -p "$BACKUP_DIR"
ARCHIVE="$BACKUP_DIR/inkarp_${STAMP}.gz"

log "Backing up database '$MONGODB_DB' -> $ARCHIVE"
mongodump --uri="$MONGODB_URI" --db="$MONGODB_DB" --archive="$ARCHIVE" --gzip --quiet

# An empty or tiny archive means the dump failed quietly — catch it here rather
# than discovering it during a restore.
SIZE_BYTES="$(stat -c%s "$ARCHIVE" 2>/dev/null || stat -f%z "$ARCHIVE")"
if [[ "$SIZE_BYTES" -lt 1024 ]]; then
  log "ERROR: archive is only ${SIZE_BYTES} bytes — treating as a failed dump"
  rm -f "$ARCHIVE"
  exit 1
fi
log "Wrote $(( SIZE_BYTES / 1024 )) KB"

# --- off-site copy (optional) ------------------------------------------------
# A backup on the same server dies with the server. If rclone is configured with
# a remote named "backup", push a copy off the machine.
if command -v rclone >/dev/null 2>&1 && rclone listremotes 2>/dev/null | grep -q '^backup:'; then
  log "Copying to off-site remote"
  rclone copy "$ARCHIVE" backup:inkarp-mongo --quiet || log "WARNING: off-site copy failed"
else
  log "No rclone remote named 'backup' — keeping the local copy only"
fi

# --- rotation ----------------------------------------------------------------
DELETED="$(find "$BACKUP_DIR" -name 'inkarp_*.gz' -mtime "+$KEEP_DAYS" -print -delete | wc -l)"
log "Rotation: removed $DELETED archive(s) older than $KEEP_DAYS days"

log "Backup complete"
