"use client";

import { useState } from "react";

interface HabitFormProps {
  onCreate: (name: string) => Promise<void>;
}

export default function HabitForm({ onCreate }: HabitFormProps) {
  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;
    setSubmitting(true);
    try {
      await onCreate(trimmed);
      setName("");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        aria-label="New habit name"
        placeholder="e.g. Drink water"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="flex-1 rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
      />
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
