# Builder
FROM node:22-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci
COPY . ./
RUN npm run build
RUN npm prune --production


# Runner
FROM node:22-alpine AS run

ENV NODE_ENV=production

WORKDIR /app
COPY --from=build /app/build ./build
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/node_modules ./node_modules
ENTRYPOINT ["node", "build"]