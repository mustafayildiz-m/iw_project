# Production Deployment Guide

## 🚀 Production Kurulum Adımları

### 1. Sunucu Gereksinimleri

**Minimum Gereksinimler:**
- Node.js 18.x veya üzeri
- PM2 (Process Manager)
- Nginx (Reverse Proxy)
- SSL Sertifikası (Let's Encrypt önerilir)

**Önerilen Sunucu:**
- 2 CPU Core
- 4GB RAM
- 20GB SSD
- Ubuntu 20.04+ / CentOS 8+

### 2. Sunucu Hazırlığı

```bash
# Node.js kurulumu
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# PM2 kurulumu
sudo npm install -g pm2

# Nginx kurulumu
sudo apt update
sudo apt install nginx

# Git kurulumu (eğer yoksa)
sudo apt install git
```

### 3. Proje Kurulumu

```bash
# Proje klasörüne git
cd /var/www/
sudo git clone <your-repo-url> user-front
cd user-front

# Bağımlılıkları yükle
npm install

# Production build
npm run build
```

### 4. Environment Değişkenleri

`.env.production` dosyası oluşturun:

```env
# API Configuration
NEXT_PUBLIC_API_URL=https://api.yourdomain.com

# NextAuth Configuration
NEXTAUTH_URL=https://user.yourdomain.com
NEXTAUTH_SECRET=your-super-secret-key-here

# Node Environment
NODE_ENV=production
```

### 5. PM2 Konfigürasyonu

`ecosystem.config.js` dosyası oluşturun:

```javascript
module.exports = {
  apps: [{
    name: 'user-front',
    script: 'npm',
    args: 'start',
    cwd: '/var/www/user-front',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3001
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 3001
    },
    log_file: '/var/log/pm2/user-front.log',
    out_file: '/var/log/pm2/user-front-out.log',
    error_file: '/var/log/pm2/user-front-error.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z'
  }]
};
```

### 6. PM2 ile Başlatma

```bash
# PM2 ile uygulamayı başlat
pm2 start ecosystem.config.js --env production

# PM2'yi sistem başlangıcında otomatik başlat
pm2 startup
pm2 save

# Durumu kontrol et
pm2 status
pm2 logs user-front
```

### 7. Nginx Konfigürasyonu

`/etc/nginx/sites-available/user-front` dosyası oluşturun:

```nginx
server {
    listen 80;
    server_name user.yourdomain.com;
    
    # HTTP'den HTTPS'e yönlendirme
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name user.yourdomain.com;
    
    # SSL Sertifika yolları
    ssl_certificate /etc/letsencrypt/live/user.yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/user.yourdomain.com/privkey.pem;
    
    # SSL Konfigürasyonu
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;
    
    # Gzip sıkıştırma
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;
    
    # Next.js uygulamasına proxy
    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
    
    # Static dosyalar için cache
    location /_next/static/ {
        proxy_pass http://localhost:3001;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }
    
    # Favicon ve diğer statik dosyalar
    location /favicon.ico {
        proxy_pass http://localhost:3001;
        add_header Cache-Control "public, max-age=86400";
    }
}
```

### 8. Nginx'i Etkinleştir

```bash
# Site konfigürasyonunu etkinleştir
sudo ln -s /etc/nginx/sites-available/user-front /etc/nginx/sites-enabled/

# Nginx konfigürasyonunu test et
sudo nginx -t

# Nginx'i yeniden başlat
sudo systemctl restart nginx
sudo systemctl enable nginx
```

### 9. SSL Sertifikası (Let's Encrypt)

```bash
# Certbot kurulumu
sudo apt install certbot python3-certbot-nginx

# SSL sertifikası al
sudo certbot --nginx -d user.yourdomain.com

# Otomatik yenileme test et
sudo certbot renew --dry-run
```

### 10. Firewall Konfigürasyonu

```bash
# UFW ile firewall ayarları
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS
sudo ufw enable
```

### 11. Monitoring ve Loglar

```bash
# PM2 loglarını görüntüle
pm2 logs user-front

# Nginx logları
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# Sistem kaynaklarını izle
pm2 monit
```

### 12. Güncelleme Süreci

```bash
# Yeni kodları çek
cd /var/www/user-front
git pull origin main

# Bağımlılıkları güncelle
npm install

# Production build
npm run build

# PM2'yi yeniden başlat
pm2 reload user-front
```

## 🔧 Troubleshooting

### PM2 Sorunları
```bash
# PM2'yi yeniden başlat
pm2 restart user-front

# Logları temizle
pm2 flush user-front

# PM2'yi tamamen yeniden başlat
pm2 kill
pm2 start ecosystem.config.js --env production
```

### Nginx Sorunları
```bash
# Nginx konfigürasyonunu test et
sudo nginx -t

# Nginx'i yeniden başlat
sudo systemctl restart nginx

# Nginx durumunu kontrol et
sudo systemctl status nginx
```

### Port Çakışması
```bash
# Port 3001'i kullanan işlemi bul
sudo lsof -i :3001

# İşlemi sonlandır
sudo kill -9 <PID>
```

## 📊 Performance Optimizasyonu

### 1. PM2 Cluster Mode
```javascript
// ecosystem.config.js
{
  instances: 'max',  // CPU core sayısı kadar instance
  exec_mode: 'cluster'
}
```

### 2. Nginx Caching
```nginx
# Static dosyalar için cache
location /_next/static/ {
    proxy_pass http://localhost:3001;
    add_header Cache-Control "public, max-age=31536000, immutable";
}
```

### 3. Gzip Compression
```nginx
gzip on;
gzip_vary on;
gzip_min_length 1024;
gzip_types text/plain text/css text/xml text/javascript application/javascript;
```

## 🔒 Güvenlik

### 1. Environment Değişkenleri
- `.env.production` dosyasını git'e eklemeyin
- Sertifika dosyalarını güvenli tutun
- NEXTAUTH_SECRET'ı güçlü yapın

### 2. Firewall
- Sadece gerekli portları açın
- SSH için key-based authentication kullanın

### 3. SSL/TLS
- Let's Encrypt ile otomatik sertifika yenileme
- HSTS header'ları ekleyin

## 📈 Monitoring

### 1. PM2 Monitoring
```bash
# Real-time monitoring
pm2 monit

# Web dashboard (opsiyonel)
pm2 install pm2-server-monit
```

### 2. Log Rotation
```bash
# PM2 log rotation
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 30
```

Bu rehberi takip ederek projenizi production'a başarıyla deploy edebilirsiniz.
