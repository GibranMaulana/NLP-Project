import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import GoogleTranslate from "@/app/components/GoogleTranslate";
import LanguageToggle from "@/app/components/LanguageToggle";

const playfair = Playfair_Display({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-playfair",
});

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Beleef NLP — De Leiderschapstaal Spiegel",
  description: "Ervaar uw leiderschapspatronen via interactieve NLP Meta Model simulaties.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="nl"
      suppressHydrationWarning
      className={`${playfair.variable} ${inter.variable} h-full antialiased`}
    >
      <head>
        <link rel="preconnect" href="https://v8udsf47.api.sanity.io" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://v8udsf47.api.sanity.io" />
        <link rel="preconnect" href="https://cdn.sanity.io" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://cdn.sanity.io" />
      </head>
      <body
        suppressHydrationWarning
        className="min-h-full flex flex-col font-sans bg-[#111116] text-[#e8e8ec]"
      >
        {/* Global Floating Language Switcher */}
        <header className="global-floating-lang fixed top-4 right-4 sm:top-5 sm:right-6 z-50 pointer-events-auto">
          <LanguageToggle />
        </header>

        {/* Main Application Content */}
        <main className="flex-1 flex flex-col">{children}</main>

        {/* Global Google Translate Client Script & CSS overrides */}
        <GoogleTranslate />
      </body>
    </html>
  );
}
