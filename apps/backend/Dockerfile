# syntax=docker/dockerfile:1
FROM node:20-alpine

RUN apk add --no-cache bash openssl

WORKDIR /app

COPY package.json package-lock.json turbo.json ./
COPY apps/backend/package.json ./apps/backend/
COPY packages/shared/package.json ./packages/shared/

RUN npm install --workspaces --include-workspace-root

COPY packages/shared ./packages/shared
COPY apps/backend ./apps/backend

RUN npx prisma generate --schema apps/backend/prisma/schema.prisma

WORKDIR /app/apps/backend

EXPOSE 3000

CMD ["sh", "-c", "npx prisma migrate deploy && npm run start:dev"]
