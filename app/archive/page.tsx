"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import HabitList from "@/app/components/HabitList";
import LogoutButton from "@/app/components/LogoutButton";
import ThemeToggle from "@/app/components/ThemeToggle";
import {
  completeHabit,
  createHabit,
  deleteHabit,
  listHabits,
  skipHabit,
  unskipHabit,
  updateHabit,
} from "@/app/lib/api";
import type { Habit } from "@/app/types/HabitTypes";

export default function Archive() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadArchived = useCallback(() => {
    setLoading(true);
    setError(null);
    listHabits(undefined, true)
      .then((all) => setHabits(all.filter((h) => h.archived)))
      .catch(() => setError("Could not load archived habits. Is the API running?"))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    loadArchived();
  }, [loadArchived]);

  async function handleComplete(id: number) {
    const updated = await completeHabit(id);
    setHabits((prev) => prev.map((h) => (h.id === id ? updated : h)));
  }

  async function handleSkip(id: number) {
    const updated = await skipHabit(id);
    setHabits((prev) => prev.map((h) => (h.id === id ? updated : h)));
  }

  async function handleUnskip(id: number) {
    const updated = await unskipHabit(id);
    setHabits((prev) => prev.map((h) => (h.id === id ? updated : h)));
  }

  async function handleDelete(id: number) {
    await deleteHabit(id);
    setHabits((prev) => prev.filter((h) => h.id !== id));
  }

  async function handleEdit(
    id: number,
    name: string,
    category: string,
    targetPerWeek: number,
    notes: string
  ) {
    const updated = await updateHabit(id, {
      name,
      category,
      target_per_week: targetPerWeek,
      notes,
    });
    setHabits((prev) => prev.map((h) => (h.id === id ? updated : h)));
  }

  async function handleDuplicate(id: number) {
    const source = habits.find((h) => h.id === id);
    if (!source) return;
    try {
      // The copy is always created active (createHabit has no archived flag),
      // so it belongs on the home page, not in this archived-only list.
      await createHabit(
        `${source.name} (copy)`,
        source.category,
        source.target_per_week,
        source.notes ?? undefined
      );
    } catch {
      setError("Could not duplicate that habit — try again.");
    }
  }

  async function handleArchiveToggle(id: number, archived: boolean) {
    try {
      const updated = await updateHabit(id, { archived });
      if (!archived) {
        setHabits((prev) => prev.filter((h) => h.id !== id));
      } else {
        setHabits((prev) => prev.map((h) => (h.id === id ? updated : h)));
      }
    } catch {
      setError("Could not update that habit — refreshing the list.");
      loadArchived();
    }
  }

  return (
    <div className="flex flex-1 justify-center bg-gradient-to-b from-zinc-50 to-white dark:from-black dark:to-zinc-950">
      <main className="flex w-full max-w-xl flex-col gap-6 px-6 py-16">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-2xl font-bold text-transparent dark:from-emerald-400 dark:to-blue-400">
              Archive
            </h1>
            <p className="text-sm text-zinc-500">Habits you&apos;ve archived, out of the main list.</p>
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

        {loading && <p className="text-sm text-zinc-500">Loading archived habits…</p>}
        {error && <p className="text-sm text-red-600">{error}</p>}
        {!loading && !error && (
          <HabitList
            habits={habits}
            onComplete={handleComplete}
            onSkip={handleSkip}
            onUnskip={handleUnskip}
            onDelete={handleDelete}
            onEdit={handleEdit}
            onArchiveToggle={handleArchiveToggle}
            onDuplicate={handleDuplicate}
            emptyMessage="No archived habits — anything you archive from the home page shows up here."
          />
        )}
      </main>
    </div>
  );
}
