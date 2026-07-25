// Źródło danych galerii realizacji — JEDNO miejsce (wcześniej tablica była
// zduplikowana we frontmatterze i w <script> lightboxa/modala Portfolio.astro).
//
// GOTOWOŚĆ POD GLOBALNE PORTFOLIO: schemat { src, alt?, category? } jest zgodny
// z centralnym galleries.json (panel na AWS). Docelowa integracja = podmiana
// zawartości tej tablicy na fetch z https://media.torweb.pl/<domena>/galleries.json
// (albo import wygenerowanego pliku) — komponent Portfolio.astro nie zmienia się.
//
// Pola rozszerzone (id, title, description, location, area, year) obsługują
// modal/podgląd tej strony i są opcjonalne względem bazowego schematu galleries.json.
//
// UWAGA: część URL-i to jeszcze hotlinki (meblesystem.pl/wp-content, cdn.myportfolio.com).
// Zostają 1:1 do czasu migracji obrazów do centralnego bucketa (następny etap).

export interface PortfolioImage {
  src: string;
  alt?: string;
  category?: string;
  id?: number;
  title?: string;
  description?: string;
  location?: string;
  area?: string;
  year?: string;
}

export const portfolio: PortfolioImage[] = [
  {
    id: 1,
    title: 'Pokój dziecięcy',
    category: 'Mieszkanie',
    src: 'https://media.meblesystem.pl/meble-bydgoszcz.pl/realizacje-legacy/Dorota-projektSLIWY_POKOJ_DZIECIECY_14_opt.webp',
    description: 'Praktyczny i zaprojektowany z myślą o najmłodszych pokój dziecięcy',
    location: 'Toruń',
    area: '85 m²',
    year: '2024'
  },
  {
    id: 2,
    title: 'Rosette Residence',
    category: 'Mieszkanie',
    src: 'https://media.meblesystem.pl/shared/adobe-portfolio/b266f6f9-7066-4fac-a179-e072ffe0b442_rw_1920.webp',
    description: 'Nowoczesny apartament w sercu toruńskiej starówki',
    location: 'Toruń',
    area: '33 m²',
    year: '2024'
  },
  {
    id: 3,
    title: 'Restauracja Panorama',
    category: 'Przestrzeń komercyjna',
    src: 'https://media.meblesystem.pl/meble-bydgoszcz.pl/realizacje-legacy/Dorota-projektRESTAURACJA_PANORAMA_10_opt.webp',
    description: 'Przytulne i inspirujące wnętrze Restauracji Panorama',
    location: 'Toruń',
    area: '120 m²',
    year: '2023'
  },
  {
    id: 4,
    title: 'Salon z aneksem',
    category: 'Mieszkanie',
    src: 'https://media.meblesystem.pl/meble-bydgoszcz.pl/realizacje-legacy/Dorota-projektPROJEKT_SALON_Z_ANEKSEM_SZABAT_5_opt.webp',
    description: 'Nowoczesny i funkcjonalny salon z aneksem',
    location: 'Toruń',
    area: '55 m²',
    year: '2024'
  },
  {
    id: 5,
    title: 'Rezydencja Jaskółcza',
    category: 'Dom jednorodzinny',
    src: 'https://media.meblesystem.pl/meble-bydgoszcz.pl/realizacje-legacy/Dorota-projektPROJEKT_JASKOLCZA_TORUN_9_opt.webp',
    description: 'Elegancka willa w spokojnej dzielnicy',
    location: 'Toruń',
    area: '250 m²',
    year: '2023'
  },
  {
    id: 6,
    title: 'Bi mii open space',
    category: 'Przestrzeń komercyjna',
    src: 'https://media.meblesystem.pl/shared/adobe-portfolio/044db97a-3efa-4787-adb0-21e9c2b6a1a3_rw_3840.webp',
    description: 'Nowoczesna przestrzeń biurowa',
    location: 'Toruń',
    area: '180 m²',
    year: '2022'
  }
];
