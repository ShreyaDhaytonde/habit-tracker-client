import type { Habit } from "@/app/types/HabitTypes";

interface HabitCardProps {
  habit: Habit;
  onComplete: (id: number) => void;
  onDelete: (id: number) => void;
}

export default function HabitCard({ habit, onComplete, onDelete }: HabitCardProps) {
  return (
    <li className="flex items-center justify-between rounded-lg border border-zinc-200 px-4 py-3 dark:border-zinc-800">
      <div>
        <p className="font-medium">{habit.name}</p>
        <p className="text-sm text-zinc-500">
          🔥 {habit.streak} day{habit.streak === 1 ? "" : "s"} streak
        </p>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onComplete(habit.id)}
          disabled={habit.completed_today}
          className="rounded-full px-3 py-1 text-sm font-medium disabled:opacity-50 bg-emerald-600 text-white disabled:bg-emerald-600"
        >
          {habit.completed_today ? "Done today" : "Mark done"}
        </button>
        <button
          onClick={() => onDelete(habit.id)}
          aria-label={`Delete ${habit.name}`}
          className="rounded-full px-3 py-1 text-sm text-zinc-500 hover:text-red-600"
        >
          Remove
        </button>
      </div>
    </li>
  );
}
