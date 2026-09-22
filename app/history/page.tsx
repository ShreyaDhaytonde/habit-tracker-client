"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import HistoryStrip from "@/app/components/HistoryStrip";
import LogoutButton from "@/app/components/LogoutButton";
import ThemeToggle from "@/app/components/ThemeToggle";
import { listHabits } from "@/app/lib/api";
import type { Habit } from "@/app/types/HabitTypes";

export default function History() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    listHabits()
      .then(setHabits)
      .catch(() => setError("Could not load history. Is the API running?"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="flex flex-1 justify-center bg-gradient-to-b from-zinc-50 to-white dark:from-black dark:to-zinc-950">
      <main className="flex w-full max-w-xl flex-col gap-6 px-6 py-16">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-2xl font-bold text-transparent dark:from-emerald-400 dark:to-blue-400">
              History
            </h1>
            <p className="text-sm text-zinc-500">Last 28 days for each habit.</p>
            {!loading && habits.length > 0 && (
              <p className="text-xs text-zinc-400">{habits.length} habit{habits.length === 1 ? "" : "s"} tracked</p>
            )}
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

        <div className="flex items-center gap-4 text-xs text-zinc-500">
          <span className="flex items-center gap-1">
            <span className="h-3 w-3 rounded-sm bg-emerald-500" /> Done
          </span>
          <span className="flex items-center gap-1">
            <span className="h-3 w-3 rounded-sm bg-sky-400" /> Frozen
          </span>
          <span className="flex items-center gap-1">
            <span className="h-3 w-3 rounded-sm bg-zinc-200 dark:bg-zinc-800" /> Missed
          </span>
        </div>

        {loading && <p className="text-sm text-zinc-500">Loading history…</p>}
        {error && <p className="text-sm text-red-600">{error}</p>}
        {!loading && !error && habits.length === 0 && (
          <p className="text-sm text-zinc-500">No habits yet — add one to see its history here.</p>
        )}
        {!loading && !error && habits.length > 0 && (
          <ul className="flex flex-col gap-3">
            {habits.map((habit) => (
              <HistoryStrip key={habit.id} habit={habit} />
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}
