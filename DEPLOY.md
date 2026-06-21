# 🚀 Panduan Deploy IAAD Project ke Server Ubuntu

Panduan langkah demi langkah deploy toko IAAD Project ke VPS Ubuntu kosong,
dengan domain + HTTPS. Asumsi: domain `iaadproject.com` (ganti dengan domain Anda).

> **Arsitektur:** Nginx melayani frontend (file statis) + proxy `/api` & `/uploads`
> ke backend Node (dijalankan PM2). Database SQLite (file di server). HTTPS via Certbot.

---

## 0. Sebelum mulai

- Arahkan domain Anda ke IP server: buat **A record** `iaadproject.com` → IP server,
  dan `www` → IP server (lewat panel domain Anda).
- Login ke server via SSH: `ssh root@IP_SERVER` (atau user Anda).
- Ganti `iaadproject.com` di semua langkah dengan domain asli Anda.

---

## 1. Install dependensi di server

```bash
# Update sistem
sudo apt update && sudo apt upgrade -y

# Install Node.js 20 LTS
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Install Nginx, Git, dan tools build (untuk sqlite3)
sudo apt install -y nginx git build-essential python3

# Install PM2 global
sudo npm install -g pm2

# Cek versi
node -v && npm -v && nginx -v
```

---

## 2. Upload kode ke server

Pilih salah satu cara menaruh proyek di `/var/www/iaad`:

**Cara A — via Git (disarankan):**
```bash
sudo mkdir -p /var/www/iaad
sudo chown -R $USER:$USER /var/www/iaad
git clone <URL_REPO_ANDA> /var/www/iaad
```

**Cara B — via SCP dari komputer Anda** (jalankan di komputer lokal):
```bash
scp -r tokopedia-clone/* user@IP_SERVER:/var/www/iaad/
```

Struktur akhir di server harus:
```
/var/www/iaad/
├── backend/
└── frontend/
```

---

## 3. Setup Backend

```bash
cd /var/www/iaad/backend

# Install dependencies
npm install --production

# Buat folder database & uploads (permanen)
mkdir -p /var/www/iaad/database
mkdir -p /var/www/iaad/backend/uploads

# Siapkan file .env produksi
cp .env.production.example .env
nano .env
```

Di dalam `.env`, **WAJIB ubah**:
- `CLIENT_URL` → `https://iaadproject.com`
- `JWT_SECRET` → string acak. Generate dengan:
  ```bash
  node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
  ```
- `OWNER_EMAIL` & `OWNER_PASSWORD` → email & password pemilik yang Anda mau
- `DB_STORAGE` → `/var/www/iaad/database/tokopedia.sqlite`

Simpan (Ctrl+O, Enter, Ctrl+X).

```bash
# Jalankan backend dengan PM2
pm2 start ecosystem.config.js
pm2 save
pm2 startup    # ikuti perintah yang muncul agar PM2 auto-start saat reboot

# Cek backend hidup
curl http://localhost:5000/health
```

---

## 4. Setup Frontend (build)

```bash
cd /var/www/iaad/frontend

# Install dependencies
npm install

# Siapkan env produksi
cp .env.production.example .env.production

# Build jadi file statis (hasilnya di folder dist/)
npm run build
```

---

## 5. Konfigurasi Nginx

```bash
# Salin konfigurasi
sudo cp /var/www/iaad/deploy/nginx-iaad.conf /etc/nginx/sites-available/iaad

# Edit, ganti domain bila perlu
sudo nano /etc/nginx/sites-available/iaad

# Aktifkan
sudo ln -s /etc/nginx/sites-available/iaad /etc/nginx/sites-enabled/

# Nonaktifkan default (opsional)
sudo rm -f /etc/nginx/sites-enabled/default

# Tes konfigurasi & reload
sudo nginx -t
sudo systemctl reload nginx
```

Sekarang buka `http://iaadproject.com` — toko sudah tampil (masih HTTP).

---

## 6. Pasang HTTPS (SSL gratis)

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d iaadproject.com -d www.iaadproject.com
```

Ikuti petunjuknya (masukkan email, setuju TOS, pilih redirect HTTP→HTTPS).
Certbot otomatis memperbarui sertifikat. Selesai — buka `https://iaadproject.com`.

---

## 7. Cek akhir

- Buka `https://iaadproject.com` → katalog tampil
- Login pemilik di `https://iaadproject.com/login`
- Tambah produk + upload gambar → cek gambar muncul
- Tes tombol Telegram & WhatsApp

---

## 🔄 Update aplikasi (setelah ada perubahan kode)

```bash
cd /var/www/iaad
git pull                      # jika pakai Git

# Backend
cd backend && npm install --production && pm2 restart iaad-backend

# Frontend
cd ../frontend && npm install && npm run build
# (tidak perlu restart Nginx, file dist langsung terpakai)
```

---

## 🛠️ Perintah berguna

```bash
pm2 status              # lihat status backend
pm2 logs iaad-backend   # lihat log backend
pm2 restart iaad-backend
sudo systemctl status nginx
sudo tail -f /var/log/nginx/error.log
```

## 💾 Backup data

Cukup backup 2 hal ini secara berkala:
```bash
# Database
cp /var/www/iaad/database/tokopedia.sqlite ~/backup-db-$(date +%F).sqlite
# Folder gambar upload
tar -czf ~/backup-uploads-$(date +%F).tar.gz /var/www/iaad/backend/uploads
```
