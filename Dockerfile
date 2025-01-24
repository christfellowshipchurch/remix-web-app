# use the official Bun image
# see all versions at https://hub.docker.com/r/oven/bun/tags
FROM oven/bun:1 AS base
WORKDIR /usr/src/app

# install dependencies into temp directory
# this will cache them and speed up future builds
FROM base AS install
RUN mkdir -p /temp/dev
COPY package.json bun.lockb /temp/dev/
RUN cd /temp/dev && bun install --frozen-lockfile

# install with --production (exclude devDependencies)
RUN mkdir -p /temp/prod
COPY package.json bun.lockb /temp/prod/
RUN cd /temp/prod && bun install --frozen-lockfile --production

# copy node_modules from temp directory
# then copy all (non-ignored) project files into the image
FROM base AS prerelease
COPY --from=install /temp/dev/node_modules node_modules
COPY . .

# Ensure Tailwind builds properly
ENV NODE_ENV=production
# Build Tailwind CSS first
RUN bun run tailwindcss -i ./app/styles/tailwind.css -o ./public/styles/tailwind.css
# Then build the application
RUN bun run build

# copy production dependencies and source code into final image
FROM base AS release
WORKDIR /usr/src/app
COPY --from=install /temp/prod/node_modules ./node_modules
COPY ./package.json .
COPY --from=prerelease /usr/src/app/build ./build
COPY --from=prerelease /usr/src/app/public ./public
# Ensure styles are copied correctly
COPY ./app/styles ./app/styles
COPY ./app/assets ./app/assets
COPY .env .env

# run the app
USER bun
EXPOSE 3000/tcp
ENTRYPOINT [ "bun", "run", "start" ]
