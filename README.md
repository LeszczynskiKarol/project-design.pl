# Project Design - Strona Internetowa

Profesjonalna strona internetowa dla studia projektowania wnętrz **Project Design** w Toruniu. Zbudowana w Astro z optymalizacją SEO i pełną responsywnością.

## 🚀 Technologie

- **Astro** - Statyczny generator stron
- **Tailwind CSS** - Framework CSS
- **Vanilla JavaScript** - Interaktywność
- **SEO** - Pełna optymalizacja pod kątem wyszukiwarek

## 📁 Struktura projektu

```
project-design-torun/
├── public/              # Pliki statyczne (favicons, obrazy)
├── src/
│   ├── components/      # Komponenty reużywalne
│   │   ├── Navigation.astro
│   │   ├── Footer.astro
│   │   ├── Hero.astro
│   │   ├── Services.astro
│   │   ├── Portfolio.astro
│   │   ├── Process.astro
│   │   ├── Team.astro
│   │   ├── Testimonials.astro
│   │   ├── CTA.astro
│   │   ├── Contact.astro
│   │   └── SEO.astro
│   ├── layouts/
│   │   └── BaseLayout.astro
│   └── pages/
│       ├── index.astro
│       ├── arazacje-wnetrz.astro
│       ├── studio-projektowania-wnetrz.astro
│       ├── projektowanie-mebli.astro
│       └── architekci-wnetrz.astro
├── astro.config.mjs
├── tailwind.config.mjs
├── package.json
└── README.md
```

## 🛠️ Instalacja

1. **Klonowanie repozytorium**

```bash
git clone [URL_REPOZYTORIUM]
cd project-design-torun
```

2. **Instalacja zależności**

```bash
npm install
```

3. **Uruchomienie środowiska deweloperskiego**

```bash
npm run dev
```

Strona będzie dostępna pod adresem `http://localhost:4321`

## 🏗️ Build produkcyjny

```bash
npm run build
```

Pliki produkcyjne znajdą się w folderze `dist/`

## 🚀 Deploy na AWS S3 + CloudFront

### Krok 1: Przygotowanie AWS S3

1. **Utwórz bucket S3**

```bash
aws s3 mb s3://projectdesign-pl
```

2. **Włącz hosting statycznych stron**

```bash
aws s3 website s3://projectdesign-pl \
  --index-document index.html \
  --error-document 404.html
```

3. **Ustaw politykę bucket (public read)**
   Utwórz plik `bucket-policy.json`:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::projectdesign-pl/*"
    }
  ]
}
```

Zastosuj politykę:

```bash
aws s3api put-bucket-policy \
  --bucket projectdesign-pl \
  --policy file://bucket-policy.json
```

### Krok 2: Upload plików

```bash
# Build projektu
npm run build

# Upload do S3
aws s3 sync dist/ s3://projectdesign-pl \
  --delete \
  --cache-control max-age=31536000,public \
  --exclude "*.html" \
  --exclude "*.xml"

# Upload HTML z krótkim cache
aws s3 sync dist/ s3://projectdesign-pl \
  --delete \
  --cache-control max-age=300,public \
  --exclude "*" \
  --include "*.html" \
  --include "*.xml"
```

### Krok 3: Konfiguracja CloudFront

1. **Utwórz dystrybucję CloudFront**

```bash
aws cloudfront create-distribution \
  --distribution-config file://cloudfront-config.json
```

Przykładowy `cloudfront-config.json`:

```json
{
  "CallerReference": "projectdesign-2024",
  "Comment": "Project Design Toruń",
  "DefaultRootObject": "index.html",
  "Origins": {
    "Quantity": 1,
    "Items": [
      {
        "Id": "S3-projectdesign-pl",
        "DomainName": "projectdesign-pl.s3-website.eu-central-1.amazonaws.com",
        "S3OriginConfig": {
          "OriginAccessIdentity": ""
        }
      }
    ]
  },
  "DefaultCacheBehavior": {
    "TargetOriginId": "S3-projectdesign-pl",
    "ViewerProtocolPolicy": "redirect-to-https",
    "Compress": true,
    "MinTTL": 0,
    "DefaultTTL": 86400,
    "MaxTTL": 31536000
  },
  "CustomErrorResponses": {
    "Quantity": 2,
    "Items": [
      {
        "ErrorCode": 404,
        "ResponsePagePath": "/404.html",
        "ResponseCode": 404,
        "ErrorCachingMinTTL": 300
      },
      {
        "ErrorCode": 403,
        "ResponsePagePath": "/index.html",
        "ResponseCode": 200,
        "ErrorCachingMinTTL": 0
      }
    ]
  },
  "PriceClass": "PriceClass_100",
  "Enabled": true
}
```

### Krok 4: Skrypt automatycznego deploymentu

Utwórz plik `deploy.sh`:

```bash
#!/bin/bash

# Build
echo "Building project..."
npm run build

# Upload to S3
echo "Uploading to S3..."
aws s3 sync dist/ s3://projectdesign-pl \
  --delete \
  --cache-control max-age=31536000,public \
  --exclude "*.html" \
  --exclude "*.xml"

aws s3 sync dist/ s3://projectdesign-pl \
  --delete \
  --cache-control max-age=300,public \
  --exclude "*" \
  --include "*.html" \
  --include "*.xml"

# Invalidate CloudFront cache
echo "Invalidating CloudFront cache..."
aws cloudfront create-invalidation \
  --distribution-id YOUR_DISTRIBUTION_ID \
  --paths "/*"

echo "Deployment complete!"
```

Nadaj uprawnienia i uruchom:

```bash
chmod +x deploy.sh
./deploy.sh
```

## 🎨 Dodawanie obrazów

Zamień placeholdery `/api/placeholder/` na rzeczywiste obrazy:

1. Dodaj obrazy do folderu `public/images/`
2. Zoptymalizuj obrazy (WebP format zalecany)
3. Zamień ścieżki w komponentach

Przykład:

```astro
<!-- Zamiast -->
<img src="/api/placeholder/600/400" alt="..." />

<!-- Użyj -->
<img src="/images/portfolio/projekt-1.webp" alt="..." />
```

## 🔍 SEO Checklist

- [x] Meta tagi dla każdej strony
- [x] Open Graph tagi
- [x] Strukturowane dane (Schema.org)
- [x] Sitemap (generowany automatycznie)
- [x] Robots.txt (dodaj do `public/`)
- [x] Canonical URLs
- [ ] Google Analytics (dodaj tracking code)
- [ ] Google Search Console weryfikacja

## 📝 Do zrobienia

1. **Obrazy**: Zamień wszystkie placeholdery na rzeczywiste zdjęcia
2. **Dane kontaktowe**: Zaktualizuj prawdziwe dane firmy
3. **Google Maps**: Dodaj mapę w sekcji kontakt
4. **Formularze**: Podłącz formularz kontaktowy do backendu
5. **SSL**: Skonfiguruj certyfikat SSL w CloudFront
6. **Domena**: Podłącz własną domenę

## 🔧 Komendy

- `npm run dev` - Uruchom serwer deweloperski
- `npm run build` - Zbuduj produkcyjną wersję
- `npm run preview` - Podgląd wersji produkcyjnej
- `./deploy.sh` - Deploy na AWS

## 📱 Responsywność

Strona jest w pełni responsywna i zoptymalizowana dla:

- Mobile: 320px - 768px
- Tablet: 768px - 1024px
- Desktop: 1024px+

## ⚡ Wydajność

- Statyczne pliki HTML
- Zoptymalizowany CSS (Tailwind)
- Lazy loading obrazów
- Minifikacja kodu
- CDN przez CloudFront
- Kompresja gzip

## 📞 Wsparcie

W razie pytań lub problemów:

- Email: kontakt@projectdesign.pl
- Tel: +48 123 456 789

---

**Project Design** © 2024 - Wszystkie prawa zastrzeżone
