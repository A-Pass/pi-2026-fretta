import type { MetadataRoute } from "next";
export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    scope: "/",
    lang: "pt-BR",
    name: "FRETTA",
    short_name: "FRETTA",
    description: "Mudanças e pequenos fretes",
    start_url: "/",
    display: "standalone",
    background_color: "#faf8f5",
    theme_color: "#f15b35",
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon-maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
