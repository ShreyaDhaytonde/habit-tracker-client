"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import HabitForm from "@/app/components/HabitForm";
import HabitList from "@/app/components/HabitList";
import LogoutButton from "@/app/components/LogoutButton";
import ThemeToggle from "@/app/components/ThemeToggle";
import { completeHabit, createHabit, deleteHabit, listHabits, updateHabit } from "@/app/lib/api";
import type { Habit } from "@/app/types/HabitTypes";
import { HABIT_CATEGORIES } from "@/app/types/HabitTypes";

export default function Home() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [categoryFilter, setCategoryFilter] = useState<string>("");
  const [showArchived, setShowArchived] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadHabits = useCallback((category: string, includeArchived: boolean) => {
    setLoading(true);
    setError(null);
    listHabits(category || undefined, includeArchived)
      .then(setHabits)
      .catch(() => setError("Could not load habits. Is the API running?"))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    loadHabits(categoryFilter, showArchived);
  }, [categoryFilter, showArchived, loadHabits]);

  async function handleCreate(name: string, category: string, targetPerWeek: number, notes: string) {
    const habit = await createHabit(name, category, targetPerWeek, notes);
    if (!categoryFilter || categoryFilter === habit.category) {
      setHabits((prev) => [...prev, habit]);
    }
  }

  async function handleComplete(id: number) {
    const updated = await completeHabit(id);
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

  async function handleArchiveToggle(id: number, archived: boolean) {
    const updated = await updateHabit(id, { archived });
    if (archived && !showArchived) {
      setHabits((prev) => prev.filter((h) => h.id !== id));
    } else {
      setHabits((prev) => prev.map((h) => (h.id === id ? updated : h)));
    }
  }

  return (
    <div className="flex flex-1 justify-center bg-zinc-50 dark:bg-black">
      <main className="flex w-full max-w-xl flex-col gap-6 px-6 py-16">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold">Habit Tracker</h1>
            <p className="text-sm text-zinc-500">Build small daily habits, one day at a time.</p>
          </div>
          <div className="flex items-center gap-1">
            <Link
              href="/stats"
              className="whitespace-nowrap text-sm text-zinc-500 underline hover:text-zinc-900"
            >
              View stats
            </Link>
            <ThemeToggle />
            <LogoutButton />
          </div>
        </div>

        <HabitForm onCreate={handleCreate} />

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <label htmlFor="category-filter" className="text-sm text-zinc-500">
              Filter by category
            </label>
            <select
              id="category-filter"
              aria-label="Filter by category"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="rounded-md border border-zinc-300 px-2 py-1 text-sm dark:border-zinc-700 dark:bg-zinc-900"
            >
              <option value="">All</option>
              {HABIT_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <label className="flex items-center gap-1 text-sm text-zinc-500">
            <input
              type="checkbox"
              checked={showArchived}
              onChange={(e) => setShowArchived(e.target.checked)}
            />
            Show archived
          </label>
        </div>

        {loading && <p className="text-sm text-zinc-500">Loading habits…</p>}
        {error && <p className="text-sm text-red-600">{error}</p>}
        {!loading && !error && (
          <HabitList
            habits={habits}
            onComplete={handleComplete}
            onDelete={handleDelete}
            onEdit={handleEdit}
            onArchiveToggle={handleArchiveToggle}
            emptyMessage={
              categoryFilter
                ? `No habits in the "${categoryFilter}" category yet.`
                : undefined
            }
          />
        )}
      </main>
    </div>
  );
}
