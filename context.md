# Echoes - Context for Development

## Ringkasan

Echoes adalah aplikasi jurnal pribadi desktop dan web yang dibangun dengan React, TypeScript, Vite, dan Tauri 2. Pengguna dapat membuat catatan harian, menambahkan mood dan tag, memformat tulisan, menyisipkan gambar, serta melihat statistik perjalanan menulis.

## Stack

- Frontend: React 19 dan TypeScript.
- Build dan dev server: Vite.
- Desktop runtime: Tauri 2 dan Rust.
- Editor: Tiptap dengan StarterKit, Highlight, Image, dan Placeholder.
- Styling: Tailwind CSS 4 melalui plugin Vite.
- Ikon: lucide-react.
- Validasi/lint: TypeScript dan Oxlint.

## Struktur Utama

- `src/App.tsx`: state global halaman jurnal, lifecycle data, save/delete, PIN, font, dan zen mode.
- `src/components/MainLayout.tsx`: shell aplikasi dan layout utama.
- `src/components/Sidebar.tsx`: daftar entry dan navigasi.
- `src/components/Editor.tsx`: rich text editor dan toolbar formatting.
- `src/components/Dashboard.tsx`: overview, kalender, statistik streak, dan media gallery.
- `src/components/SettingsModal.tsx`: PIN keamanan dan pilihan font.
- `src/components/LockScreen.tsx`: layar pembuka saat PIN aktif.
- `src/components/DateModal.tsx`: pemilihan tanggal entry.
- `src/components/ConfirmModal.tsx`: konfirmasi penghapusan.
- `src/services/storage.ts`: abstraksi baca, simpan, dan hapus entry.
- `src/types/index.ts`: tipe `JournalEntry`.
- `src/lib/prompts.ts`: prompt inspirasi tulisan.
- `src-tauri/`: konfigurasi dan entry point aplikasi desktop Tauri.

## Model Data

```ts
interface JournalEntry {
  id: string;
  title: string;
  content: string; // HTML dari Tiptap
  date: string; // ISO 8601
  mood?: string;
  tags?: string[];
}
```

Mood yang tersedia saat ini: `Happy`, `Calm`, `Reflective`, `Sad`, `Angry`, `Anxious`, `Excited`, `Tired`, dan `Grateful`.

## Penyimpanan

`storage.ts` mendeteksi runtime melalui `window.__TAURI_INTERNALS__`.

- Browser/Vite: data disimpan di `localStorage` dengan key `echoes_entries`.
- Tauri: data disimpan di direktori AppData pada `EchoesData/entries.json`.
- Pengaturan PIN disimpan dengan key `echoes_pin`.
- Pilihan font disimpan dengan key `echoes_font`.

Konten entry disimpan sebagai HTML. Gambar yang dimasukkan melalui editor dibaca sebagai Data URL/base64 dan ikut tersimpan di dalam HTML entry.

## Alur Aplikasi

1. Saat mount, aplikasi membaca PIN dan pilihan font dari `localStorage`.
2. Jika PIN aktif, `LockScreen` ditampilkan sebelum entry dimuat.
3. Setelah terbuka, entry dimuat melalui `getEntries()`.
4. Jika belum ada entry, editor baru dibuat otomatis.
5. Perubahan dianggap dirty sampai disimpan dengan tombol save atau `Ctrl+S`/`Cmd+S`.
6. Entry dapat dipilih dari sidebar, dibuat dengan tanggal tertentu, dibuka dari kalender, atau dihapus setelah konfirmasi.

## Perintah Pengembangan

```bash
npm install
npm run dev
npm run build
npm run lint
npm run preview
npm run tauri dev
npm run tauri build
```

`npm run dev` menjalankan versi browser di `http://localhost:5173`. Perintah Tauri menjalankan atau membangun aplikasi desktop dan akan memakai build frontend sesuai konfigurasi `src-tauri/tauri.conf.json`.

## Catatan Implementasi

- Tidak ada backend atau sinkronisasi cloud.
- Format tanggal dan beberapa label UI saat ini menggunakan locale `en-US`.
- PIN hanya berupa PIN lokal 4 digit; data jurnal tidak dienkripsi oleh aplikasi.
- Jika mengubah model entry atau format storage, pertahankan fallback browser dan adapter Tauri agar dua runtime tetap berfungsi.
- Jangan memindahkan logika penyimpanan ke komponen UI tanpa memperbarui kontrak di `src/services/storage.ts`.