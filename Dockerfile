# ---------- Build stage ----------
FROM node:22-alpine AS builder

WORKDIR /app

# Install deps (including dev deps for building)
COPY package*.json ./
RUN npm ci

# Copy Prisma schema and generate client
COPY prisma ./prisma
RUN npx prisma generate  # ← NUEVA LÍNEA

# Copy sources and build
COPY . .
RUN npm run build


# ---------- Production stage ----------
FROM node:22-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production

# Install only production dependencies
COPY package*.json ./
RUN npm ci --omit=dev

# Copy compiled output
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma 

# Nest default port (you confirmed 3000)
EXPOSE 3000

CMD ["node", "dist/main.js"]
