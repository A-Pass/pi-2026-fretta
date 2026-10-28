import type { MetadataRoute } from "next";
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "FRETTA",
    short_name: "FRETTA",
    description: "Mudanças e pequenos fretes",
    start_url: "/",
    display: "standalone",
    background_color: "#faf8f5",
    theme_color: "#f15b35",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" },
    ],
  };
}
