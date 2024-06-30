import { defineConfig, squooshImageService } from "astro/config";

import mdx from "@astrojs/mdx";

// https://astro.build/config
export default defineConfig({
  image: {
    service: squooshImageService(),
  },
  vite: {
    assetsInclude: ["**/*.heic"],
  },
  integrations: [mdx()],
  site: "https://www.narcissus.me",
});
