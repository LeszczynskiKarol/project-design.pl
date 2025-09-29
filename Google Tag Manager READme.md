# 🎯 TWOJA KONFIGURACJA GTM + GA4 (G-VEV40YS20G)

## ✅ Szybka instalacja w 3 krokach

### Krok 1: Dodaj Tag Google w GTM

1. Zaloguj się do GTM: [https://tagmanager.google.com](https://tagmanager.google.com)
2. Wybierz kontener: **GTM-MK2JNT26**
3. Przejdź do **Tagi** → **Nowy**
4. **Konfiguracja:**
   ```
   Nazwa tagu: Tag Google - GA4 Project Design
   Typ tagu: Tag Google
   Tag ID: G-VEV40YS20G
   ```
5. **Wyzwalacz:** Wszystkie strony
6. **Zapisz**

### Krok 2: (Opcjonalnie) Dodaj zdarzenie Page View

1. **Tagi** → **Nowy**
2. **Konfiguracja:**
   ```
   Nazwa: GA4 - Page View
   Typ: Google Analytics: zdarzenie GA4
   Measurement ID: G-VEV40YS20G
   Event Name: page_view
   ```
3. **Parametry zdarzenia** (kliknij "Dodaj parametr"):
   - Nazwa: `page_location` → Wartość: `{{Page URL}}`
   - Nazwa: `page_title` → Wartość: `{{Page Title}}`
4. **Wyzwalacz:** Wszystkie strony
5. **Zapisz**

### Krok 3: Testuj i publikuj

1. Kliknij **Preview** w GTM
2. Wpisz adres: `https://project-design.pl`
3. Sprawdź czy tag się uruchamia
4. Jeśli działa → **Prześlij** → **Publikuj**

---

## 🔍 Weryfikacja w GA4

### Sprawdź czy dane przychodzą:

1. Otwórz GA4: [https://analytics.google.com](https://analytics.google.com)
2. Przejdź do **Raporty** → **Czas rzeczywisty**
3. Otwórz swoją stronę w nowej karcie
4. Powinieneś zobaczyć siebie jako aktywnego użytkownika

### Sprawdź consent mode:

1. W GA4: **Administrator** → **Wyświetlanie danych** → **Sygnały zgody**
2. Powinno pokazywać: "Tryb zgody jest aktywny"

---

## ⚠️ WAŻNE - Consent Mode

Twoja konfiguracja consent mode AUTOMATYCZNIE będzie działać z tym tagiem:

- ✅ Tag Google (G-VEV40YS20G) sam sprawdza zgody
- ✅ Ładuje się tylko gdy `analytics_storage = granted`
- ✅ Modeluje dane gdy brak zgody
- ✅ Zgodne z RODO

---

## 🎯 Kod do BaseLayout.astro (ZAKTUALIZOWANY)

Upewnij się że w `BaseLayout.astro` masz:

```html
<!-- Consent Mode - MUSI BYĆ PIERWSZE -->
<script is:inline>
  window.dataLayer = window.dataLayer || [];

  // Domyślne zgody (przed GTM!)
  window.dataLayer.push({
    event: "consent_default",
    consent: {
      ad_storage: "denied",
      analytics_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
      functionality_storage: "granted",
      personalization_storage: "denied",
      security_storage: "granted",
      wait_for_update: 3000,
    },
  });
</script>

<!-- Google Tag Manager -->
<script is:inline>
  (function (w, d, s, l, i) {
    w[l] = w[l] || [];
    w[l].push({ "gtm.start": new Date().getTime(), event: "gtm.js" });
    var f = d.getElementsByTagName(s)[0];
    var j = d.createElement(s);
    var dl = l != "dataLayer" ? "&l=" + l : "";
    j.async = true;
    j.src = "https://www.googletagmanager.com/gtm.js?id=" + i + dl;
    if (f && f.parentNode) {
      f.parentNode.insertBefore(j, f);
    }
  })(window, document, "script", "dataLayer", "GTM-MK2JNT26");
</script>
```

---

## 📊 Test końcowy

### W konsoli przeglądarki (F12):

```javascript
// 1. Reset zgód (pokaże banner)
localStorage.removeItem("project_design_consent");
location.reload();

// 2. Po zaakceptowaniu zgód sprawdź:
// Czy GA jest załadowane?
typeof gtag !== "undefined"; // → true

// Czy są eventy consent?
dataLayer.filter((e) => e.event === "consent_update");

// Czy tag się załadował?
dataLayer.filter((e) => e["gtm.uniqueEventId"]);
```

### W GA4 Real-time:

1. Odrzuć zgody → NIE powinno być widać użytkownika
2. Zaakceptuj zgody → Powinien pojawić się użytkownik
3. Sprawdź zdarzenia → Powinno być `page_view`

---

## ✅ Checklist końcowy

- [ ] Tag Google dodany w GTM z ID: **G-VEV40YS20G**
- [ ] Wyzwalacz ustawiony na "Wszystkie strony"
- [ ] Zmiany opublikowane w GTM
- [ ] Banner consent się pokazuje na stronie
- [ ] Po akceptacji zgód dane pojawiają się w GA4
- [ ] Consent mode pokazuje się jako aktywny w GA4

---

## 🚨 Częste błędy do uniknięcia

❌ **NIE dodawaj** kodu gtag.js bezpośrednio do HTML gdy masz GTM  
❌ **NIE duplikuj** tagów Google (tylko jeden Tag Google!)  
❌ **NIE używaj** starego tagu "Konfiguracja GA4" - używaj "Tag Google"  
❌ **NIE zapomnij** opublikować zmian w GTM

---

## 🎉 Gotowe!

Gdy wszystko skonfigurujesz według powyższej instrukcji, będziesz mieć:

- ✅ Google Analytics 4 działające przez GTM
- ✅ Consent mode w pełni skonfigurowany
- ✅ Zgodność z RODO
- ✅ Modelowanie danych dla użytkowników bez zgody

**Twój ID GA4:** `G-VEV40YS20G`  
**Twój GTM:** `GTM-MK2JNT26`
