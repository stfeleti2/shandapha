FROM node:24-alpine
WORKDIR /app
COPY . .
RUN corepack enable && pnpm install && pnpm --filter @shandapha/studio build
CMD ["pnpm", "--filter", "@shandapha/studio", "dev"]
