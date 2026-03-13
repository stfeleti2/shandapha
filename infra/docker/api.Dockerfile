FROM node:24-alpine
WORKDIR /app
COPY . .
RUN corepack enable && pnpm install && pnpm --filter @shandapha/platform-api build
CMD ["pnpm", "--filter", "@shandapha/platform-api", "start"]
