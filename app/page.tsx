"use client";

import { useEffect, useState } from "react";
import HabitForm from "@/app/components/HabitForm";
import HabitList from "@/app/components/HabitList";
import { completeHabit, createHabit, deleteHabit, listHabits } from "@/app/lib/api";
import type { Habit } from "@/app/types/HabitTypes";

export default function Home() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    listHabits()
      .then(setHabits)
      .catch(() => setError("Could not load habits. Is the API running?"))
      .finally(() => setLoading(false));
  }, []);

  async function handleCreate(name: string) {
    const habit = await createHabit(name);
    setHabits((prev) => [...prev, habit]);
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

        {loading && <p className="text-sm text-zinc-500">Loading habits…</p>}
        {error && <p className="text-sm text-red-600">{error}</p>}
        {!loading && !error && (
          <HabitList habits={habits} onComplete={handleComplete} onDelete={handleDelete} />
        )}
      </main>
    </div>
  );
}
