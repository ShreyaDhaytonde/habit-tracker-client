"use client";

import { useCallback, useEffect, useState } from "react";
import HabitForm from "@/app/components/HabitForm";
import HabitList from "@/app/components/HabitList";
import { completeHabit, createHabit, deleteHabit, listHabits } from "@/app/lib/api";
import type { Habit } from "@/app/types/HabitTypes";
import { HABIT_CATEGORIES } from "@/app/types/HabitTypes";

export default function Home() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [categoryFilter, setCategoryFilter] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadHabits = useCallback((category: string) => {
    setLoading(true);
    setError(null);
    listHabits(category || undefined)
      .then(setHabits)
      .catch(() => setError("Could not load habits. Is the API running?"))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    loadHabits(categoryFilter);
  }, [categoryFilter, loadHabits]);

  async function handleCreate(name: string, category: string) {
    const habit = await createHabit(name, category);
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

  return (
    <div className="flex flex-1 justify-center bg-zinc-50 dark:bg-black">
      <main className="flex w-full max-w-xl flex-col gap-6 px-6 py-16">
        <div>
          <h1 className="text-2xl font-semibold">Habit Tracker</h1>
          <p className="text-sm text-zinc-500">Small daily habits, tracked one day at a time.</p>
        </div>

        <HabitForm onCreate={handleCreate} />

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

        {loading && <p className="text-sm text-zinc-500">Loading habits…</p>}
        {error && <p className="text-sm text-red-600">{error}</p>}
        {!loading && !error && (
          <HabitList habits={habits} onComplete={handleComplete} onDelete={handleDelete} />
        )}
      </main>
    </div>
  );
}
