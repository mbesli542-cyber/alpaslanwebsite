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

## Shop kurulumu (Vercel + Stripe)

Shop, sepet, Stripe ödemesi ve yönetim paneli (`/admin.html`) bu depoda hazır. Çalışması için Vercel'de bir kez şu ayarlar yapılmalı:

### 1. Fotoğraf deposu (Vercel Blob)
Vercel → projeniz → **Storage** → **Create Database** → **Blob** → erişim olarak **Public** seçin → projeye bağlayın. Vercel `BLOB_STORE_ID` (ya da eski projelerde `BLOB_READ_WRITE_TOKEN`) değişkenini otomatik ekler.

### 2. Veritabanı (Upstash Redis, ücretsiz plan yeterli)
Vercel → projeniz → **Storage** → **Marketplace** → **Upstash for Redis** → projeye bağlayın. `KV_REST_API_URL` ve `KV_REST_API_TOKEN` otomatik eklenir.

### 3. Yönetim paneli şifresi
Vercel → **Settings → Environment Variables**:

| Değişken | Değer |
| --- | --- |
| `ADMIN_PASSWORD` | Panel şifreniz (uzun ve tahmin edilemez olsun) |
| `SESSION_SECRET` | En az 32 karakterlik rastgele bir metin |

### 4. Stripe
1. stripe.com'da hesap açın, işletme ve banka bilgilerini girin.
2. **Developers → API keys** → *Secret key* → Vercel'e `STRIPE_SECRET_KEY` olarak ekleyin. Önce `sk_test_...` (test) anahtarıyla deneyin.
3. **Developers → Webhooks → Add endpoint**
   - URL: `https://SİTENİZ/api/stripe-webhook`
   - Olaylar: `checkout.session.completed` ve `checkout.session.async_payment_succeeded`
   - *Signing secret* → Vercel'e `STRIPE_WEBHOOK_SECRET` olarak ekleyin.
4. **Settings → Payment methods**: PayPal, Klarna, Apple Pay, Google Pay gibi yöntemleri açın.
5. İsteğe bağlı: **Settings → Public details** altında AGB linkinizi (`https://SİTENİZ/agb.html`) girip Vercel'e `STRIPE_REQUIRE_TERMS=1` ekleyin. Müşteri ödemeden önce AGB'yi onaylar.
6. İsteğe bağlı: `SITE_URL=https://alanadiniz.de`

Değişkenleri ekledikten sonra Vercel'de **Redeploy** yapın.

### 5. Test
- Test kartı: `4242 4242 4242 4242`, gelecekte bir tarih, herhangi bir CVC.
- Ödemeden sonra sipariş panelde **Siparişler** sekmesinde görünür ve stok otomatik düşer.
- Panelde **Ayarlar** sekmesindeki "Kurulum durumu" hangi adımın eksik olduğunu gösterir.

### 6. Canlıya geçiş
Stripe'ta *live* moda geçin, `sk_live_...` anahtarını ve live webhook'un yeni signing secret'ını Vercel'e girin, Redeploy yapın. AGB, Widerruf ve Versand sayfalarındaki `[...]` alanlarını doldurup bir hukuk danışmanına kontrol ettirin.

### Yerelde deneme
```bash
npm install
ADMIN_PASSWORD=test1234 SESSION_SECRET=yerel-deneme-anahtari-123456 DEV_FAKE_STRIPE=1 npm run dev
# http://localhost:3000/shop.html  ve  http://localhost:3000/admin.html
```
Yerelde veriler `.data/` klasörüne kaydedilir, ödeme adımı taklit edilir.
