# 🚀 Quick Start - EcomGuard Database Integration

## ⚡ Langkah Cepat (5 Menit)

### 1️⃣ Jalankan Migrasi Database
```bash
npm run migrate
```
Pilih opsi 1 atau 2, lalu ikuti instruksi.

### 2️⃣ Verifikasi Data
Buka Supabase Dashboard → Table Editor → Cek tabel `stats`:
```
✅ total_umkm_users: 10247
✅ total_resolved_disputes: 1429
✅ total_fraud_blocked: 24310
```

### 3️⃣ Jalankan Aplikasi
```bash
npm run dev
```

### 4️⃣ Test Halaman
- 🏠 Landing: http://localhost:3000
- 🛍️ Seller: http://localhost:3000/seller
- 👤 Buyer: http://localhost:3000/buyer
- 🛡️ Admin: http://localhost:3000/admin

---

## 📋 Checklist Cepat

### Setelah Migrasi
- [ ] Tabel `stats` ada dan berisi 3 rows
- [ ] Kolom `orders.price` sudah ada
- [ ] Kolom `blacklist.description` sudah ada
- [ ] Status `dismissed` sudah ada di blacklist

### Setelah Test
- [ ] Landing page menampilkan jumlah UMKM dari DB
- [ ] Seller dashboard menampilkan nama user yang benar
- [ ] Admin dashboard menampilkan stats dari DB
- [ ] Buyer dashboard menampilkan orders dari DB

---

## 🐛 Troubleshooting Cepat

### Error: "stats table not found"
```sql
-- Jalankan di Supabase SQL Editor
CREATE TABLE public.stats (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    key TEXT UNIQUE NOT NULL,
    value NUMERIC DEFAULT 0,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

INSERT INTO public.stats (key, value) VALUES 
    ('total_umkm_users', 10247),
    ('total_resolved_disputes', 1429),
    ('total_fraud_blocked', 24310);
```

### Error: "permission denied for table stats"
```sql
-- Enable RLS policy
ALTER TABLE public.stats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read stats" ON public.stats
    FOR SELECT USING (true);
```

### Data tidak muncul
1. Buka Browser Console (F12)
2. Cek error di Network tab
3. Cek apakah Supabase URL & Key benar di `.env.local`

---

## 📚 Dokumentasi Lengkap

- **Ringkasan Perbaikan**: `RINGKASAN_PERBAIKAN.md`
- **Detail Integrasi**: `DATABASE_INTEGRATION.md`
- **Diagram Arsitektur**: Lihat gambar di artifacts

---

## 💡 Tips

### Update Stats Manual
```sql
UPDATE public.stats 
SET value = value + 100 
WHERE key = 'total_umkm_users';
```

### Cek Real-time Subscription
Buka 2 browser window:
1. Window 1: Admin dashboard
2. Window 2: Seller → Report blacklist
3. Admin verify report
4. Stats auto-update di kedua window ✨

### Reset Stats
```sql
UPDATE public.stats SET value = 0 WHERE key = 'total_fraud_blocked';
```

---

## ✅ Selesai!

Jika semua checklist ✅, maka integrasi database **BERHASIL**!

**Next Steps:**
1. Tambah data dummy untuk testing
2. Test semua fitur CRUD
3. Deploy ke production

---

**Need Help?** Baca dokumentasi lengkap di `DATABASE_INTEGRATION.md`
