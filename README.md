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
| `/<slug>` | Undangan umum, tanpa nama tamu. Slug bawaan: `<istri>-with-<suami>` |
| `/<slug>?to=Nama+Tamu` | Undangan personal, nama dari `?to=` tampil di cover |

Contoh: `https://domain-anda.com/ani-with-budi?to=Tamu+Undangan`.
Jika nama cocok dengan daftar tamu, RSVP-nya tercatat pada tamu itu; nama yang belum ada di daftar
otomatis ditambahkan saat mereka mengonfirmasi kehadiran. Slug `admin`, `api`, `files`, dan `u` dipakai sistem.

## Template

Dua puluh enam template (lima terbaru: `washi` kertas washi, stempel hanko dan enso, `poster` foto
cover layar penuh dengan bagian bernomor, `tropis` monstera dan hibiscus, `koran` kepala koran, perangko
dan cap pos, `rustic` papan kayu dan lampu gantung; sebelumnya `sakura`, `retro`, `hutan`, `oriental`,
`galaksi`, `gunung`, `boho`, `deco`, `pantai`): `elegant`,
`floral`, `modern`, `envelope` (amplop bersegel lilin), `botanical`
(bingkai lengkung, bunga, tepi kertas sobek), `panel` (panel warna pekat), `satin` (kain satin
bergelombang, plakat berlekuk, calla lily), `kraft` (kertas kraft sobek, dahlia, polaroid bertape),
`lavender` (gambar garis lavender dan daisy, pita judul), `renda` (oval renda, pita beludru, cermin
emas), `batik` (motif kawung dan tumpal, sogan dan emas), dan `islami` (lengkung masjid, bintang
geometris, Basmalah). Semua ilustrasi SVG dibuat sendiri di `src/components/invitation/` (`art.tsx`,
`ornaments.tsx`, `flora.tsx`, `heritage.tsx`, `nature.tsx`, `scenery.tsx`, `motifs.tsx`, `motifs2.tsx`), tanpa aset pihak ketiga.
Template Oriental memuat glyph 囍 dari Google Fonts (Noto Serif SC, hanya satu karakter). Menambah template: daftarkan di
`TEMPLATES` (`src/lib/util.ts`), tambah sketsa di `TemplateThumb.tsx`, dan blok CSS `[data-template]`.
Tiap undangan punya empat warna: utama, latar, teks, dan aksen (untuk bunga, pita, dan hiasan).
Bagian undangan: kalender, hitung mundur, rangkaian acara (timeline), dress code, hadiah (salin
rekening, plus gambar QR/QRIS), konfirmasi lewat WhatsApp, RSVP, dan ucapan. Semuanya diatur dari dashboard.

## Dashboard tamu

- **Cari dan saring** tamu (belum dikirim, belum dibuka, belum konfirmasi, hadir, tidak hadir, sudah check-in).
- **Kirim massal lewat WhatsApp**: antrean yang membuka WhatsApp tamu satu per satu dengan pesan yang bisa
  diubah (`{nama}`, `{pasangan}`, `{link}`), lalu menandai tamu sebagai terkirim.
- **Rekap RSVP**: bilah hadir/tidak hadir/belum, total orang, jumlah terkirim, dibuka, dan check-in.
- **Tiket QR dan check-in**: tamu terdaftar melihat kode QR di bagian RSVP undangannya. Halaman
  `/admin/<id>/checkin` (untuk HP petugas) memindai QR dengan kamera (Chrome/Android) atau mencari nama,
  lalu menandai tamu hadir.
- **Bahasa undangan**: Indonesia atau English (teks tampilan, tanggal, pratinjau link, dan pesan RSVP).
  Kalimat pembuka dan penutup bawaan ikut berganti; teks yang Anda ubah sendiri tidak diterjemahkan.

Tiga template (`elegant`, `floral`, `modern`) ada di `src/components/invitation/invitation.css`.
Warna dan font diatur per undangan dari dashboard lewat CSS variable. Untuk menambah template,
tambahkan entri di `TEMPLATES` (`src/lib/util.ts`) dan blok `[data-template="..."]` di CSS.

## Produksi

- Ganti `provider` di `prisma/schema.prisma` ke `postgresql` dan isi `DATABASE_URL`.
- Upload foto/musik disimpan di disk server (`UPLOAD_DIR`, default `./uploads`) dan disajikan lewat `/files/<nama>`.
  Di hosting dengan disk sementara (Vercel, Railway tanpa volume) file akan hilang saat redeploy:
  pasang volume persisten dan arahkan `UPLOAD_DIR` ke sana, atau ganti `src/app/api/admin/upload/route.ts`
  untuk menyimpan ke S3/Cloudinary. Batas: gambar 8 MB (jpg, png, webp, gif), audio 15 MB (mp3, m4a, ogg, wav).
