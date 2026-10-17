#!/usr/bin/env bash
# Deploy matchbabynames.com to the production VPS (see docker-compose.yml in this folder).
#
#   ./deploy/deploy.sh
#
# Secrets live only on the VPS: /opt/namely/.env.production is created once by hand
# (or copied from .env.local) and is never synced by this script.
set -euo pipefail

HOST="deploy@185.233.104.16"
REMOTE="/opt/namely"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"

echo "→ syncing source"
rsync -az --delete --exclude-from="$ROOT/.dockerignore" --exclude '.env*' --exclude 'deploy' \
  "$ROOT/" "$HOST:$REMOTE/web/"
rsync -az "$ROOT/deploy/docker-compose.yml" "$HOST:$REMOTE/docker-compose.yml"

echo "→ building and restarting"
# The build needs the env file inside the Docker build context (NEXT_PUBLIC_* values, route config).
ssh -o ServerAliveInterval=30 "$HOST" "cd $REMOTE && install -m 600 .env.production web/.env.production && docker compose up -d --build web && docker image prune -f >/dev/null"

echo "→ waiting for health check"
for _ in $(seq 1 30); do
  status=$(ssh "$HOST" "cd $REMOTE && docker compose ps --format '{{.Name}} {{.Health}}'")
  if grep -q ' healthy$' <<<"$status"; then
    echo "$status"
    echo "✓ healthy (127.0.0.1:3200 on the VPS)"
    exit 0
  fi
  sleep 5
done
echo "✗ not healthy after 150s:"; echo "$status"
exit 1
