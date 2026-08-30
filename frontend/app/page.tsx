import { getAllScenarios } from "@/lib/sanity.queries";
import Link from "next/link";

export default async function HomePage() {
  const scenarios = await getAllScenarios();

  return (
    <div className="flex flex-col flex-1 items-center justify-center min-h-screen bg-zinc-50 dark:bg-black px-4">
      <main className="w-full max-w-lg flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
            Daily Reflection
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400">
            Pilih skenario untuk memulai sesi refleksi harian kamu.
          </p>
        </div>

        {scenarios.length === 0 ? (
          <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 p-6 text-zinc-400 text-sm">
            Belum ada skenario. Tambahkan di Sanity CMS terlebih dahulu.
          </div>
        ) : (
          <ul className="flex flex-col gap-3">
            {scenarios.map((scenario) => (
              <li key={scenario.slug.current}>
                <Link
                  href={`/scenario/${scenario.slug.current}`}
                  className="flex items-center justify-between rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-5 py-4 hover:border-zinc-400 dark:hover:border-zinc-600 transition-colors"
                >
                  <span className="font-medium text-zinc-800 dark:text-zinc-100">
                    {scenario.title}
                  </span>
                  <span className="text-zinc-400">→</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}
