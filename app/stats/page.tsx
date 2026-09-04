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
    <div className="flex flex-1 justify-center bg-zinc-50 dark:bg-black">
      <main className="flex w-full max-w-xl flex-col gap-6 px-6 py-16">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold">Your stats</h1>
            <p className="text-sm text-zinc-500">How your habits are tracking overall.</p>
          </div>
          <div className="flex items-center gap-1">
            <ThemeToggle />
            <LogoutButton />
          </div>
        </div>

        <Link href="/" className="text-sm text-zinc-500 underline hover:text-zinc-900">
          Back to habits
        </Link>

        {loading && <p className="text-sm text-zinc-500">Loading stats…</p>}
        {error && <p className="text-sm text-red-600">{error}</p>}
        {!loading && !error && stats && <StatsSummary stats={stats} />}
      </main>
    </div>
  );
}
