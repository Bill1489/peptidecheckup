import type { Metadata, Viewport } from "next";
import { Fraunces, Inter, JetBrains_Mono } from "next/font/google";
import { Toaster } from "sonner";
import { BRAND } from "@/lib/brand";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
  axes: ["opsz", "SOFT", "WONK"],
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  metadataBase: new URL(BRAND.url),
  title: {
    default: `${BRAND.displayName} — Compare peptides & check your fit`,
    template: `%s · ${BRAND.displayName}`,
  },
  description: BRAND.description,
  applicationName: BRAND.name,
  keywords: [
    "peptide comparison",
    "compare peptides",
    "peptide assessment",
    "which peptide is right for me",
    "BPC-157 vs TB-500",
    "semaglutide vs tirzepatide",
    "peptide safety",
    "peptide evidence",
    "peptide regulatory status",
  ],
  openGraph: {
    type: "website",
    siteName: BRAND.displayName,
    title: `${BRAND.displayName} — Compare peptides & check your fit`,
    description: BRAND.shortDescription,
    url: BRAND.url,
  },
  twitter: {
    card: "summary_large_image",
    title: `${BRAND.displayName} — Compare peptides & check your fit`,
    description: BRAND.shortDescription,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#faf8f4",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${fraunces.variable} ${jetbrains.variable} h-full`}
      suppressHydrationWarning
    >
      <body className="flex min-h-full flex-col">
        {children}
        <Toaster
          position="bottom-center"
          toastOptions={{
            classNames: {
              toast: "!rounded-2xl !border-line !shadow-lift !font-sans",
            },
          }}
        />
      </body>
    </html>
  );
}
