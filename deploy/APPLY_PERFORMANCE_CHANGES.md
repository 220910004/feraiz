# Feraiz performans paketi uygulama adimlari

## 1) Sunucuda proje klasorune gir
cd /var/www/feraiz

## 2) Yeni paket dosyalarini yukle
Yereldeki zip'i sunucuya gonder:
scp feraiz-performans-paketi.zip root@SUNUCU_IP:/root/

## 3) Paketi ac
cd /root
unzip -o feraiz-performans-paketi.zip -d /var/www/feraiz

## 4) Bagimliliklari kur
cd /var/www/feraiz
npm install

## 5) Sunucu icin optimize build al
npm run build:server

## 6) Nginx ayarini guncelle
cp deploy/nginx/feraiz.org.conf /etc/nginx/sites-available/feraiz
ln -sf /etc/nginx/sites-available/feraiz /etc/nginx/sites-enabled/feraiz
nginx -t
systemctl reload nginx

## 7) Kontrol et
- https://feraiz.org acilmali
- Kaynaklar, Bilgi ve 40 Hal sekmeleri ilk acilista degil, gerektiginde yuklenecek
- Google Fonts istegi artik yapilmamali
