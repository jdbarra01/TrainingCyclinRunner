FROM node:22-alpine AS base
WORKDIR /app
COPY package*.json ./
COPY prisma/ ./prisma/
COPY prisma.config.ts ./
ENV DATABASE_URL=postgresql://dummy:dummy@localhost:5432/dummy
RUN npm ci && npx prisma generate
COPY . .
RUN npm run build

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=base /app/.next ./.next
COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/package.json ./package.json
COPY --from=base /app/prisma ./prisma
COPY --from=base /app/prisma.config.ts ./
COPY --from=base /app/src/lib/db/generated ./src/lib/db/generated
COPY --from=base /app/public ./public
EXPOSE 3000
CMD npx prisma migrate deploy && npm start
