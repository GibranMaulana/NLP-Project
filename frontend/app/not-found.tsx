import Link from "next/link";

export default function NotFound() {
  return (
    <main className="cinematic-grain cinematic-vignette relative flex min-h-dvh flex-col items-center justify-center bg-[#111116] px-6 text-[#E9E7F5]">
      {/* Background Atmosphere */}
      <div className="pointer-events-none fixed inset-0 opacity-70" aria-hidden="true">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_30%,rgba(41,36,119,0.25)_0%,transparent_70%)]" />
      </div>

      <div className="relative z-10 flex flex-col items-center text-center max-w-md">
        {/* 404 Badge */}
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#F46B3C]/30 bg-[#F46B3C]/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-widest text-[#F46B3C]">
          <span>404</span>
          <span className="h-1 w-1 rounded-full bg-[#F46B3C]" />
          <span>Pagina Niet Gevonden</span>
        </div>

        <h1 className="title-glow mb-4 font-serif-editorial text-4xl font-semibold tracking-tight text-[#E9E7F5] sm:text-5xl">
          Verdwaald in het Gesprek
        </h1>

        <p className="mb-8 text-base leading-relaxed text-[#a0a0b0]">
          De opgevraagde pagina of het scenario kon niet worden gevonden. Het is mogelijk verplaatst of niet meer beschikbaar.
        </p>

        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-full bg-[#F46B3C] px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-[#E0592B]"
        >
          <span>← Terug naar Home</span>
        </Link>
      </div>
    </main>
  );
}
