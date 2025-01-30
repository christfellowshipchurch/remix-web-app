# use the official Bun image
# see all versions at https://hub.docker.com/r/oven/bun/tags
FROM oven/bun:1 AS base
WORKDIR /app

# Install dependencies
FROM base as deps
COPY package.json bun.lockb ./
RUN bun install --frozen-lockfile

# Build the app
FROM node:20-slim as builder
WORKDIR /app
ENV NODE_ENV=production

# Copy deps from bun stage and source files
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Install build tools
RUN npm install -g typescript ts-node @react-router/dev @react-router/serve

# Build the app (this will process Tailwind through Vite)
RUN npx react-router build

# Production image
FROM base as runner
ENV NODE_ENV=production
ENV PORT=3000

# Copy all necessary files
COPY --from=builder /app/build ./build
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/app ./app
COPY --from=builder /app/tailwind.config.ts ./tailwind.config.ts
COPY --from=builder /app/postcss.config.js ./postcss.config.js

EXPOSE 3000

# Start the app
CMD ["bun", "run", "start"]
