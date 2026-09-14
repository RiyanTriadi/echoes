# Echoes

Echoes adalah aplikasi jurnal pribadi untuk menulis, menyimpan, dan meninjau kembali catatan harian. Aplikasi tersedia sebagai web app berbasis Vite dan aplikasi desktop berbasis Tauri.

## Fitur

- Membuat, mengedit, memilih, dan menghapus entry jurnal.
- Rich text editor berbasis Tiptap: bold, italic, strikethrough, highlight, heading, quote, daftar, dan gambar.
- Metadata entry berupa mood dan tag.
- Dashboard dengan jumlah entry, jumlah kata, current streak, longest streak, dan kalender aktivitas.
- Media Gallery untuk gambar yang ada di entry.
- Inspirasi prompt untuk membantu memulai tulisan.
- Zen mode untuk menulis dengan gangguan minimal.
- PIN 4 digit untuk mengunci jurnal saat aplikasi dibuka.
- Pilihan font serif, sans-serif, atau monospace.
- Shortcut `Ctrl+S` atau `Cmd+S` untuk menyimpan entry dan `Escape` untuk keluar dari zen mode.

## Teknologi

- React 19 dan TypeScript
- Vite
- Tauri 2 dan Rust
- Tiptap
- Tailwind CSS 4
- lucide-react

## Menjalankan Secara Lokal

Prasyarat:

- Node.js dan npm
- Rust toolchain jika ingin menjalankan aplikasi Tauri

Instal dependensi:

```bash
npm install
```

Jalankan versi browser:

```bash
npm run dev
```

Buka `http://localhost:5173` di browser.

Jalankan versi desktop Tauri:

```bash
npm run tauri dev
```

## Perintah NPM

| Perintah | Kegunaan |
| --- | --- |
| `npm run dev` | Menjalankan Vite development server |
| `npm run build` | Type-check dan membuat build production frontend |
| `npm run lint` | Menjalankan Oxlint |
| `npm run preview` | Menyajikan hasil build secara lokal |
| `npm run tauri dev` | Menjalankan aplikasi desktop Tauri |
| `npm run tauri build` | Membuat paket aplikasi Tauri |

## Penyimpanan Data

Echoes tidak memakai backend atau cloud sync.

- Saat berjalan di browser, entry disimpan di `localStorage` dengan key `echoes_entries`.
- Saat berjalan sebagai aplikasi Tauri, entry disimpan di AppData pada `EchoesData/entries.json`.
- PIN disimpan di `localStorage` dengan key `echoes_pin`.
- Preferensi font disimpan di `localStorage` dengan key `echoes_font`.

Konten editor disimpan sebagai HTML. Gambar yang ditambahkan melalui editor disimpan sebagai Data URL/base64 di dalam HTML entry, sehingga ukuran data dapat bertambah cukup besar.

## Struktur Proyek

- `src/App.tsx`: state dan alur utama aplikasi.
- `src/components/`: layout, sidebar, editor, dashboard, modal, dan lock screen.
- `src/services/storage.ts`: adapter penyimpanan browser dan Tauri.
- `src/types/`: definisi tipe data.
- `src-tauri/`: konfigurasi dan kode runtime desktop.
- `context.md`: konteks teknis dan panduan singkat untuk pengembangan lanjutan.

## Catatan Keamanan

PIN berfungsi sebagai pengunci akses lokal, bukan enkripsi. Data jurnal tidak dienkripsi oleh aplikasi. Jangan menganggap PIN sebagai perlindungan terhadap akses langsung ke file AppData atau storage browser.
