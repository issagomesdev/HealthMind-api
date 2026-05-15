FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/

RUN npm ci

COPY . .

RUN npm run prisma:generate
RUN npm run build

# ----

FROM node:20-alpine AS production

WORKDIR /app

ENV NODE_ENV=production

COPY package*.json ./
COPY prisma ./prisma/

RUN npm ci --omit=dev && npm run prisma:generate

COPY --from=builder /app/dist ./dist

EXPOSE ${PORT:-3333}

CMD ["node", "dist/server.js"]
