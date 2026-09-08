"use client";

import { useState } from "react";
import { HABIT_CATEGORIES, WEEKLY_TARGET_OPTIONS } from "@/app/types/HabitTypes";

interface HabitFormProps {
  onCreate: (
    name: string,
    category: string,
    targetPerWeek: number,
    notes: string
  ) => Promise<void>;
}

export default function HabitForm({ onCreate }: HabitFormProps) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState<string>(HABIT_CATEGORIES[0]);
  const [targetPerWeek, setTargetPerWeek] = useState<number>(7);
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;
    setSubmitting(true);
    try {
      await onCreate(trimmed, category, targetPerWeek, notes.trim());
      setName("");
      setNotes("");
    } finally {
      setSubmitting(false);
    }
  }

  const inputClasses =
    "rounded-lg border border-zinc-300 px-3 py-2 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 dark:border-zinc-700 dark:bg-zinc-900";

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/40">
      <form onSubmit={handleSubmit} className="flex flex-wrap gap-2">
        <input
          aria-label="New habit name"
          placeholder="e.g. Drink more water"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={`flex-1 ${inputClasses}`}
        />
        <select
          aria-label="Habit category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className={inputClasses}
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
          className={inputClasses}
        >
          {WEEKLY_TARGET_OPTIONS.map((n) => (
            <option key={n} value={n}>
              {n}x / week
            </option>
          ))}
        </select>
        <input
          aria-label="Notes (optional)"
          placeholder="Notes (optional)"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className={`flex-1 ${inputClasses}`}
        />
        <button
          type="submit"
          disabled={submitting || !name.trim()}
          className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-emerald-700 disabled:opacity-50 disabled:hover:bg-emerald-600"
        >
          Add habit
        </button>
      </form>
    </div>
  );
}
