# Generator Undangan Pernikahan

Next.js + Prisma (SQLite). Satu undangan, banyak tamu, setiap tamu punya link sendiri.

## Menjalankan

```bash
npm install
npx prisma db push      # membuat database dev.db
npm run dev             # http://localhost:3000/admin
```

Ubah `ADMIN_PASSWORD` dan `SESSION_SECRET` di `.env` sebelum dipakai sungguhan.

## URL

| URL | Isi |
| --- | --- |
| `/admin` | Dashboard (butuh password) |
| `/u/<slug>` | Undangan umum, tanpa nama tamu |
| `/u/<slug>/<nama-tamu>` | Undangan personal, nama tamu tampil di cover |

## Template

Tiga template (`elegant`, `floral`, `modern`) ada di `src/components/invitation/invitation.css`.
Warna dan font diatur per undangan dari dashboard lewat CSS variable. Untuk menambah template,
tambahkan entri di `TEMPLATES` (`src/lib/util.ts`) dan blok `[data-template="..."]` di CSS.

## Produksi

- Ganti `provider` di `prisma/schema.prisma` ke `postgresql` dan isi `DATABASE_URL`.
- Upload foto/musik disimpan di disk server (`UPLOAD_DIR`, default `./uploads`) dan disajikan lewat `/files/<nama>`.
  Di hosting dengan disk sementara (Vercel, Railway tanpa volume) file akan hilang saat redeploy:
  pasang volume persisten dan arahkan `UPLOAD_DIR` ke sana, atau ganti `src/app/api/admin/upload/route.ts`
  untuk menyimpan ke S3/Cloudinary. Batas: gambar 8 MB (jpg, png, webp, gif), audio 15 MB (mp3, m4a, ogg, wav).
