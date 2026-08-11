FROM node:20-alpine

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@10.33.2 --activate

EXPOSE 5173

CMD ["sh", "-c", "pnpm install && pnpm exec vite --host 0.0.0.0 --port 5173"]
