import type { MetadataRoute } from "next";
import { BRAND } from "@/lib/brand";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  return {
    name: BRAND.displayName,
    short_name: BRAND.name,
    description: BRAND.shortDescription,
    start_url: `${base}/`,
    display: "standalone",
    background_color: "#faf8f4",
    theme_color: "#0b1220",
    icons: [{ src: `${base}/icon.svg`, sizes: "any", type: "image/svg+xml" }],
  };
}
