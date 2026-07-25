// src/lib/img.ts
// AUTOGENEROWANE — mapa wariantow responsywnych wgranych do s3://meblowe-media.
// Klucz: oryginalny URL. Pole "v" to szerokosci wariantow <nazwa>-<w>w.webp lezacych
// obok oryginalu w tym samym prefiksie. Oryginaly nie byly modyfikowane.
// Regeneracja: patrz raport audytu, sekcja "Warianty obrazow".

type Entry = { w: number; h: number; v: number[] };

const VARIANTS: Record<string, Entry> = {
    "https://media.meblesystem.pl/meble-bydgoszcz.pl/realizacje-legacy/20250611053358-1-2.webp": {
      "w": 1011,
      "h": 939,
      "v": [
        480,
        768
      ]
    },
    "https://media.meblesystem.pl/meble-bydgoszcz.pl/realizacje-legacy/Dorota-projektMIESZKANIE_CIECHOCINEK_1_opt.webp": {
      "w": 1920,
      "h": 1080,
      "v": [
        480,
        768,
        1200,
        1600
      ]
    },
    "https://media.meblesystem.pl/meble-bydgoszcz.pl/realizacje-legacy/Dorota-projektPROJEKT_JASKOLCZA_TORUN_3_opt.webp": {
      "w": 1920,
      "h": 1080,
      "v": [
        480,
        768,
        1200,
        1600
      ]
    },
    "https://media.meblesystem.pl/meble-bydgoszcz.pl/realizacje-legacy/Dorota-projektPROJEKT_JASKOLCZA_TORUN_9_opt.webp": {
      "w": 1920,
      "h": 1080,
      "v": [
        480,
        768,
        1200,
        1600
      ]
    },
    "https://media.meblesystem.pl/meble-bydgoszcz.pl/realizacje-legacy/Dorota-projektPROJEKT_SALON_Z_ANEKSEM_SZABAT_5_opt.webp": {
      "w": 1920,
      "h": 1080,
      "v": [
        480,
        768,
        1200,
        1600
      ]
    },
    "https://media.meblesystem.pl/meble-bydgoszcz.pl/realizacje-legacy/Dorota-projektRESTAURACJA_PANORAMA_10_opt.webp": {
      "w": 1920,
      "h": 1080,
      "v": [
        480,
        768,
        1200,
        1600
      ]
    },
    "https://media.meblesystem.pl/meble-bydgoszcz.pl/realizacje-legacy/Dorota-projektSLIWY_POKOJ_DZIECIECY_14_opt.webp": {
      "w": 1920,
      "h": 1080,
      "v": [
        480,
        768,
        1200,
        1600
      ]
    },
    "https://media.meblesystem.pl/meble-bydgoszcz.pl/realizacje-legacy/Dorota-projektWidok-6_1-2_opt.webp": {
      "w": 1920,
      "h": 1080,
      "v": [
        480,
        768,
        1200,
        1600
      ]
    },
    "https://media.meblesystem.pl/meble-bydgoszcz.pl/realizacje-legacy/IMG_3445_VSCO-1024x1024.webp": {
      "w": 1024,
      "h": 1024,
      "v": [
        480,
        768
      ]
    },
    "https://media.meblesystem.pl/meblesystem.pl/biura/Biuro-Nieruchomosci-18.webp": {
      "w": 978,
      "h": 1467,
      "v": [
        480,
        768
      ]
    },
    "https://media.meblesystem.pl/meblesystem.pl/kuchnie-lakier/k-9.webp": {
      "w": 2000,
      "h": 1333,
      "v": [
        480,
        768,
        1200,
        1600
      ]
    },
    "https://media.meblesystem.pl/meblesystem.pl/kuchnie-plyta-laminowana/k6-7_opt.webp": {
      "w": 1600,
      "h": 1067,
      "v": [
        480,
        768,
        1200
      ]
    },
    "https://media.meblesystem.pl/meblesystem.pl/lazienki-plyta-akryl/lazgozdz-3.webp": {
      "w": 1600,
      "h": 1067,
      "v": [
        480,
        768,
        1200
      ]
    },
    "https://media.meblesystem.pl/meblesystem.pl/pozostale/mebelki-72.webp": {
      "w": 2000,
      "h": 1333,
      "v": [
        480,
        768,
        1200,
        1600
      ]
    },
    "https://media.meblesystem.pl/meblesystem.pl/szafy-plyta-laminowana/gar1-5.webp": {
      "w": 1200,
      "h": 1600,
      "v": [
        480,
        768
      ]
    },
    "https://media.meblesystem.pl/shared/adobe-portfolio/044db97a-3efa-4787-adb0-21e9c2b6a1a3_rw_3840.webp": {
      "w": 2000,
      "h": 1591,
      "v": [
        480,
        768,
        1200,
        1600
      ]
    },
    "https://media.meblesystem.pl/shared/adobe-portfolio/b266f6f9-7066-4fac-a179-e072ffe0b442_rw_1920.webp": {
      "w": 1920,
      "h": 1440,
      "v": [
        480,
        768,
        1200,
        1600
      ]
    },
    "https://media.meblesystem.pl/shared/adobe-portfolio/ece5504d-43cd-4fe5-8ceb-bdaf94ffcea3_rw_1920.webp": {
      "w": 1920,
      "h": 1440,
      "v": [
        480,
        768,
        1200,
        1600
      ]
    }
  };

/** srcset zlozony z wariantow + oryginal jako najszerszy kandydat. */
export function srcset(url: string): string | undefined {
  const e = VARIANTS[url];
  if (!e || e.v.length === 0) return undefined;
  const base = url.replace(/\.webp$/i, '');
  const parts = e.v.map((w) => `${base}-${w}w.webp ${w}w`);
  parts.push(`${url} ${e.w}w`);
  return parts.join(', ');
}

/** Wymiary oryginalu — do atrybutow width/height (rezerwacja miejsca, zero CLS). */
export function dims(url: string): { width: number; height: number } | undefined {
  const e = VARIANTS[url];
  return e ? { width: e.w, height: e.h } : undefined;
}

/** Najwezszy dostepny wariant — do preloadu i do <img src> jako bezpieczny fallback. */
export function smallest(url: string, min = 768): string {
  const e = VARIANTS[url];
  if (!e || e.v.length === 0) return url;
  const w = e.v.find((x) => x >= min) ?? e.v[e.v.length - 1];
  return `${url.replace(/\.webp$/i, '')}-${w}w.webp`;
}
