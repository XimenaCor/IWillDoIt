# ---------- Build stage ----------
FROM node:22-slim AS builder
WORKDIR /app

RUN apt-get update -y && apt-get install -y openssl

COPY package*.json ./
RUN npm ci

COPY prisma ./prisma
RUN npx prisma generate   # ✅ NECESARIO PARA TYPES

COPY . .
RUN npm run build


# ---------- Production stage ----------
FROM node:22-slim AS runner
WORKDIR /app

RUN apt-get update -y && apt-get install -y openssl

ENV NODE_ENV=production

COPY package*.json ./
RUN npm ci --omit=dev

COPY --from=builder /app/dist ./dist
COPY prisma ./prisma

RUN npx prisma generate   # ✅ NECESARIO PARA RUNTIME

EXPOSE 3000
CMD ["node", "dist/main.js"]
