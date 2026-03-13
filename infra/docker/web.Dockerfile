FROM node:24-alpine
WORKDIR /app
COPY . .
RUN corepack enable && pnpm install && pnpm --filter @shandapha/web build
CMD ["pnpm", "--filter", "@shandapha/web", "dev"]
