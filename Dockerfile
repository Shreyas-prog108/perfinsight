# One image: React build → server/public, Express serves / + /api
FROM oven/bun:1-alpine AS frontend
WORKDIR /frontend
COPY client/package.json client/bun.lock ./
RUN bun install --frozen-lockfile
COPY client/ .
RUN bun run build

FROM oven/bun:1-alpine AS runtime
WORKDIR /app
COPY server/package.json server/bun.lock ./
RUN bun install --frozen-lockfile
COPY server/ .
COPY --from=frontend /frontend/dist ./public
ENV NODE_ENV=production

EXPOSE 10000

CMD ["bun", "src/index.js"]
