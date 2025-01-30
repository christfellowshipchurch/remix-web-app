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

# Copy deps from bun stage
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Ensure Tailwind CSS is built before the main build
RUN npx tailwindcss -o ./app/styles/tailwind.css --minify

# Build using Node.js
RUN npm install -g @react-router/dev @react-router/serve
RUN npx react-router build

# Production image
FROM base as runner
ENV NODE_ENV=production
ENV PORT=3000

# Copy built assets and ensure directory structure matches local development
COPY --from=builder /app/build ./build
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules

# Create the app directory structure to match your local setup
RUN mkdir -p app/styles
COPY --from=builder /app/app/styles/tailwind.css ./app/styles/tailwind.css

EXPOSE 3000

# Start the app
CMD ["bun", "run", "start"]
