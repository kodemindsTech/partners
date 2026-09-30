import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Retner Partner Portal",
    short_name: "Retner Partners",
    description: "Refer D2C brands, track leads, earn commissions, and request payouts on Retner.",
    start_url: "/",
    display: "standalone",
    background_color: "#F5F5F7",
    theme_color: "#1F251D",
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
