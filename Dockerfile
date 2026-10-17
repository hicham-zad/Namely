# matchbabynames.com (Next.js). Built on the VPS by deploy/docker-compose.yml.
FROM node:22-bookworm-slim AS builder
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
# .env.production (synced by deploy/deploy.sh, never committed) supplies NEXT_PUBLIC_* values for the build.
RUN NODE_OPTIONS=--max-old-space-size=1536 npm run build && npm prune --omit=dev

FROM node:22-bookworm-slim AS runner
WORKDIR /app
ENV NODE_ENV=production NEXT_TELEMETRY_DISABLED=1 PORT=3000 HOSTNAME=0.0.0.0
COPY --from=builder --chown=node:node /app/package.json ./
COPY --from=builder --chown=node:node /app/node_modules ./node_modules
COPY --from=builder --chown=node:node /app/.next ./.next
COPY --from=builder --chown=node:node /app/public ./public
COPY --from=builder --chown=node:node /app/next.config.ts ./
USER node
EXPOSE 3000
CMD ["node_modules/.bin/next", "start"]
