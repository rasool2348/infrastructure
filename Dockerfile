# syntax=docker/dockerfile:1

FROM node:22-alpine AS base
WORKDIR /app

# Native build tools for bcrypt
RUN apk add --no-cache python3 make g++

COPY package.json package-lock.json ./

# ---------- Development ----------
FROM base AS development
RUN npm ci
COPY . .
ENV NODE_ENV=development
EXPOSE 3000
CMD ["npm", "run", "dev"]

# ---------- Production ----------
FROM base AS production
RUN npm ci --omit=dev && npm cache clean --force
COPY . .
ENV NODE_ENV=production
EXPOSE 3000
USER node
CMD ["npm", "run", "start"]
