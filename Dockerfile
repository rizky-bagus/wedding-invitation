FROM node:22-bookworm-slim

# Prisma membutuhkan OpenSSL
RUN apt-get update -y && apt-get install -y --no-install-recommends openssl ca-certificates \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

# Schema di repo memakai SQLite (untuk dev lokal). Di produksi dipakai PostgreSQL.
RUN sed 's/provider = "sqlite".*/provider = "postgresql"/' prisma/schema.prisma > prisma/schema.postgres.prisma \
  && npx prisma generate --schema prisma/schema.postgres.prisma \
  && npm run build

ENV NODE_ENV=production
EXPOSE 3000

# Sinkronkan tabel lalu jalankan server. Railway mengisi PORT.
CMD ["sh", "-c", "npx prisma db push --schema prisma/schema.postgres.prisma --skip-generate && npx next start -p ${PORT:-3000}"]
