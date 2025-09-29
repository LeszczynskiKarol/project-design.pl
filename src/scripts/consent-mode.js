// src/scripts/consent-mode.js

// Konfiguracja consent mode
const CONSENT_CONFIG = {
  // Nazwa klucza w localStorage
  storageKey: "project_design_consent",

  // Czas ważności zgody (365 dni)
  consentDuration: 365 * 24 * 60 * 60 * 1000,

  // Domyślne ustawienia dla Polski/UE (RODO)
  defaultConsent: {
    ad_storage: "denied",
    analytics_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
    functionality_storage: "granted",
    personalization_storage: "denied",
    security_storage: "granted",
  },

  // Ustawienia regionalne
  regions: {
    PL: {
      ad_storage: "denied",
      analytics_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
    },
    EU: {
      ad_storage: "denied",
      analytics_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
    },
  },

  // Czas na załadowanie bannera
  waitForUpdate: 3000,
};

// Klasa zarządzająca consent mode
class ConsentManager {
  constructor() {
    this.consentState = null;
    this.banner = null;
    this.modal = null;
    this.initialized = false;
  }

  // Inicjalizacja consent mode
  init() {
    if (this.initialized) return;

    // Ustawienie domyślnych zgód PRZED załadowaniem GTM
    this.setDefaultConsent();

    // Sprawdzenie zapisanych preferencji
    this.loadSavedConsent();

    // Jeśli brak zapisanych preferencji, pokaż banner
    if (!this.consentState) {
      this.showConsentBanner();
    }

    // Inicjalizacja event listeners
    this.setupEventListeners();

    this.initialized = true;
  }

  // Ustawienie domyślnych zgód dla Google Tag Manager
  setDefaultConsent() {
    // Push do dataLayer przed GTM
    window.dataLayer = window.dataLayer || [];

    // Ustawienie domyślnych zgód
    window.dataLayer.push({
      event: "consent_default",
      consent: {
        ...CONSENT_CONFIG.defaultConsent,
      },
    });

    // Dla gtag (jeśli używany bezpośrednio)
    if (typeof gtag !== "undefined") {
      gtag("consent", "default", {
        ad_storage: CONSENT_CONFIG.defaultConsent.ad_storage,
        analytics_storage: CONSENT_CONFIG.defaultConsent.analytics_storage,
        ad_user_data: CONSENT_CONFIG.defaultConsent.ad_user_data,
        ad_personalization: CONSENT_CONFIG.defaultConsent.ad_personalization,
        wait_for_update: CONSENT_CONFIG.waitForUpdate,
      });
    }

    console.log(
      "[Consent Mode] Domyślne zgody ustawione:",
      CONSENT_CONFIG.defaultConsent
    );
  }

  // Wczytanie zapisanych preferencji
  loadSavedConsent() {
    try {
      const saved = localStorage.getItem(CONSENT_CONFIG.storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);

        // Sprawdzenie czy zgoda nie wygasła
        if (
          parsed.timestamp &&
          Date.now() - parsed.timestamp < CONSENT_CONFIG.consentDuration
        ) {
          this.consentState = parsed.consent;
          this.updateConsent(this.consentState);
          console.log(
            "[Consent Mode] Wczytano zapisane preferencje:",
            this.consentState
          );
        } else {
          // Zgoda wygasła, usuń z localStorage
          localStorage.removeItem(CONSENT_CONFIG.storageKey);
          console.log("[Consent Mode] Zgoda wygasła, pokazywanie bannera");
        }
      }
    } catch (error) {
      console.error("[Consent Mode] Błąd wczytywania preferencji:", error);
    }
  }

  // Zapisanie preferencji
  saveConsent(consent) {
    try {
      const data = {
        consent: consent,
        timestamp: Date.now(),
      };
      localStorage.setItem(CONSENT_CONFIG.storageKey, JSON.stringify(data));
      this.consentState = consent;
      console.log("[Consent Mode] Preferencje zapisane:", consent);
    } catch (error) {
      console.error("[Consent Mode] Błąd zapisywania preferencji:", error);
    }
  }

  // Aktualizacja zgód w GTM/gtag
  updateConsent(consent) {
    // Aktualizacja przez dataLayer (GTM)
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: "consent_update",
      consent: consent,
    });

    // Aktualizacja przez gtag (jeśli używany)
    if (typeof gtag !== "undefined") {
      gtag("consent", "update", {
        ad_storage: consent.ad_storage || "denied",
        analytics_storage: consent.analytics_storage || "denied",
        ad_user_data: consent.ad_user_data || "denied",
        ad_personalization: consent.ad_personalization || "denied",
      });
    }

    // Trigger custom event dla innych skryptów
    window.dispatchEvent(
      new CustomEvent("consentUpdated", { detail: consent })
    );

    console.log("[Consent Mode] Zgody zaktualizowane:", consent);
  }

  // Pokazanie bannera zgód
  showConsentBanner() {
    this.banner = document.getElementById("consent-banner");
    if (this.banner) {
      setTimeout(() => {
        this.banner.classList.add("show");
        this.banner.setAttribute("aria-hidden", "false");
      }, 500);
    }
  }

  // Ukrycie bannera zgód
  hideConsentBanner() {
    if (this.banner) {
      this.banner.classList.remove("show");
      this.banner.setAttribute("aria-hidden", "true");
    }
  }

  // Pokazanie modala szczegółowych ustawień
  showConsentModal() {
    this.modal = document.getElementById("consent-modal");
    if (this.modal) {
      this.modal.classList.add("show");
      this.modal.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";

      // Ustaw checkboxy na podstawie obecnych zgód
      this.updateModalCheckboxes();
    }
  }

  // Ukrycie modala
  hideConsentModal() {
    if (this.modal) {
      this.modal.classList.remove("show");
      this.modal.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
    }
  }

  // Aktualizacja checkboxów w modalu
  updateModalCheckboxes() {
    const state = this.consentState || CONSENT_CONFIG.defaultConsent;

    // Analytics
    const analyticsCheckbox = document.getElementById("consent-analytics");
    if (analyticsCheckbox) {
      analyticsCheckbox.checked = state.analytics_storage === "granted";
    }

    // Marketing
    const marketingCheckbox = document.getElementById("consent-marketing");
    if (marketingCheckbox) {
      marketingCheckbox.checked = state.ad_storage === "granted";
    }

    // Personalization
    const personalizationCheckbox = document.getElementById(
      "consent-personalization"
    );
    if (personalizationCheckbox) {
      personalizationCheckbox.checked = state.ad_personalization === "granted";
    }
  }

  // Pobranie stanu checkboxów z modala
  getModalConsent() {
    const analyticsCheckbox = document.getElementById("consent-analytics");
    const marketingCheckbox = document.getElementById("consent-marketing");
    const personalizationCheckbox = document.getElementById(
      "consent-personalization"
    );

    return {
      functionality_storage: "granted",
      security_storage: "granted",
      analytics_storage: analyticsCheckbox?.checked ? "granted" : "denied",
      ad_storage: marketingCheckbox?.checked ? "granted" : "denied",
      ad_user_data: marketingCheckbox?.checked ? "granted" : "denied",
      ad_personalization: personalizationCheckbox?.checked
        ? "granted"
        : "denied",
      personalization_storage: personalizationCheckbox?.checked
        ? "granted"
        : "denied",
    };
  }

  // Obsługa akcji użytkownika
  handleAcceptAll() {
    const consent = {
      functionality_storage: "granted",
      security_storage: "granted",
      analytics_storage: "granted",
      ad_storage: "granted",
      ad_user_data: "granted",
      ad_personalization: "granted",
      personalization_storage: "granted",
    };

    this.saveConsent(consent);
    this.updateConsent(consent);
    this.hideConsentBanner();
    this.hideConsentModal();

    // Przeładuj stronę aby zastosować wszystkie tagi
    setTimeout(() => {
      window.location.reload();
    }, 100);
  }

  handleRejectAll() {
    const consent = {
      functionality_storage: "granted",
      security_storage: "granted",
      analytics_storage: "denied",
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
      personalization_storage: "denied",
    };

    this.saveConsent(consent);
    this.updateConsent(consent);
    this.hideConsentBanner();
    this.hideConsentModal();
  }

  handleAcceptNecessary() {
    const consent = {
      functionality_storage: "granted",
      security_storage: "granted",
      analytics_storage: "denied",
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
      personalization_storage: "denied",
    };

    this.saveConsent(consent);
    this.updateConsent(consent);
    this.hideConsentBanner();
    this.hideConsentModal();
  }

  handleSavePreferences() {
    const consent = this.getModalConsent();

    this.saveConsent(consent);
    this.updateConsent(consent);
    this.hideConsentBanner();
    this.hideConsentModal();

    // Jeśli włączono nowe zgody, przeładuj stronę
    const previousState = this.consentState || CONSENT_CONFIG.defaultConsent;
    if (
      (consent.analytics_storage === "granted" &&
        previousState.analytics_storage === "denied") ||
      (consent.ad_storage === "granted" &&
        previousState.ad_storage === "denied")
    ) {
      setTimeout(() => {
        window.location.reload();
      }, 100);
    }
  }

  // Konfiguracja event listeners
  setupEventListeners() {
    // Banner - przyciski
    document
      .getElementById("consent-accept-all")
      ?.addEventListener("click", () => this.handleAcceptAll());
    document
      .getElementById("consent-reject")
      ?.addEventListener("click", () => this.handleRejectAll());
    document
      .getElementById("consent-accept-necessary")
      ?.addEventListener("click", () => this.handleAcceptNecessary());

    // Banner - link do szczegółów
    document
      .getElementById("consent-details-btn")
      ?.addEventListener("click", () => {
        this.showConsentModal();
      });

    // Modal - zamknięcie
    document.getElementById("modal-close")?.addEventListener("click", () => {
      this.hideConsentModal();
    });

    // Modal - overlay
    document.querySelector(".modal-overlay")?.addEventListener("click", () => {
      this.hideConsentModal();
    });

    // Modal - zapisz ustawienia
    document.getElementById("modal-save")?.addEventListener("click", () => {
      this.handleSavePreferences();
    });

    // ESC key
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && this.modal?.classList.contains("show")) {
        this.hideConsentModal();
      }
    });
  }

  // Metoda do resetowania zgód (przydatna do testowania)
  resetConsent() {
    localStorage.removeItem(CONSENT_CONFIG.storageKey);
    this.consentState = null;
    window.location.reload();
  }

  // Metoda do sprawdzenia stanu zgód
  getConsentState() {
    return this.consentState || CONSENT_CONFIG.defaultConsent;
  }

  // Sprawdzenie czy dana zgoda jest przyznana
  isConsentGranted(type) {
    const state = this.getConsentState();
    return state[type] === "granted";
  }
}

// Utworzenie globalnej instancji
window.consentManager = new ConsentManager();

// Inicjalizacja gdy DOM jest gotowy
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    window.consentManager.init();
  });
} else {
  window.consentManager.init();
}

// Export dla modułów ES6
export default ConsentManager;
