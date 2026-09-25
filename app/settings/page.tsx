"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import LogoutButton from "@/app/components/LogoutButton";
import ThemeToggle from "@/app/components/ThemeToggle";
import { loadDefaultWeeklyTarget, saveDefaultWeeklyTarget } from "@/app/lib/settingsPrefs";
import { WEEKLY_TARGET_OPTIONS } from "@/app/types/HabitTypes";

export default function Settings() {
  const [defaultTarget, setDefaultTarget] = useState<number>(7);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const stored = loadDefaultWeeklyTarget();
    if (stored !== null) setDefaultTarget(stored);
  }, []);

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const value = Number(e.target.value);
    setDefaultTarget(value);
    saveDefaultWeeklyTarget(value);
    setSaved(true);
  }

  return (
    <div className="flex flex-1 justify-center bg-gradient-to-b from-zinc-50 to-white dark:from-black dark:to-zinc-950">
      <main className="flex w-full max-w-xl flex-col gap-6 px-6 py-16">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-2xl font-bold text-transparent dark:from-emerald-400 dark:to-blue-400">
              Settings
            </h1>
            <p className="text-sm text-zinc-500">Defaults used when you add a new habit.</p>
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

        <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/40">
          <label htmlFor="default-weekly-target" className="text-sm font-medium">
            Default weekly target
          </label>
          <p className="mb-3 text-xs text-zinc-500">
            Pre-fills "Times per week" whenever you add a new habit.
          </p>
          <select
            id="default-weekly-target"
            aria-label="Default weekly target"
            value={defaultTarget}
            onChange={handleChange}
            className="rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
          >
            {WEEKLY_TARGET_OPTIONS.map((n) => (
              <option key={n} value={n}>
                {n}x / week
              </option>
            ))}
          </select>
          {saved && <p className="mt-2 text-xs text-emerald-600">Saved.</p>}
        </div>
      </main>
    </div>
  );
}
