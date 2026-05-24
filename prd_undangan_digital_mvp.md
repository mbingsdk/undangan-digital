# PRD Undangan Digital MVP

## 1. Ringkasan Produk

Produk ini adalah platform undangan digital berbasis web yang memungkinkan admin membuat, mengelola, dan membagikan undangan online melalui link unik. Fokus awal adalah undangan pernikahan, namun struktur produk dibuat cukup fleksibel agar nantinya dapat dikembangkan untuk acara lain seperti engagement, ulang tahun, aqiqah, gathering, dan event bisnis kecil.

Platform akan dibangun menggunakan Next.js sebagai fullstack framework, berjalan di Alibaba ECS 1 vCPU / 1 GB RAM dengan mode standalone output. Produk MVP difokuskan pada satu admin/internal operator terlebih dahulu, bukan SaaS multi-tenant penuh.

## 2. Tujuan Produk

### Tujuan Utama

Membangun sistem undangan digital yang bisa digunakan untuk membuat dan menerbitkan undangan online secara cepat, rapi, ringan, dan dapat dijual ke customer.

### Tujuan MVP

- Admin bisa login ke panel.
- Admin bisa membuat undangan baru.
- Admin bisa mengisi data pasangan/acara.
- Admin bisa upload foto/gambar undangan.
- Admin bisa memilih atau memakai template default.
- Sistem menghasilkan link undangan berdasarkan slug.
- Tamu bisa membuka undangan publik.
- Tamu bisa mengisi RSVP.
- Tamu bisa mengirim ucapan.
- Undangan memiliki gallery, countdown, maps, gift, dan tombol share WhatsApp.

### Non-Tujuan MVP

Hal-hal ini tidak masuk MVP awal:

- Multi-user SaaS lengkap.
- Payment gateway otomatis.
- Subdomain custom per undangan.
- Template marketplace.
- Realtime websocket untuk ucapan.
- Editor drag-and-drop visual.
- Generate PDF otomatis.
- Video upload besar.
- Sistem reseller/affiliate.

## 3. Target Pengguna

### 3.1 Admin / Operator

Admin adalah pemilik layanan atau tim internal yang membuatkan undangan untuk customer.

Kebutuhan admin:

- Login ke dashboard.
- Membuat undangan baru.
- Mengedit data undangan.
- Mengatur status publish/unpublish.
- Melihat RSVP.
- Melihat dan menghapus ucapan tamu.
- Mengupload foto gallery.
- Mengatur gift/rekening.

### 3.2 Customer / Pemilik Acara

Pada MVP awal, customer belum login sendiri. Customer memberikan data ke admin, lalu admin memasukkan data ke sistem.

Kebutuhan customer:

- Mendapatkan link undangan.
- Bisa membagikan link ke tamu.
- Bisa melihat RSVP dan ucapan melalui laporan dari admin.

### 3.3 Tamu Undangan

Tamu adalah orang yang membuka link undangan.

Kebutuhan tamu:

- Membuka undangan dengan cepat.
- Melihat detail acara.
- Membuka lokasi di Google Maps.
- Mengirim RSVP.
- Mengirim ucapan.
- Melihat informasi gift jika tersedia.
- Membagikan undangan jika diperlukan.

## 4. Platform dan Teknologi

### 4.1 Frontend dan Backend

- Framework: Next.js App Router.
- Bahasa: TypeScript.
- Styling: Tailwind CSS.
- UI: Custom component, tidak terlalu bergantung pada library berat.
- Backend: Next.js Route Handler / Server Actions sesuai kebutuhan.
- Deploy: Self-hosted Node.js dengan Next.js standalone output.

### 4.2 Infrastruktur

- VPS: Alibaba ECS 1 vCPU / 1 GB RAM.
- OS: Ubuntu.
- Reverse proxy: Caddy atau Nginx.
- Process manager: PM2 atau systemd.
- CDN/DNS: Cloudflare.
- SSL: Dari Caddy otomatis atau Cloudflare + origin.

### 4.3 Database

MVP:

- SQLite + Prisma.

Alasan:

- Ringan untuk VPS 1 GB.
- Cukup untuk MVP.
- Mudah backup.
- Tidak perlu service database tambahan.

Upgrade nanti:

- PostgreSQL ketika traffic, data, atau kebutuhan multi-user meningkat.

### 4.4 File Storage

MVP:

- Upload lokal ke folder `/uploads` atau `/public/uploads` dengan validasi ukuran dan tipe file.

Upgrade nanti:

- Object storage seperti Cloudflare R2, Alibaba OSS, atau S3-compatible storage.

## 5. Scope MVP

## 5.1 Public Invitation Page

Halaman publik undangan dapat diakses melalui slug:

```txt
https://domain.com/rizky-salsa
```

### Section halaman publik

1. Cover / opening screen.
2. Nama pasangan.
3. Tanggal acara.
4. Countdown.
5. Salam pembuka.
6. Detail acara.
7. Google Maps.
8. Gallery foto.
9. Love story opsional.
10. RSVP.
11. Ucapan tamu.
12. Gift / rekening.
13. Closing.
14. Tombol share WhatsApp.

### Perilaku halaman publik

- Saat halaman dibuka, tampil cover dengan tombol “Buka Undangan”.
- Musik hanya mulai setelah user klik tombol buka undangan.
- Jika undangan belum publish, tampil halaman not found atau “Undangan belum tersedia”.
- Jika slug tidak ditemukan, tampil halaman 404 custom.
- Data undangan publik harus ringan dan cepat dimuat.

## 5.2 Admin Authentication

### Fitur

- Login admin menggunakan email/username dan password.
- Logout.
- Session berbasis cookie.
- Proteksi route admin.

### MVP Rule

- Hanya satu role: admin.
- Tidak perlu register publik.
- User admin bisa dibuat melalui seed database atau command internal.

## 5.3 Admin Dashboard

### Halaman utama admin

Menampilkan ringkasan:

- Jumlah undangan.
- Jumlah undangan publish.
- Jumlah RSVP.
- Jumlah ucapan.
- Daftar undangan terbaru.

## 5.4 CRUD Undangan

### Admin bisa membuat undangan baru

Field utama:

- Judul undangan.
- Slug.
- Nama mempelai pria.
- Nama mempelai wanita.
- Teks pembuka.
- Teks penutup.
- Cover image.
- Background music.
- Status publish.

### Admin bisa mengedit undangan

Admin dapat memperbarui semua field undangan.

### Admin bisa menghapus undangan

Soft delete direkomendasikan agar data tidak langsung hilang.

### Admin bisa publish/unpublish undangan

Status:

- Draft.
- Published.
- Archived.

## 5.5 Detail Acara

Satu undangan bisa memiliki lebih dari satu acara.

Contoh:

- Akad.
- Resepsi.
- Pemberkatan.
- Ngunduh mantu.

Field acara:

- Nama acara.
- Tanggal.
- Jam mulai.
- Jam selesai opsional.
- Lokasi.
- Alamat lengkap.
- Link Google Maps.

## 5.6 Gallery

Admin bisa menambahkan foto ke undangan.

Field gallery:

- Image URL/path.
- Caption opsional.
- Sort order.

Aturan MVP:

- Maksimal ukuran file ditentukan, misalnya 2 MB per foto.
- Format yang diterima: JPG, JPEG, PNG, WebP.
- Disarankan konversi manual atau frontend compression sebelum upload.

## 5.7 RSVP

Tamu bisa mengirim RSVP.

Field RSVP:

- Nama tamu.
- Status kehadiran: hadir, tidak hadir, ragu-ragu.
- Jumlah tamu.
- Pesan opsional.

Aturan:

- Nama wajib diisi.
- Status wajib dipilih.
- Jumlah tamu minimal 1 jika hadir.
- Batasi spam sederhana berdasarkan IP atau rate limit basic.

## 5.8 Ucapan Tamu

Tamu bisa mengirim ucapan.

Field ucapan:

- Nama.
- Pesan.
- Status tampil/hidden.

Aturan:

- Pesan wajib diisi.
- Admin bisa menghapus atau menyembunyikan ucapan.
- Untuk MVP, ucapan bisa langsung tampil setelah dikirim.
- Moderasi manual bisa ditambahkan setelah MVP.

## 5.9 Gift / Rekening

Admin bisa menambahkan rekening atau metode hadiah digital.

Field gift:

- Nama bank/e-wallet.
- Nomor rekening/nomor tujuan.
- Nama pemilik.
- QR image opsional.
- Catatan opsional.

Public page menampilkan daftar rekening/gift dengan tombol copy.

## 5.10 Share WhatsApp

Setiap undangan memiliki tombol share WhatsApp.

Format default pesan:

```txt
Assalamu'alaikum Wr. Wb.

Dengan penuh rasa syukur, kami mengundang Bapak/Ibu/Saudara/i untuk hadir dalam acara kami:

[Nama Pasangan]

Silakan buka undangan digital kami melalui link berikut:
[Link Undangan]

Terima kasih.
```

Admin bisa mengedit template pesan share pada versi berikutnya.

## 6. User Flow

## 6.1 Flow Admin Membuat Undangan

```txt
Admin login
↓
Masuk dashboard
↓
Klik Buat Undangan
↓
Isi data utama
↓
Tambah detail acara
↓
Upload cover/gallery
↓
Tambah gift opsional
↓
Preview undangan
↓
Publish
↓
Copy link undangan
```

## 6.2 Flow Tamu Membuka Undangan

```txt
Tamu menerima link
↓
Buka halaman undangan
↓
Klik Buka Undangan
↓
Melihat detail acara
↓
Buka maps jika perlu
↓
Isi RSVP
↓
Kirim ucapan
↓
Share jika diperlukan
```

## 7. Data Model Awal

## 7.1 User

```txt
id
name
email
passwordHash
role
createdAt
updatedAt
```

## 7.2 Invitation

```txt
id
slug
title
groomName
brideName
openingText
closingText
coverImage
musicUrl
status
publishedAt
createdAt
updatedAt
deletedAt
```

## 7.3 InvitationEvent

```txt
id
invitationId
title
date
startTime
endTime
venueName
address
mapsUrl
sortOrder
createdAt
updatedAt
```

## 7.4 GalleryImage

```txt
id
invitationId
imageUrl
caption
sortOrder
createdAt
updatedAt
```

## 7.5 RSVP

```txt
id
invitationId
name
attendanceStatus
guestCount
message
ipAddress
createdAt
```

## 7.6 Wish

```txt
id
invitationId
name
message
isVisible
ipAddress
createdAt
updatedAt
```

## 7.7 GiftAccount

```txt
id
invitationId
providerName
accountNumber
accountHolder
qrImage
note
sortOrder
createdAt
updatedAt
```

## 8. Route Structure

## 8.1 Public Routes

```txt
/[slug]
```

## 8.2 Admin Routes

```txt
/admin/login
/admin
/admin/invitations
/admin/invitations/new
/admin/invitations/[id]
/admin/invitations/[id]/preview
/admin/invitations/[id]/rsvps
/admin/invitations/[id]/wishes
```

## 8.3 API Routes

```txt
POST   /api/auth/login
POST   /api/auth/logout
GET    /api/admin/invitations
POST   /api/admin/invitations
GET    /api/admin/invitations/[id]
PATCH  /api/admin/invitations/[id]
DELETE /api/admin/invitations/[id]
POST   /api/admin/invitations/[id]/publish
POST   /api/admin/invitations/[id]/unpublish
POST   /api/admin/uploads
GET    /api/public/invitations/[slug]
POST   /api/public/invitations/[slug]/rsvp
POST   /api/public/invitations/[slug]/wishes
```

## 9. Functional Requirements

## 9.1 Authentication

- Sistem harus bisa memverifikasi login admin.
- Password harus disimpan dalam bentuk hash.
- Admin route harus tidak bisa diakses tanpa login.
- Session harus memiliki expiry.

## 9.2 Invitation Management

- Sistem harus bisa membuat undangan baru.
- Slug harus unik.
- Admin bisa mengubah slug selama belum ada konflik.
- Admin bisa publish/unpublish undangan.
- Undangan draft tidak boleh tampil publik.

## 9.3 Public Invitation

- Sistem harus menampilkan undangan berdasarkan slug.
- Sistem harus menampilkan 404 jika slug tidak ada.
- Sistem harus menampilkan status tidak tersedia jika undangan belum publish.
- Musik tidak boleh autoplay sebelum interaksi user.

## 9.4 RSVP

- Tamu bisa mengirim RSVP.
- Sistem harus menyimpan RSVP ke database.
- Admin bisa melihat daftar RSVP.
- Input harus divalidasi.

## 9.5 Wishes

- Tamu bisa mengirim ucapan.
- Sistem harus menyimpan ucapan ke database.
- Admin bisa melihat ucapan.
- Admin bisa menyembunyikan atau menghapus ucapan.

## 9.6 Upload

- Admin bisa upload gambar.
- Sistem harus membatasi ukuran file.
- Sistem harus membatasi tipe file.
- File upload harus disimpan dengan nama aman.

## 10. Non-Functional Requirements

## 10.1 Performance

Target:

- Public page harus ringan.
- Halaman undangan idealnya dapat dimuat cepat pada koneksi mobile.
- Asset gambar harus dikompres.
- Hindari query berulang yang tidak perlu.

Strategi:

- Gunakan static asset caching.
- Gunakan metadata yang ringan.
- Jangan memuat semua gambar resolusi besar sekaligus.
- Gunakan lazy loading untuk gallery.

## 10.2 Security

- Password wajib di-hash.
- Admin route wajib dilindungi.
- Upload file harus divalidasi.
- Input RSVP dan ucapan harus disanitasi.
- Gunakan CSRF protection atau pendekatan session aman.
- Rate limit basic untuk endpoint publik.

## 10.3 Reliability

- Database SQLite harus rutin dibackup.
- Upload folder harus ikut dibackup.
- Aplikasi dijalankan dengan PM2/systemd agar auto-restart.
- Reverse proxy harus menangani SSL.

## 10.4 Scalability

MVP dirancang untuk berjalan di VPS kecil, namun jalur upgrade harus tersedia:

- SQLite ke PostgreSQL.
- Local uploads ke object storage.
- Single admin ke multi-user.
- Single template ke multi-template.
- Manual order ke payment gateway.

## 11. UI/UX Direction

## 11.1 Public Invitation Style

Arah desain awal:

- Elegant.
- Soft.
- Mobile-first.
- Animasi halus.
- Tidak terlalu banyak emoji.
- Tidak memakai style AI generik yang terlalu biru/ungu gelap.
- Fokus pada typography, spacing, dan motion.

Public page harus terasa seperti undangan premium, bukan landing page template murahan.

## 11.2 Admin Panel Style

Arah desain admin:

- Bersih.
- Cepat dipakai.
- Form mudah dipahami.
- Preview jelas.
- Tidak terlalu dekoratif.
- Fokus pada produktivitas.

## 12. MVP Milestones

## Milestone 1: Project Foundation

Deliverables:

- Setup Next.js App Router.
- Setup TypeScript.
- Setup Tailwind.
- Setup Prisma + SQLite.
- Setup auth basic.
- Setup layout admin dan public.

## Milestone 2: Invitation CRUD

Deliverables:

- CRUD undangan.
- Slug unik.
- Status draft/published.
- Detail acara.
- Gift account.

## Milestone 3: Public Page

Deliverables:

- Halaman `/[slug]`.
- Template undangan pertama.
- Countdown.
- Maps.
- Gallery.
- Music after interaction.
- Share WhatsApp.

## Milestone 4: RSVP dan Wishes

Deliverables:

- Form RSVP.
- Form ucapan.
- Admin list RSVP.
- Admin list ucapan.
- Hide/delete ucapan.

## Milestone 5: Upload dan Deployment

Deliverables:

- Upload cover/gallery.
- Validasi file.
- Build standalone.
- Deploy ke Alibaba ECS.
- Setup Caddy/Nginx.
- Setup PM2/systemd.
- Setup domain Cloudflare.

## 13. Acceptance Criteria MVP

MVP dianggap selesai jika:

- Admin bisa login.
- Admin bisa membuat undangan baru.
- Admin bisa mengisi minimal satu acara.
- Admin bisa upload cover dan gallery.
- Admin bisa publish undangan.
- Link publik bisa dibuka menggunakan slug.
- Tamu bisa melihat detail acara.
- Tamu bisa membuka Google Maps.
- Tamu bisa mengirim RSVP.
- Tamu bisa mengirim ucapan.
- Admin bisa melihat RSVP dan ucapan.
- Admin bisa unpublish undangan.
- Aplikasi bisa berjalan di server Alibaba ECS 1 vCPU / 1 GB RAM.
- Aplikasi bisa dijalankan dengan standalone output.

## 14. Risiko dan Mitigasi

## 14.1 VPS 1 GB RAM Terlalu Kecil

Risiko:

- Build Next.js bisa berat di server.
- Runtime bisa terganggu jika upload dan image processing berat.

Mitigasi:

- Build di lokal atau CI, lalu upload hasil build.
- Gunakan output standalone.
- Hindari image processing berat di server.
- Gunakan swap kecil di server.
- Batasi ukuran upload.

## 14.2 Upload Membengkak

Risiko:

- Disk penuh karena banyak foto.

Mitigasi:

- Batasi jumlah foto per undangan.
- Batasi ukuran file.
- Kompres gambar sebelum upload.
- Tambahkan object storage pada fase berikutnya.

## 14.3 Spam Ucapan / RSVP

Risiko:

- Bot atau orang iseng mengirim banyak pesan.

Mitigasi:

- Rate limit by IP.
- Validasi input.
- Tambahkan Turnstile/Captcha pada fase berikutnya.
- Admin bisa hide/delete ucapan.

## 14.4 Data Hilang

Risiko:

- SQLite dan upload lokal hilang jika server bermasalah.

Mitigasi:

- Backup database dan folder upload secara berkala.
- Simpan backup ke storage eksternal.

## 15. Future Roadmap

## Phase 2

- Multi-template.
- Custom color theme.
- Love story timeline.
- Guest name personalized URL.
- Export RSVP CSV.
- Moderasi ucapan.
- Cloudflare R2 / Alibaba OSS untuk storage.

## Phase 3

- Customer login.
- Paket harga.
- Payment gateway.
- Invoice/order.
- Masa aktif undangan.
- Custom domain/subdomain.
- Analytics undangan.

## Phase 4

- SaaS multi-tenant.
- Template marketplace.
- Editor visual.
- Reseller panel.
- White-label brand.

## 16. Rekomendasi MVP Final

Versi awal sebaiknya dibuat sesederhana ini:

```txt
Next.js App Router
Prisma + SQLite
Admin login
CRUD undangan
1 template premium
Slug public
Gallery
RSVP
Ucapan
Gift
Share WhatsApp
Deploy standalone ke Alibaba ECS
```

Fokus utama bukan banyak template, tapi satu template yang benar-benar terlihat premium dan sistem admin yang enak dipakai. Setelah produk pertama bisa dijual, baru tambah variasi template dan fitur komersial lain.

