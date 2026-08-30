"use client";

import { useEffect, useState } from "react";

type Language = "id" | "nl";

interface Props {
  className?: string;
}

export default function LanguageToggle({ className = "" }: Props) {
  const [currentLang, setCurrentLang] = useState<Language>("nl");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Parse googtrans cookie (e.g. /auto/nl or /auto/id or /id/nl)
    const match = document.cookie.match(/(?:^|;\s*)googtrans=([^;]*)/);
    if (match) {
      const value = decodeURIComponent(match[1]);
      if (value.endsWith("/id")) {
        setCurrentLang("id");
        return;
      }
      if (value.endsWith("/nl")) {
        setCurrentLang("nl");
        return;
      }
    }

    // Default to Dutch
    setCurrentLang("nl");
    const hostname = window.location.hostname;
    document.cookie = "googtrans=/auto/nl; path=/;";
    if (hostname && hostname !== "localhost") {
      document.cookie = `googtrans=/auto/nl; path=/; domain=.${hostname};`;
    }
  }, []);

  const changeLanguage = (lang: Language) => {
    if (lang === currentLang) return;

    const hostname = window.location.hostname;

    if (lang === "id") {
      // Set to Indonesian (/auto/id)
      document.cookie = "googtrans=/auto/id; path=/;";
      if (hostname && hostname !== "localhost") {
        document.cookie = `googtrans=/auto/id; path=/; domain=.${hostname};`;
      }
    } else {
      // Set to Dutch (/auto/nl)
      document.cookie = "googtrans=/auto/nl; path=/;";
      if (hostname && hostname !== "localhost") {
        document.cookie = `googtrans=/auto/nl; path=/; domain=.${hostname};`;
      }
    }

    // Reload page safely to prevent React hydration mismatches and trigger Google Translate
    window.location.reload();
  };

  if (!mounted) {
    return (
      <div
        className={`inline-flex h-9 w-[190px] animate-pulse rounded-full border border-[#292477]/30 bg-[#111116]/80 ${className}`}
      />
    );
  }

  return (
    <div
      role="group"
      aria-label="Taalkeuze / Pilihan Bahasa"
      className={`notranslate inline-flex items-center rounded-full border border-[#292477]/40 bg-[#111116]/90 p-1 shadow-lg backdrop-blur-md ${className}`}
    >
      <button
        type="button"
        onClick={() => changeLanguage("nl")}
        aria-pressed={currentLang === "nl"}
        className={`inline-flex cursor-pointer items-center gap-2 rounded-full px-4 py-1.5 text-xs font-medium tracking-wide transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F46B3C] ${
          currentLang === "nl"
            ? "bg-[#292477] text-[#E9E7F5] shadow"
            : "text-[#8a8a9e] hover:text-[#E9E7F5]"
        }`}
      >
        <span className="text-sm">🇳🇱</span>
        <span>Nederlands</span>
      </button>

      <button
        type="button"
        onClick={() => changeLanguage("id")}
        aria-pressed={currentLang === "id"}
        className={`inline-flex cursor-pointer items-center gap-2 rounded-full px-4 py-1.5 text-xs font-medium tracking-wide transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F46B3C] ${
          currentLang === "id"
            ? "bg-[#292477] text-[#E9E7F5] shadow"
            : "text-[#8a8a9e] hover:text-[#E9E7F5]"
        }`}
      >
        <span className="text-sm">🇮🇩</span>
        <span>Indonesia</span>
      </button>
    </div>
  );
}
