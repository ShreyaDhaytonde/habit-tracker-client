import { getCategoryBadgeClasses } from "@/app/lib/categoryColors";
import { dayStatus, lastNDates } from "@/app/lib/history";
import type { Habit } from "@/app/types/HabitTypes";

const DAYS_SHOWN = 28;

const STATUS_CLASSES: Record<string, string> = {
  done: "bg-emerald-500",
  skipped: "bg-sky-400",
  missed: "bg-zinc-200 dark:bg-zinc-800",
};

interface HistoryStripProps {
  habit: Habit;
}

export default function HistoryStrip({ habit }: HistoryStripProps) {
  const dates = lastNDates(DAYS_SHOWN);

  return (
    <li className="rounded-xl border border-zinc-200 bg-white px-4 py-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/40">
      <div className="mb-2 flex flex-wrap items-center gap-2">
        <p className="font-medium">{habit.name}</p>
        <span
          className={`shrink-0 whitespace-nowrap rounded-full px-2 py-0.5 text-xs font-medium ${getCategoryBadgeClasses(habit.category)}`}
        >
          {habit.category}
        </span>
      </div>
      <div
        role="img"
        aria-label={`${habit.name} activity for the last ${DAYS_SHOWN} days`}
        className="flex flex-wrap gap-1"
      >
        {dates.map((dateKey) => {
          const status = dayStatus(habit, dateKey);
          return (
            <span
              key={dateKey}
              title={`${dateKey}: ${status}`}
              className={`h-3 w-3 rounded-sm ${STATUS_CLASSES[status]}`}
            />
          );
        })}
      </div>
    </li>
  );
}
