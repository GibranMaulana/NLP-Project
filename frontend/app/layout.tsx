import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import GoogleTranslate from "@/app/components/GoogleTranslate";
import LanguageToggle from "@/app/components/LanguageToggle";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Interactieve Scenario Ervaring",
  description: "Interactieve NLP & Meta Model simulatie ervaring",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="nl"
      className={`${playfair.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans bg-[#111116] text-[#e8e8ec]">
        {/* Global Floating Language Switcher */}
        <header className="fixed top-5 right-6 z-50 pointer-events-auto">
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
