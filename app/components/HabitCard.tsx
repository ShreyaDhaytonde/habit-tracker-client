import type { Habit } from "@/app/types/HabitTypes";

interface HabitCardProps {
  habit: Habit;
  onComplete: (id: number) => void;
  onDelete: (id: number) => void;
}

export default function HabitCard({ habit, onComplete, onDelete }: HabitCardProps) {
  const goalReached = habit.completed_this_week >= habit.target_per_week;

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
            ? "Start your streak today"
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
