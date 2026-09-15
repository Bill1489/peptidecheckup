import type { Metadata, Viewport } from "next";
import { Archivo, IBM_Plex_Mono } from "next/font/google";
import { Toaster } from "sonner";
import { BRAND, OG_IMAGES } from "@/lib/brand";
import "./globals.css";

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  display: "swap",
  axes: ["wdth"],
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  metadataBase: new URL(BRAND.url),
  title: {
    default: `${BRAND.displayName} — Batch-tested peptides, matched to you`,
    template: `%s · ${BRAND.displayName}`,
  },
  description: BRAND.description,
  applicationName: BRAND.name,
  keywords: [
    "buy peptides UK",
    "peptide store",
    "peptide comparison",
    "compare peptides",
    "peptide assessment",
    "BPC-157",
    "TB-500",
    "semaglutide vs tirzepatide",
    "third-party tested peptides",
    "peptide certificate of analysis",
  ],
  openGraph: {
    type: "website",
    siteName: BRAND.displayName,
    title: `${BRAND.displayName} — Batch-tested peptides, matched to you`,
    description: BRAND.shortDescription,
    url: BRAND.url,
    images: OG_IMAGES,
  },
  twitter: {
    card: "summary_large_image",
    title: `${BRAND.displayName} — Batch-tested peptides, matched to you`,
    description: BRAND.shortDescription,
    images: [`${BRAND.url}/og.png`],
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#0b0b0c",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${archivo.variable} ${plexMono.variable} h-full`} suppressHydrationWarning>
      <body className="flex min-h-full flex-col">
        {children}
        <Toaster
          position="bottom-center"
          toastOptions={{
            classNames: {
              toast: "!rounded-none !border !border-ink !bg-ink !text-white !shadow-none !font-sans",
              description: "!text-white/70",
            },
          }}
        />
      </body>
    </html>
  );
}
