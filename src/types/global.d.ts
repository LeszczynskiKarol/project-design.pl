// src/types/global.d.ts
// Deklaracje typów dla consent mode i GTM

declare global {
  interface Window {
    dataLayer: any[];
    gtag?: (...args: any[]) => void;
    consentManager?: {
      init: () => void;
      showConsentBanner: () => void;
      hideConsentBanner: () => void;
      showConsentModal: () => void;
      hideConsentModal: () => void;
      handleAcceptAll: () => void;
      handleRejectAll: () => void;
      handleAcceptNecessary: () => void;
      handleSavePreferences: () => void;
      resetConsent: () => void;
      getConsentState: () => any;
      isConsentGranted: (type: string) => boolean;
    };
    resetConsent?: () => void;
  }
}

// Rozszerzenie typu HTMLScriptElement
interface HTMLScriptElement {
  async: boolean;
  src: string;
}

export {};
