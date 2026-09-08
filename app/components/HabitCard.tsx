"use client";

import { useState } from "react";
import { getCategoryBadgeClasses } from "@/app/lib/categoryColors";
import type { Habit } from "@/app/types/HabitTypes";
import { HABIT_CATEGORIES, WEEKLY_TARGET_OPTIONS } from "@/app/types/HabitTypes";

const INPUT_CLASSES =
  "rounded-lg border border-zinc-300 px-3 py-2 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 dark:border-zinc-700 dark:bg-zinc-900";
const GHOST_BUTTON_CLASSES =
  "rounded-full px-3 py-1 text-sm text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-zinc-100";

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
      <li className="rounded-xl border border-emerald-500/50 bg-white px-4 py-4 shadow-sm dark:bg-zinc-900/40">
        <form onSubmit={handleSave} className="flex flex-wrap items-center gap-2">
          <input
            aria-label={`Edit name for ${habit.name}`}
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={`min-w-[140px] flex-1 ${INPUT_CLASSES}`}
          />
          <select
            aria-label={`Edit category for ${habit.name}`}
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className={INPUT_CLASSES}
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
            className={INPUT_CLASSES}
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
            className={`basis-full ${INPUT_CLASSES}`}
          />
          <button
            type="submit"
            disabled={saving || !name.trim()}
            className="rounded-full bg-emerald-600 px-4 py-1.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-emerald-700 disabled:opacity-50 disabled:hover:bg-emerald-600"
          >
            Save
          </button>
          <button type="button" onClick={() => setEditing(false)} className={GHOST_BUTTON_CLASSES}>
            Cancel
          </button>
        </form>
      </li>
    );
  }

  return (
    <li className="flex items-center justify-between gap-4 rounded-xl border border-zinc-200 bg-white px-4 py-4 shadow-sm transition-shadow hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900/40">
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className="font-medium">{habit.name}</p>
          <span
            className={`shrink-0 whitespace-nowrap rounded-full px-2 py-0.5 text-xs font-medium ${getCategoryBadgeClasses(habit.category)}`}
          >
            {habit.category}
          </span>
          {habit.at_risk && (
            <span
              role="status"
              aria-label={`${habit.name} is at risk of missing its weekly goal`}
              className="shrink-0 whitespace-nowrap rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700 dark:bg-amber-900/40 dark:text-amber-400"
            >
              ⏰ Due today
            </span>
          )}
        </div>
        <p className="text-sm text-zinc-500">
          {habit.streak === 0
            ? "Start your streak today!"
            : `🔥 ${habit.streak} day${habit.streak === 1 ? "" : "s"} streak`}
        </p>
        <div className="mt-2 flex items-center gap-2">
          <div
            role="progressbar"
            aria-label={`${habit.name} weekly progress`}
            aria-valuenow={habit.completed_this_week}
            aria-valuemin={0}
            aria-valuemax={habit.target_per_week}
            className="h-2 w-24 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800"
          >
            <div
              className={`h-full rounded-full transition-all duration-300 ${goalReached ? "bg-amber-500" : "bg-emerald-600"}`}
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
      <div className="flex shrink-0 flex-wrap items-center justify-end gap-1">
        <button
          onClick={() => onComplete(habit.id)}
          disabled={habit.completed_today || habit.archived}
          className="rounded-full bg-emerald-600 px-4 py-1.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-emerald-700 disabled:opacity-50 disabled:hover:bg-emerald-600"
        >
          {habit.completed_today ? "Done today" : "Mark done"}
        </button>
        <button onClick={startEditing} aria-label={`Edit ${habit.name}`} className={GHOST_BUTTON_CLASSES}>
          Edit
        </button>
        <button
          onClick={() => onArchiveToggle(habit.id, !habit.archived)}
          aria-label={`${habit.archived ? "Unarchive" : "Archive"} ${habit.name}`}
          className={GHOST_BUTTON_CLASSES}
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
          className="rounded-full px-3 py-1 text-sm text-zinc-500 transition-colors hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/40"
        >
          Remove
        </button>
      </div>
    </li>
  );
}
