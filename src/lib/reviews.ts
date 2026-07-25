// src/lib/reviews.ts
// Jedno źródło opinii Google dla całego builda. Pobiera raz i cache'uje w module,
// dzięki czemu <SEO> (aggregateRating w JSON-LD) i <Testimonials> (karty opinii)
// korzystają z tych samych danych i nie mogą się rozjechać.
//
// Bez PUBLIC_REVIEWS_API_ENDPOINT zwraca pusty wynik — NIGDY danych zastępczych.
// Publikowanie zmyślonych opinii i ocen bez pokrycia to zakazana praktyka rynkowa
// (dyrektywa Omnibus), a dla Google — naruszenie wytycznych dla danych strukturalnych.

export interface GoogleReview {
  id: string;
  author: string;
  verified: boolean;
  text: string;
  rating: number;
  date: string;
}

export interface ReviewsData {
  reviews: GoogleReview[];
  rating: number | null;
  totalReviews: number | null;
}

const EMPTY: ReviewsData = { reviews: [], rating: null, totalReviews: null };

let cached: Promise<ReviewsData> | null = null;

async function load(): Promise<ReviewsData> {
  const endpoint = import.meta.env.PUBLIC_REVIEWS_API_ENDPOINT;

  if (!endpoint) {
    console.warn(
      '[reviews] Brak PUBLIC_REVIEWS_API_ENDPOINT — sekcja opinii i aggregateRating zostaną pominięte. ' +
        'W CI ustaw zmienną w kroku `npm run build` (.github/workflows/deploy.yml).'
    );
    return EMPTY;
  }

  try {
    const response = await fetch(endpoint);
    if (!response.ok) {
      console.error(`[reviews] API zwróciło ${response.status} — pomijam opinie.`);
      return EMPTY;
    }

    const data = await response.json();
    const reviews: GoogleReview[] = Array.isArray(data?.reviews)
      ? data.reviews
      : [];

    if (reviews.length === 0) return EMPTY;

    return {
      reviews,
      rating: typeof data.rating === 'number' ? data.rating : null,
      totalReviews:
        typeof data.totalReviews === 'number' ? data.totalReviews : null,
    };
  } catch (error) {
    console.error('[reviews] Nie udało się pobrać opinii Google:', error);
    return EMPTY;
  }
}

export function getReviews(): Promise<ReviewsData> {
  if (!cached) cached = load();
  return cached;
}
