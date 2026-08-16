# KulKul (AI Cooking Companion)

> Asisten masak pintar berteknologi AI yang mampu "melihat" isi kulkas Anda dan meracik resep masakan lezat dalam hitungan detik.

[![Build Status](https://img.shields.io/badge/status-active-brightgreen)](#)
[![License](https://img.shields.io/badge/license-MIT-blue)](#)

---

## 📋 Table of Contents

- [About](#about)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Configuration](#configuration)
- [Security](#security)
- [How to Contribute](#how-to-contribute)
- [What's Next](#whats-next)
- [License](#license)
- [Acknowledgements](#acknowledgements)
- [Author](#author)

---

## 💡 About

Pernah bingung mau masak apa dengan sisa bahan seadanya di kulkas? **KulKul** hadir untuk menyelesaikan masalah tersebut. Cukup unggah foto isi kulkas Anda, dan AI dari Google Gemini akan mendeteksi bahan mentah yang ada, lalu meracik rekomendasi resep langkah demi langkah yang dilengkapi dengan mode memasak interaktif.

---

## ✨ Features

- **📸 Computer Vision Ingredient Detection**: Unggah foto isi kulkas, dan AI akan mendeteksi bahan mentah (sayur, daging, bumbu) yang spesifik beserta kuantitasnya.
- **👨‍🍳 AI Recipe Generator**: Menghasilkan 2-3 resep unik berdasarkan kombinasi bahan yang terdeteksi, bumbu dasar, dan gaya masakan pilihan Anda (misal: "Ala Anak Kosan" atau "Restoran Bintang 5").
- **🎨 Dynamic Food Photography**: Setiap resep dilengkapi gambar visual hidangan yang dibuat secara instan oleh Pollinations.ai.
- **⏱️ Interactive Cook Mode**: Panduan memasak langkah demi langkah dengan _built-in countdown timer_ (berdilengkapi notifikasi _audio chime_) untuk memastikan masakan Anda matang sempurna.
- **💾 State Persistence**: Keranjang bahan makanan dan resep tersimpan aman di browser menggunakan _Zustand Persist_, sehingga tidak hilang saat direfresh.

---

## 🛠️ Tech Stack

- **Frontend**: Next.js (App Router), React, TailwindCSS, Zustand
- **Backend**: Next.js Route Handlers (Serverless API)
- **AI Engine**: Google GenAI SDK (`gemini-3.1-flash-lite`)
- **Image Generation**: Pollinations.ai
- **Validation**: Zod
- **Icons & UI**: Lucide-React, Canvas Confetti

---

## 🏗️ Architecture

Aplikasi ini menggunakan pola arsitektur **Fullstack Serverless** dengan Next.js:

1. **Client (Browser)**: Menangani state global (Zustand), mengompres gambar kulkas menggunakan HTML5 Canvas, dan menampilkan UI responsif.
2. **Next.js API Routes (`/api/analyze-image` & `/api/generate-recipe`)**: Menjadi _proxy_ aman yang menyimpan API Key dan berkomunikasi langsung dengan server Google Gemini.
3. **Google GenAI**: Memproses gambar kulkas dan teks instruksi menggunakan model VLM (_Vision-Language Model_) dengan output berstruktur JSON Schema yang ketat.

---

## 📂 Project Structure

```text
├── src/
│   ├── app/
│   │   ├── api/          # Backend Route Handlers (Gemini API)
│   │   ├── cook/         # Interactive Cooking Mode
│   │   ├── recipes/      # AI Generated Recipes Page
│   │   ├── upload/       # Fridge Image Upload
│   │   └── page.tsx      # Landing Page
│   ├── components/       # Reusable UI Components
│   ├── hooks/            # Custom React Hooks
│   ├── lib/              # Utilities (Retry Logic, etc.)
│   └── store/            # Zustand Global Store
├── public/
├── next.config.ts
└── tailwind.config.ts
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18.x atau lebih baru disarankan)
- Kunci API Google Gemini Studio (Dapatkan di [Google AI Studio](https://aistudio.google.com/app/apikey))

### Installation

1. Clone repositori ini ke mesin lokal Anda:

```bash
git clone https://github.com/mby444/kulkul.git
cd kulkul
```

2. Install seluruh _dependencies_ yang diperlukan:

```bash
npm install
```

3. Jalankan server lokal:

```bash
npm run dev
```

Aplikasi sekarang dapat diakses di `http://localhost:3000`.

---

## ⚙️ Configuration

Aplikasi ini membutuhkan variabel lingkungan (Environment Variables) agar dapat berkomunikasi dengan Google AI.
Buat file bernama `.env.local` di dalam folder `code/` dan isi dengan konfigurasi berikut:

```bash
# Diambil dari Google AI Studio
GEMINI_API_KEY=AIzaSyYourSecretKeyHere...

# (Opsional) Jika menggunakan API premium Pollinations
POLLINATIONS_API_KEY=YourOptionalKeyHere...
```

---

## 🔒 Security

- **Penyimpanan API Key**: Jangan pernah menaruh `GEMINI_API_KEY` di kode _frontend_ (`NEXT_PUBLIC_...`). Semua panggilan ke AI dialihkan melalui `/api/` (Next.js server-side) agar kredensial tetap aman.
- **Validasi Zod**: Semua data JSON yang dikembalikan oleh AI - yang rentan berhalusinasi - divalidasi secara ketat (_parsing_) menggunakan Zod sebelum dikirim ke UI.

---

## 🤝 How to Contribute

Proyek ini terbuka untuk umum! Jika Anda ingin menambahkan fitur masakan baru atau memperbaiki bug:

1. Fork The Project
2. Create your Feature Branch (`git checkout -b feature/FiturKeren`)
3. Commit your Changes (`git commit -m 'Menambahkan FiturKeren'`)
4. Push to the Branch (`git push origin feature/FiturKeren`)
5. Open a Pull Request

---

## 🔮 What's Next?

- [ ] Integrasi dengan API Supermarket lokal untuk perhitungan estimasi harga bahan kurang.
- [ ] Opsi filter untuk jenis diet (Keto, Vegan, Halal).
- [ ] Fitur riwayat masakan berfitur _share_ ke media sosial.

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

## 🙏 Acknowledgements

- [Google AI Studio (Gemini)](https://ai.google.dev/)
- [Pollinations.ai](https://pollinations.ai/) untuk _generative food image_ gratis.
- [Lucide Icons](https://lucide.dev/) untuk koleksi ikon yang elegan.
- _Antigravity AI_ - Partner kolaborasi perancangan kode.

---

## 👤 Author

- **AI Cooking Companion Team**
