import type { MetadataRoute } from "next";
import { COMPOUNDS } from "@/data/compounds";
import { PRODUCTS } from "@/data/products";
import { BRAND } from "@/lib/brand";
import { SYMPTOMS } from "@/lib/funnel";

export const dynamic = "force-static";

/** Content pages last changed on this date; compounds and products carry their own dates. */
const CONTENT_UPDATED = "2026-09-15";

/** Absolute URL with the trailing slash the static export emits. */
function url(path: string) {
  const clean = path === "/" ? "" : path.replace(/^\/|\/$/g, "");
  return clean ? `${BRAND.url}/${clean}/` : `${BRAND.url}/`;
}

type Entry = MetadataRoute.Sitemap[number];

/**
 * Public, indexable routes. Deliberately absent: /checkout, /order, /account
 * and /report — personal, client-side state with nothing to index.
 */
const STATIC_ROUTES: { path: string; priority: number; changeFrequency: Entry["changeFrequency"] }[] = [
  { path: "/", priority: 1, changeFrequency: "weekly" },
  { path: "/shop", priority: 0.9, changeFrequency: "weekly" },
  { path: "/assessment", priority: 0.9, changeFrequency: "monthly" },
  { path: "/peptides", priority: 0.9, changeFrequency: "weekly" },
  { path: "/compare", priority: 0.8, changeFrequency: "weekly" },
  { path: "/lab-testing", priority: 0.8, changeFrequency: "weekly" },
  { path: "/start", priority: 0.7, changeFrequency: "monthly" },
  { path: "/how-it-works", priority: 0.7, changeFrequency: "monthly" },
  { path: "/methodology", priority: 0.7, changeFrequency: "monthly" },
  { path: "/shipping", priority: 0.6, changeFrequency: "monthly" },
  { path: "/safety", priority: 0.6, changeFrequency: "monthly" },
  { path: "/faq", priority: 0.6, changeFrequency: "monthly" },
  { path: "/about", priority: 0.5, changeFrequency: "monthly" },
  { path: "/privacy", priority: 0.3, changeFrequency: "yearly" },
  { path: "/terms", priority: 0.3, changeFrequency: "yearly" },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const staticEntries: Entry[] = STATIC_ROUTES.map((r) => ({
    url: url(r.path),
    lastModified: CONTENT_UPDATED,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));

  const productEntries: Entry[] = PRODUCTS.map((p) => ({
    url: url(`/shop/${p.slug}`),
    lastModified: p.lastUpdated,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const compoundEntries: Entry[] = COMPOUNDS.map((c) => ({
    url: url(`/peptides/${c.slug}`),
    lastModified: c.lastReviewed,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const symptomEntries: Entry[] = SYMPTOMS.map((s) => ({
    url: url(`/start/${s.slug}`),
    lastModified: CONTENT_UPDATED,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...staticEntries, ...productEntries, ...compoundEntries, ...symptomEntries];
}
