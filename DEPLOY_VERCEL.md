# 🚀 Panduan Deploy SellerGuard ke Vercel

Berikut adalah langkah-langkah mudah untuk meng-online-kan aplikasi SellerGuard menggunakan Vercel.

## 1. Persiapan GitHub
Sebelum deploy, pastikan kodinganmu sudah ada di GitHub.
1.  Buka terminal di VS Code.
2.  Jalankan perintah berikut (jika belum pernah push):
    ```bash
    git init
    git add .
    git commit -m "Siap deploy ke Vercel"
    # Buat repo baru di GitHub.com lalu copy link-nya
    git branch -M main
    git remote add origin <LINK_REPO_GITHUB_KAMU>
    git push -u origin main
    ```

## 2. Setup di Vercel
1.  Buka [vercel.com](https://vercel.com) dan login/daftar (saran: login pakai GitHub).
2.  Klik tombol **"Add New..."** -> **"Project"**.
3.  Pilih repository **SellerGuard** yang baru saja kamu push ke GitHub.
4.  Klik **"Import"**.

## 3. Konfigurasi Environment Variables (PENTING!)
Di halaman konfigurasi project ("Configure Project"), cari bagian **Environment Variables**.
Kamu WAJIB memasukkan 2 variabel ini agar database Supabase tersambung.

| Name | Value |
| :--- | :--- |
| `NEXT_PUBLIC_SUPABASE_URL` | `https://fahhslhjbyrgcqxjhgic.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZhaGhzbGhqYnlyZ2NxeGpoZ2ljIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgzODYxNTUsImV4cCI6MjA4Mzk2MjE1NX0.ssKKJMzsrK71SAQbMAW1objB1s7EExhgcG_km7yfYe4` |

> *Catatan: Key di atas diambil dari project kamu sebelumnya. Pastikan tidak ada spasi saat copy-paste.*

## 4. Deploy!
1.  Klik tombol **"Deploy"**.
2.  Tunggu proses build selesai (biasanya 1-2 menit).
3.  Jika berhasil, layar akan menampilkan kembang api dan tombol **"Go to Dashboard"**.
4.  Klik domain yang diberikan (contoh: `sellerguard.vercel.app`) untuk melihat hasilnya.

## 5. Post-Deployment Check
Setelah website online:
1.  Coba **Login/Register** untuk memastikan Auth jalan.
2.  Cek **Landing Page** apakah data Fraud Hunter muncul.
3.  Coba masuk ke **Admin Dashboard** (jika kamu login sebagai admin).

---

### 🆘 Troubleshooting

**Q: Build error "Type error: Property '...' does not exist..."**
*   **Solusi:** Biasanya karena TypeScript strict mode. Di Vercel, masuk ke **Settings** -> **General** -> **Build & Development Settings**. Ubah "Build Command" menjadi:
    `next build --no-lint` (untuk bypass lint error sementara)
    Atau perbaiki error TypeScript di kodingan lokal lalu push ulang.

**Q: Data tidak muncul / Loading Terus?**
*   **Solusi:** Cek kembali Environment Variables di Vercel (Settings -> Environment Variables). Pastikan URL dan KEY benar. Setelah update variable, kamu harus **Redeploy** (Deployment -> titik tiga -> Redeploy) agar perubahan ngefek.
