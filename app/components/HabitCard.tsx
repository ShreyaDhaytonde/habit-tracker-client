"use client";

import { useState } from "react";
import type { Habit } from "@/app/types/HabitTypes";
import { HABIT_CATEGORIES, WEEKLY_TARGET_OPTIONS } from "@/app/types/HabitTypes";

interface HabitCardProps {
  habit: Habit;
  onComplete: (id: number) => void;
  onDelete: (id: number) => void;
  onEdit: (
    id: number,
    name: string,
    category: string,
    targetPerWeek: number,
    notes: string
  ) => Promise<void>;
  onArchiveToggle: (id: number, archived: boolean) => void;
}

export default function HabitCard({
  habit,
  onComplete,
  onDelete,
  onEdit,
  onArchiveToggle,
}: HabitCardProps) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(habit.name);
  const [category, setCategory] = useState(habit.category);
  const [targetPerWeek, setTargetPerWeek] = useState(habit.target_per_week);
  const [notes, setNotes] = useState(habit.notes ?? "");
  const [saving, setSaving] = useState(false);

  const goalReached = habit.completed_this_week >= habit.target_per_week;

  function startEditing() {
    setName(habit.name);
    setCategory(habit.category);
    setTargetPerWeek(habit.target_per_week);
    setNotes(habit.notes ?? "");
    setEditing(true);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;
    setSaving(true);
    try {
      await onEdit(habit.id, trimmed, category, targetPerWeek, notes.trim());
      setEditing(false);
    } finally {
      setSaving(false);
    }
  }

  if (editing) {
    return (
      <li className="rounded-lg border border-zinc-200 px-4 py-3 dark:border-zinc-800">
        <form onSubmit={handleSave} className="flex flex-wrap items-center gap-2">
          <input
            aria-label={`Edit name for ${habit.name}`}
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="flex-1 rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
          />
          <select
            aria-label={`Edit category for ${habit.name}`}
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
            aria-label={`Edit times per week for ${habit.name}`}
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
          <input
            aria-label={`Edit notes for ${habit.name}`}
            placeholder="Notes (optional)"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full flex-1 rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
          />
          <button
            type="submit"
            disabled={saving || !name.trim()}
            className="rounded-full bg-foreground px-3 py-1 text-sm font-medium text-background disabled:opacity-50"
          >
            Save
          </button>
          <button
            type="button"
            onClick={() => setEditing(false)}
            className="rounded-full px-3 py-1 text-sm text-zinc-500"
          >
            Cancel
          </button>
        </form>
      </li>
    );
  }

  return (
    <li className="flex items-center justify-between rounded-lg border border-zinc-200 px-4 py-3 dark:border-zinc-800">
      <div>
        <div className="flex items-center gap-2">
          <p className="font-medium">{habit.name}</p>
          <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
            {habit.category}
          </span>
        </div>
        <p className="text-sm text-zinc-500">
          {habit.streak === 0
            ? "Start your streak today!"
            : `🔥 ${habit.streak} day${habit.streak === 1 ? "" : "s"} streak`}
        </p>
        <div className="mt-1 flex items-center gap-2">
          <div
            role="progressbar"
            aria-label={`${habit.name} weekly progress`}
            aria-valuenow={habit.completed_this_week}
            aria-valuemin={0}
            aria-valuemax={habit.target_per_week}
            className="h-1.5 w-24 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800"
          >
            <div
              className={`h-full rounded-full ${goalReached ? "bg-amber-500" : "bg-emerald-600"}`}
              style={{
                width: `${Math.min(
                  100,
                  (habit.completed_this_week / habit.target_per_week) * 100
                )}%`,
              }}
            />
          </div>
          <span className="text-xs text-zinc-500">
            {goalReached
              ? "🎉 Weekly goal reached"
              : `${habit.completed_this_week}/${habit.target_per_week} this week`}
          </span>
        </div>
        {habit.notes && <p className="mt-1 text-xs text-zinc-500 italic">{habit.notes}</p>}
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onComplete(habit.id)}
          disabled={habit.completed_today || habit.archived}
          className="rounded-full px-3 py-1 text-sm font-medium disabled:opacity-50 bg-emerald-600 text-white disabled:bg-emerald-600"
        >
          {habit.completed_today ? "Done today" : "Mark done"}
        </button>
        <button
          onClick={startEditing}
          aria-label={`Edit ${habit.name}`}
          className="rounded-full px-3 py-1 text-sm text-zinc-500 hover:text-zinc-900"
        >
          Edit
        </button>
        <button
          onClick={() => onArchiveToggle(habit.id, !habit.archived)}
          aria-label={`${habit.archived ? "Unarchive" : "Archive"} ${habit.name}`}
          className="rounded-full px-3 py-1 text-sm text-zinc-500 hover:text-zinc-900"
        >
          {habit.archived ? "Unarchive" : "Archive"}
        </button>
        <button
          onClick={() => {
            if (window.confirm(`Delete "${habit.name}"? This can't be undone.`)) {
              onDelete(habit.id);
            }
          }}
          aria-label={`Delete ${habit.name}`}
          className="rounded-full px-3 py-1 text-sm text-zinc-500 hover:text-red-600"
        >
          Remove
        </button>
      </div>
    </li>
  );
}
