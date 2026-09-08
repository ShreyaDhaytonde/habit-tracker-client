"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import LogoutButton from "@/app/components/LogoutButton";
import StatsSummary from "@/app/components/StatsSummary";
import ThemeToggle from "@/app/components/ThemeToggle";
import { getHabitStats } from "@/app/lib/api";
import type { HabitStats } from "@/app/types/HabitTypes";

export default function Stats() {
  const [stats, setStats] = useState<HabitStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getHabitStats()
      .then(setStats)
      .catch(() => setError("Could not load stats. Is the API running?"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="flex flex-1 justify-center bg-gradient-to-b from-zinc-50 to-white dark:from-black dark:to-zinc-950">
      <main className="flex w-full max-w-xl flex-col gap-6 px-6 py-16">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-2xl font-bold text-transparent dark:from-emerald-400 dark:to-blue-400">
              Your stats
            </h1>
            <p className="text-sm text-zinc-500">How your habits are tracking overall.</p>
          </div>
          <div className="flex items-center gap-1">
            <ThemeToggle />
            <LogoutButton />
          </div>
        </div>

        <Link
          href="/"
          className="w-fit rounded-full border border-zinc-200 px-3 py-1 text-sm text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
        >
          ← Back to habits
        </Link>

        {loading && <p className="text-sm text-zinc-500">Loading stats…</p>}
        {error && <p className="text-sm text-red-600">{error}</p>}
        {!loading && !error && stats && <StatsSummary stats={stats} />}
      </main>
    </div>
  );
}
