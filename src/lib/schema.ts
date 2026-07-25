// src/lib/schema.ts
const SITE = 'https://www.project-design.pl';

/**
 * BreadcrumbList dla podstrony. Pozycja 1 to zawsze strona główna.
 * URL-e z końcowym ukośnikiem — tak samo jak canonical i sitemap.
 */
export function breadcrumb(name: string, path: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Strona główna',
        item: `${SITE}/`,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name,
        item: `${SITE}${path}`,
      },
    ],
  };
}
