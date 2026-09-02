"use client";

import { useState } from "react";
import { HABIT_CATEGORIES, WEEKLY_TARGET_OPTIONS } from "@/app/types/HabitTypes";

interface HabitFormProps {
  onCreate: (name: string, category: string, targetPerWeek: number) => Promise<void>;
}

export default function HabitForm({ onCreate }: HabitFormProps) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState<string>(HABIT_CATEGORIES[0]);
  const [targetPerWeek, setTargetPerWeek] = useState<number>(7);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;
    setSubmitting(true);
    try {
      await onCreate(trimmed, category, targetPerWeek);
      setName("");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-wrap gap-2">
      <input
        aria-label="New habit name"
        placeholder="e.g. Drink more water"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="flex-1 rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
      />
      <select
        aria-label="Habit category"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="rounded-md border border-zinc-300 px-2 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
      >
        {HABIT_CATEGORIES.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>
      <select
        aria-label="Times per week"
        value={targetPerWeek}
        onChange={(e) => setTargetPerWeek(Number(e.target.value))}
        className="rounded-md border border-zinc-300 px-2 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
      >
        {WEEKLY_TARGET_OPTIONS.map((n) => (
          <option key={n} value={n}>
            {n}x / week
          </option>
        ))}
      </select>
      <button
        type="submit"
        disabled={submitting || !name.trim()}
        className="rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background disabled:opacity-50"
      >
        Add habit
      </button>
    </form>
  );
}
