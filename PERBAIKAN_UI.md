# 🎨 Perbaikan Tampilan Mode Terang (High Contrast Update)

User melaporkan teks masih sulit dibaca. Langkah perbaikan lanjutan telah diterapkan dengan pendekatan **High Contrast & Solid Colors**.

## ✅ Perubahan V2 (Strict Mode)

### 1. **Global Styles (`globals.css`) - SOLID Background**
*   **Masalah**: Background transparan (`bg-white/90`) masih membuat teks sulit dibaca di beberapa layar.
*   **Solusi v2**: Menghilangkan transparansi total pada mode terang.
    *   `.glass` & `.glass-card` sekarang menggunakan **`bg-white` (Solid Putih)**.
    *   Hanya border dan shadow yang memberikan efek kedalaman.
    *   Background halaman diubah ke `#f8fafc` (Slate 50) untuk kontras maksimal dengan kartu putih.
    *   Teks utama (`--foreground`) diubah ke `#020617` (Hampir Hitam Pekat).

### 2. **Navbar (`Navbar.tsx`) - SOLID Text**
*   **Masalah**: Penggunaan `text-dark/70` (opacity) membuat teks terlihat pudar.
*   **Solusi**: Mengganti semua link navigasi menjadi **`text-slate-600` (Solid Abu Tua)** dan **`font-bold`** agar lebih tebal dan jelas.

### 3. **Komponen (`BlacklistCard.tsx`) - Colors**
*   Mengganti `text-dark` menjadi **`text-slate-900`** (Hitam standar).
*   Mengganti `text-dark/60` menjadi **`text-slate-500`** (Abu medium solid).

## 📱 Hasil yang Diharapkan
Sekarang tidak ada lagi elemen teks yang "samar" atau bergantung pada background di belakangnya. Teks hitam di atas background putih solid adalah kombinasi paling kontras dan mudah dibaca (WCAG AAA compliant).
