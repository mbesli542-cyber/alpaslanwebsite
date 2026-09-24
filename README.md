# PARLA Herrenmode: Website

Mannheim F1 8'deki PARLA Herrenmode için tek sayfalık, iki dilli (Almanca / Türkçe) web sitesi. Tasarım fikri **Anprobe (prova kabini)**: koyu yeşil kadife perde, pirinç ray ve halkalar, fotoğrafları taşıyan üçlü ayna.

## Yapı

```
index.html          Ana sayfa (Almanca metin HTML'de, Türkçe metin assets/js/site.js içinde)
impressum.html      Impressum şablonu (köşeli parantezli alanlar doldurulmalı)
datenschutz.html    Gizlilik şablonu (köşeli parantezli alanlar doldurulmalı)
assets/css/site.css Tüm stiller
assets/js/site.js   Dil geçişi, perde animasyonu, ayna parıltısı, mobil menü
assets/fonts/       Imbue ve Archivo (lokal, Google'a bağlantı yok: GDPR uyumlu)
assets/img/         Favicon ve kumaş dokusu (tools/make-twill.py ile üretildi)
images/             Mağaza fotoğrafları buraya (bkz. images/README.md)
```

Derleme adımı yok. Klasörü herhangi bir statik hostinge (GitHub Pages, Netlify, Cloudflare Pages) yüklemek yeterli.

## Yerelde açmak

```bash
npx http-server -p 8080 .
# sonra http://localhost:8080
```

## Yayına almadan önce yapılacaklar

1. **Fotoğraflar:** `images/README.md` içindeki isimlerle JPG dosyalarını ekleyin.
2. **Impressum ve Datenschutz:** Almanya'da zorunlu. `impressum.html` ve `datenschutz.html` içindeki `[...]` alanlarını doldurun (sahip adı, e-posta, varsa vergi no., hosting firması).
3. **Çalışma saatleri:** Şu an Google'a link veriliyor. Saatler netleşince `index.html` içinde "Öffnungszeiten" yorum satırındaki örneği kullanın.
4. **Alan adı:** Domain belli olunca `index.html` `<head>` kısmına `<link rel="canonical" href="https://alanadiniz.de/">` ekleyin ve Google Maps kaydındaki "Website hinzufügen" alanına adresi girin.

## Metinleri değiştirmek

- Almanca metinler doğrudan `index.html` içinde.
- Türkçe metinler `assets/js/site.js` dosyasının başındaki `TR` sözlüğünde. Aynı `data-i18n` anahtarını kullanın.
- Tarayıcı dili Türkçe olan ziyaretçiler siteyi otomatik Türkçe görür. `?lang=tr` ya da `?lang=de` ile de açılabilir.

## Tasarım kaynakları

Bu depo `.claude/skills/` altında kurulu tasarım skill'lerini içerir (emilkowalski/skills, pbakaus/impeccable, Leonxlnx/taste-skill; kilit dosyası `skills-lock.json`). Ürün bilgileri `PRODUCT.md`, görsel sistem `DESIGN.md` içinde.
