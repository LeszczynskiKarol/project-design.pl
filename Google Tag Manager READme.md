# Konfiguracja Google Tag Manager dla Consent Mode

## 1. Wejdź do Google Tag Manager (GTM-MK2JNT26)

## 2. Utwórz zmienne dla consent mode

### Zmienna: Consent - Analytics Storage

1. Przejdź do **Zmienne** → **Nowa**
2. Nazwa: `Consent - Analytics Storage`
3. Typ: **Zmienna warstwy danych**
4. Nazwa zmiennej warstwy danych: `consent.analytics_storage`
5. Zapisz

### Zmienna: Consent - Ad Storage

1. Przejdź do **Zmienne** → **Nowa**
2. Nazwa: `Consent - Ad Storage`
3. Typ: **Zmienna warstwy danych**
4. Nazwa zmiennej warstwy danych: `consent.ad_storage`
5. Zapisz

### Zmienna: Consent - Ad User Data

1. Przejdź do **Zmienne** → **Nowa**
2. Nazwa: `Consent - Ad User Data`
3. Typ: **Zmienna warstwy danych**
4. Nazwa zmiennej warstwy danych: `consent.ad_user_data`
5. Zapisz

### Zmienna: Consent - Ad Personalization

1. Przejdź do **Zmienne** → **Nowa**
2. Nazwa: `Consent - Ad Personalization`
3. Typ: **Zmienna warstwy danych**
4. Nazwa zmiennej warstwy danych: `consent.ad_personalization`
5. Zapisz

## 3. Utwórz wyzwalacze

### Wyzwalacz: Consent Update

1. Przejdź do **Wyzwalacze** → **Nowy**
2. Nazwa: `Consent Update`
3. Typ: **Zdarzenie niestandardowe**
4. Nazwa zdarzenia: `consent_update`
5. Zapisz

### Wyzwalacz: Consent Default

1. Przejdź do **Wyzwalacze** → **Nowy**
2. Nazwa: `Consent Default`
3. Typ: **Zdarzenie niestandardowe**
4. Nazwa zdarzenia: `consent_default`
5. Zapisz

### Wyzwalacz: All Pages - Analytics Consent

1. Przejdź do **Wyzwalacze** → **Nowy**
2. Nazwa: `All Pages - Analytics Consent`
3. Typ: **Wyświetlenie strony**
4. Ten wyzwalacz jest aktywowany na: **Niektóre wyświetlenia strony**
5. Warunek: `{{Consent - Analytics Storage}}` równa się `granted`
6. Zapisz

### Wyzwalacz: All Pages - Ads Consent

1. Przejdź do **Wyzwalacze** → **Nowy**
2. Nazwa: `All Pages - Ads Consent`
3. Typ: **Wyświetlenie strony**
4. Ten wyzwalacz jest aktywowany na: **Niektóre wyświetlenia strony**
5. Warunek: `{{Consent - Ad Storage}}` równa się `granted`
6. Zapisz

## 4. Konfiguracja tagów Google Analytics 4

### Tag: GA4 - Configuration

1. Przejdź do **Tagi** → **Nowy**
2. Nazwa: `GA4 - Configuration`
3. Typ tagu: **Google Analytics: Konfiguracja GA4**
4. ID pomiaru: `G-XXXXXXXXX` (Twój ID GA4)
5. **Ustawienia zaawansowane:**
   - Rozwiń **Ustawienia zgody**
   - Zaznacz: **Nie są wymagane dodatkowe zgody**
   - LUB jeśli chcesz wymuszać: Ustaw **Wymagane zgody** na `analytics_storage`
6. Wyzwalacz: `All Pages - Analytics Consent`
7. Zapisz

### Tag: GA4 - Page View

1. Przejdź do **Tagi** → **Nowy**
2. Nazwa: `GA4 - Page View`
3. Typ tagu: **Google Analytics: Zdarzenie GA4**
4. Tag konfiguracji: `{{GA4 - Configuration}}`
5. Nazwa zdarzenia: `page_view`
6. **Parametry zdarzenia:**
   - `page_location`: `{{Page URL}}`
   - `page_title`: `{{Page Title}}`
7. Wyzwalacz: `All Pages - Analytics Consent`
8. Zapisz

## 5. Konfiguracja tagów Google Ads

### Tag: Google Ads - Conversion Linker

1. Przejdź do **Tagi** → **Nowy**
2. Nazwa: `Google Ads - Conversion Linker`
3. Typ tagu: **Linker konwersji**
4. **Ustawienia zaawansowane:**
   - Rozwiń **Ustawienia zgody**
   - Ustaw **Wymagane zgody** na:
     - `ad_storage`
     - `ad_user_data`
     - `ad_personalization`
5. Wyzwalacz: `All Pages - Ads Consent`
6. Zapisz

### Tag: Google Ads - Remarketing

1. Przejdź do **Tagi** → **Nowy**
2. Nazwa: `Google Ads - Remarketing`
3. Typ tagu: **Google Ads Remarketing**
4. ID konwersji: `AW-XXXXXXXXX` (Twój ID Google Ads)
5. **Ustawienia zaawansowane:**
   - Rozwiń **Ustawienia zgody**
   - Ustaw **Wymagane zgody** na:
     - `ad_storage`
     - `ad_personalization`
6. Wyzwalacz: `All Pages - Ads Consent`
7. Zapisz

## 6. Tag monitorujący consent mode

### Tag: Consent Mode Monitor

1. Przejdź do **Tagi** → **Nowy**
2. Nazwa: `Consent Mode Monitor`
3. Typ tagu: **Własny HTML**
4. Kod HTML:

```html
<script>
  // Monitorowanie stanu consent mode
  console.log('[GTM] Consent State:', {
    analytics_storage: {{Consent - Analytics Storage}},
    ad_storage: {{Consent - Ad Storage}},
    ad_user_data: {{Consent - Ad User Data}},
    ad_personalization: {{Consent - Ad Personalization}}
  });

  // Wysłanie eventu do GA4 o statusie zgód
  if (typeof gtag !== 'undefined') {
    gtag('event', 'consent_status', {
      'analytics_consent': {{Consent - Analytics Storage}} || 'not_set',
      'ads_consent': {{Consent - Ad Storage}} || 'not_set',
      'user_data_consent': {{Consent - Ad User Data}} || 'not_set',
      'personalization_consent': {{Consent - Ad Personalization}} || 'not_set'
    });
  }
</script>
```

5. Wyzwalacze:
   - `Consent Default`
   - `Consent Update`
6. Zapisz

## 7. Testowanie w trybie Preview

1. Kliknij **Preview** w GTM
2. Wprowadź URL swojej strony
3. Sprawdź w debuggerze:
   - Czy consent mode jest ustawiony przed innymi tagami
   - Czy tagi są wstrzymane gdy brak zgody
   - Czy tagi się uruchamiają po udzieleniu zgody
4. Sprawdź w konsoli przeglądarki:
   - `dataLayer` zawiera eventy consent
   - Brak błędów JavaScript

## 8. Publikacja zmian

1. Po przetestowaniu kliknij **Prześlij**
2. Dodaj nazwę wersji: np. "Implementacja Consent Mode v2"
3. Kliknij **Publikuj**

## 9. Weryfikacja w Google Analytics 4

1. Przejdź do **GA4** → **Administrator** → **Sygnały zgody**
2. Sprawdź czy widać:
   - Status implementacji consent mode
   - Modelowanie danych dla brakujących zgód
   - Raport o wpływie zgód

## 10. Weryfikacja w Google Ads

1. Przejdź do **Google Ads** → **Narzędzia** → **Conversions**
2. Sprawdź status consent mode
3. Upewnij się, że konwersje są modelowane

## Ważne uwagi:

- **RODO/GDPR**: Domyślnie wszystkie zgody są ustawione na `denied` dla UE
- **Modelowanie**: Google modeluje dane gdy brak zgód (wymaga min. 1000 użytkowników/dzień)
- **Czas oczekiwania**: `wait_for_update: 3000` daje 3 sekundy na załadowanie preferencji
- **Region**: Możesz ustawić różne domyślne zgody dla różnych regionów

## Wsparcie:

W razie problemów sprawdź:

- [Tag Assistant](https://tagassistant.google.com/)
- [GTM Preview Mode](https://tagmanager.google.com/)
- Konsola JavaScript (F12)
- [Google Consent Mode Documentation](https://developers.google.com/tag-platform/security/concepts/consent-mode)
