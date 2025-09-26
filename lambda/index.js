// lambda/index.js - AWS Lambda function z UTF-8
const https = require("https");

exports.handler = async (event) => {
  // Konfiguracja CORS z UTF-8
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Content-Type": "application/json; charset=utf-8",
  };

  // Obsługa preflight OPTIONS
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers,
      body: "",
    };
  }

  const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
  const GOOGLE_PLACE_ID = process.env.GOOGLE_PLACE_ID;

  if (!GOOGLE_API_KEY || !GOOGLE_PLACE_ID) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: "Missing API configuration",
      }),
    };
  }

  try {
    // Pobierz szczegóły miejsca z Google Places API
    const placeDetails = await getPlaceDetails(GOOGLE_PLACE_ID, GOOGLE_API_KEY);

    // Przygotuj dane do zwrócenia
    const response = {
      rating: placeDetails.rating || 0,
      totalReviews: placeDetails.user_ratings_total || 0,
      reviews: formatReviews(placeDetails.reviews || []),
    };

    // Cache przez CloudFront - 1 godzina
    headers["Cache-Control"] = "public, max-age=3600";

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(response, null, 2), // Pretty print dla debugowania
    };
  } catch (error) {
    console.error("Error fetching Google Reviews:", error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: "Failed to fetch reviews",
        message: error.message,
      }),
    };
  }
};

// Funkcja pomocnicza do pobierania danych z Google Places API
function getPlaceDetails(placeId, apiKey) {
  return new Promise((resolve, reject) => {
    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=rating,user_ratings_total,reviews&key=${apiKey}&language=pl`;

    https
      .get(url, (res) => {
        res.setEncoding("utf8"); // Ustaw kodowanie na UTF-8
        let data = "";

        res.on("data", (chunk) => {
          data += chunk;
        });

        res.on("end", () => {
          try {
            const parsed = JSON.parse(data);
            if (parsed.status === "OK") {
              resolve(parsed.result);
            } else {
              reject(new Error(`Google API Error: ${parsed.status}`));
            }
          } catch (e) {
            reject(e);
          }
        });
      })
      .on("error", reject);
  });
}

// Funkcja do czyszczenia tekstu z problemowych znaków
function cleanText(text) {
  if (!text) return "";

  // Dekoduj encje HTML
  const textarea = require("util").TextDecoder
    ? new (require("util").TextDecoder)("utf-8")
    : null;

  // Podstawowe czyszczenie
  let cleaned = text
    .replace(/&#x([0-9A-F]+);/gi, (match, hex) =>
      String.fromCharCode(parseInt(hex, 16))
    )
    .replace(/&#(\d+);/g, (match, dec) => String.fromCharCode(dec))
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&nbsp;/g, " ")
    .replace(/\u00A0/g, " "); // non-breaking space

  // Jeśli nadal są problemy, spróbuj zdekodować
  try {
    const buffer = Buffer.from(cleaned, "utf8");
    cleaned = buffer.toString("utf8");
  } catch (e) {
    console.error("Encoding error:", e);
  }

  return cleaned;
}

// Formatowanie opinii do struktury używanej w Astro
function formatReviews(googleReviews) {
  return googleReviews.slice(0, 10).map((review, index) => ({
    id: `google-review-${index}`,
    author: cleanText(review.author_name),
    avatar: review.author_name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2),
    rating: review.rating,
    text: cleanText(review.text), // Wyczyść tekst
    date: formatRelativeTime(review.time),
    verified: true,
    profilePhoto: review.profile_photo_url,
  }));
}

// Formatowanie czasu względnego
function formatRelativeTime(timestamp) {
  const now = Date.now() / 1000;
  const diff = now - timestamp;

  const minutes = Math.floor(diff / 60);
  const hours = Math.floor(diff / 3600);
  const days = Math.floor(diff / 86400);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);

  if (months > 0) {
    return months === 1 ? "Miesiąc temu" : `${months} miesiące temu`;
  } else if (weeks > 0) {
    if (weeks === 1) return "Tydzień temu";
    else if (weeks < 5) return `${weeks} tygodnie temu`;
    else return `${weeks} tygodni temu`;
  } else if (days > 0) {
    return days === 1 ? "Wczoraj" : `${days} dni temu`;
  } else if (hours > 0) {
    if (hours === 1) return "Godzinę temu";
    else if (hours < 5) return `${hours} godziny temu`;
    else return `${hours} godzin temu`;
  } else {
    return "Przed chwilą";
  }
}
