<<<<<<< HEAD
# 🌙 MoonChat

**MoonChat** adalah bot WhatsApp berbasis Node.js untuk membantu mengelola grup, mengolah media, dan menghadirkan fitur hiburan serta AI langsung dari chat.

[![Node.js](https://img.shields.io/badge/Node.js-18%2B-339933?logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![WhatsApp](https://img.shields.io/badge/Platform-WhatsApp-25D366?logo=whatsapp&logoColor=white)](https://www.whatsapp.com/)
[![License](https://img.shields.io/badge/License-ISC-blue.svg)](package.json)

> Proyek ini merupakan bot komunitas yang berjalan melalui koneksi WhatsApp Web menggunakan [Baileys](https://github.com/WhiskeySockets/Baileys). Gunakan secara bertanggung jawab dan patuhi ketentuan WhatsApp.

## ✨ Fitur

- **Manajemen grup** — moderasi anggota, peringatan, tag, sambutan, dan kontrol tautan.
- **Asisten AI** — perintah AI dan auto-reply yang dapat dikonfigurasi.
- **Media dan kreatif** — stiker, konversi media, efek gambar, serta berbagai utilitas unduhan.
- **Hiburan** — permainan, trivia, fakta, lelucon, kutipan, dan perintah seru lainnya.
- **Otomatisasi chat** — pengaturan seperti autoread, autotyping, dan respons otomatis.
- **Penyimpanan sesi lokal** — data autentikasi dan status bot disimpan di mesin yang menjalankan bot.

Lihat `.help` atau `.menu` di WhatsApp untuk daftar perintah lengkap.

## 🚀 Mulai cepat

### Persyaratan

- Node.js **18 atau lebih baru** dan npm.
- Akun WhatsApp untuk menautkan bot.
- Koneksi internet yang stabil.
- Kredensial API untuk fitur yang memerlukannya, seperti AI.

### Instalasi

```bash
git clone https://github.com/dzakyassyairozy/MoonChat.git
cd MoonChat
npm install
npm start
```

> Saat pertama kali berjalan, ikuti instruksi di terminal untuk menautkan akun WhatsApp. Setelah berhasil, sesi autentikasi tersimpan secara lokal agar bot dapat tersambung kembali.

### Konfigurasi

Sebelum menjalankan bot, periksa `settings.js` dan `data/owner.json`. Atur nomor pemilik serta pengaturan bot sesuai kebutuhan Anda. Format nomor menggunakan kode negara tanpa tanda `+` atau spasi.

Untuk fitur AI, siapkan API key pada konfigurasi lokal yang dibaca fitur terkait (misalnya `.env` atau `jarvis.json`). Jangan pernah memasukkan API key, token, kredensial sesi, atau nomor pribadi ke commit publik. Jika kredensial pernah terunggah, segera cabut atau rotasi kredensial tersebut.

> Jangan bagikan folder `session/` atau file data runtime. Siapa pun yang mendapat akses ke sesi dapat berpotensi menggunakan akun WhatsApp yang tertaut.

## 💬 Contoh penggunaan

Kirim perintah di chat pribadi atau grup:

```text
.help
.ping
.sticker
.joke
.jarvis Apa itu MoonChat?
```

Perintah admin grup memerlukan hak admin yang sesuai. Sebagian fitur bergantung pada API pihak ketiga dan mungkin perlu dikonfigurasi atau tidak selalu tersedia.

## 🛠️ Perintah npm

| Perintah | Fungsi |
| --- | --- |
| `npm start` | Menjalankan bot |
| `npm run start:optimized` | Menjalankan bot dengan opsi optimasi memori Node.js |
| `npm run install:panel` | Memasang dependensi dengan opsi kompatibilitas legacy peer deps |

## 📁 Data lokal

Saat berjalan, MoonChat dapat membuat atau memperbarui file sesi, cache, file sementara, serta data bot. File runtime dan rahasia sebaiknya tetap lokal dan tidak diunggah ke GitHub.

## 🤝 Kontribusi

Ide, perbaikan bug, dan pull request sangat terbuka. Jelaskan perubahan yang diajukan dan pastikan tidak menyertakan kredensial maupun data pribadi.

## 📄 Lisensi

Proyek ini mencantumkan lisensi **ISC** di `package.json`.
=======

>>>>>>> c03aba2dc6334e6b87c3db1befad1f81dd2335fb

