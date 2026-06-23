# ── Stage 1: Builder ────────────────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

# Copy manifests first for layer caching
COPY package*.json tsconfig.json ./

# Install ALL deps (including devDeps for tsc)
RUN npm ci

# Copy source and compile
COPY src ./src
RUN npm run build

# Prune devDependencies
RUN npm prune --production

# ── Stage 2: Runtime ─────────────────────────────────────────────────────────
FROM node:20-alpine AS runtime

# Dumb-init for correct signal handling (PID 1) — install as root before dropping privileges
RUN apk add --no-cache dumb-init

# Security: run as non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

WORKDIR /app

# Copy only production artefacts
COPY --from=builder /app/dist      ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY package.json ./

# Drop all capabilities; the app only needs to bind to an unprivileged port
USER appuser

EXPOSE 3000

ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "dist/index.js"]

# Health check baked into the image
HEALTHCHECK --interval=15s --timeout=5s --start-period=20s --retries=3 \
CMD wget -qO- http://localhost:3000/healthz || exit 1
