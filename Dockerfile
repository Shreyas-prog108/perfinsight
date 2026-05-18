# Repo root — Render/Git builds from monorepo root default to ./Dockerfile here.
FROM oven/bun:1-alpine
WORKDIR /app

COPY server/package.json server/bun.lock ./
RUN bun install --frozen-lockfile

COPY server/ .

ENV NODE_ENV=production

EXPOSE 10000

CMD ["bun", "src/index.js"]
