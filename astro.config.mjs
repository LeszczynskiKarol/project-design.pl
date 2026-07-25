// @astro.config.mjs
import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://www.project-design.pl",
  integrations: [
    tailwind(),
    sitemap({
      // Strony prawne zostaja indeksowalne (linki w stopce), ale nie zjadaja
      // budzetu crawlowania stronom uslugowym.
      filter: (page) =>
        !page.includes("/polityka-prywatnosci") &&
        !page.includes("/regulamin"),
      serialize: (item) => ({
        ...item,
        lastmod: new Date().toISOString(),
      }),
    }),
  ],
  output: "static",
  build: {
    assets: "assets",
    format: "directory",
  },
  compressHTML: true,
  prefetch: {
    defaultStrategy: "viewport",
  },
  vite: {
    build: {
      cssCodeSplit: true,
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ["astro:jsx/runtime"],
          },
        },
      },
    },
    ssr: {
      noExternal: ["@astrojs/tailwind"],
    },
  },
});
