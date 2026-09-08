"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import HabitForm from "@/app/components/HabitForm";
import HabitList from "@/app/components/HabitList";
import LogoutButton from "@/app/components/LogoutButton";
import ThemeToggle from "@/app/components/ThemeToggle";
import { completeHabit, createHabit, deleteHabit, listHabits, updateHabit } from "@/app/lib/api";
import { downloadFile, habitsToCsv, habitsToJson } from "@/app/lib/export";
import { filterHabitsByName, sortHabits } from "@/app/lib/filterSort";
import type { HabitSortKey } from "@/app/lib/filterSort";
import type { Habit } from "@/app/types/HabitTypes";
import { HABIT_CATEGORIES } from "@/app/types/HabitTypes";

const SORT_OPTIONS: { value: HabitSortKey; label: string }[] = [
  { value: "name", label: "Name (A-Z)" },
  { value: "streak", label: "Streak (highest first)" },
  { value: "category", label: "Category" },
  { value: "target_per_week", label: "Weekly target (highest first)" },
];

export default function Home() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [categoryFilter, setCategoryFilter] = useState<string>("");
  const [showArchived, setShowArchived] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<HabitSortKey>("name");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [completingAll, setCompletingAll] = useState(false);

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

  function handleExportJson() {
    downloadFile(habitsToJson(habits), "habits.json", "application/json");
  }

  function handleExportCsv() {
    downloadFile(habitsToCsv(habits), "habits.csv", "text/csv");
  }

  const visibleHabits = sortHabits(filterHabitsByName(habits, searchQuery), sortBy);
  const pendingToday = visibleHabits.filter((h) => !h.completed_today && !h.archived);

  async function handleCompleteAll() {
    setCompletingAll(true);
    try {
      const updates = await Promise.all(pendingToday.map((h) => completeHabit(h.id)));
      const updatesById = new Map(updates.map((h) => [h.id, h]));
      setHabits((prev) => prev.map((h) => updatesById.get(h.id) ?? h));
    } finally {
      setCompletingAll(false);
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

        <div className="flex items-center gap-2">
          <label htmlFor="habit-search" className="sr-only">
            Search habits by name
          </label>
          <input
            id="habit-search"
            type="search"
            placeholder="Search habits by name…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
          />
          <label htmlFor="habit-sort" className="text-sm text-zinc-500">
            Sort by
          </label>
          <select
            id="habit-sort"
            aria-label="Sort habits by"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as HabitSortKey)}
            className="rounded-md border border-zinc-300 px-2 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

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
          <div className="ml-auto flex items-center gap-2">
            <button
              onClick={handleCompleteAll}
              disabled={completingAll || pendingToday.length === 0}
              className="rounded-full bg-emerald-600 px-3 py-1 text-sm font-medium text-white disabled:opacity-50"
            >
              {completingAll ? "Completing…" : `Complete all for today (${pendingToday.length})`}
            </button>
            <button
              onClick={handleExportJson}
              disabled={habits.length === 0}
              className="text-sm text-zinc-500 underline hover:text-zinc-900 disabled:opacity-50 disabled:no-underline"
            >
              Export JSON
            </button>
            <button
              onClick={handleExportCsv}
              disabled={habits.length === 0}
              className="text-sm text-zinc-500 underline hover:text-zinc-900 disabled:opacity-50 disabled:no-underline"
            >
              Export CSV
            </button>
          </div>
        </div>

        {loading && <p className="text-sm text-zinc-500">Loading habits…</p>}
        {error && <p className="text-sm text-red-600">{error}</p>}
        {!loading && !error && (
          <HabitList
            habits={visibleHabits}
            onComplete={handleComplete}
            onDelete={handleDelete}
            onEdit={handleEdit}
            onArchiveToggle={handleArchiveToggle}
            emptyMessage={
              searchQuery
                ? `No habits match "${searchQuery}".`
                : categoryFilter
                  ? `No habits in the "${categoryFilter}" category yet.`
                  : undefined
            }
          />
        )}
      </main>
    </div>
  );
}
