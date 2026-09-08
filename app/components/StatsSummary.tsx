import StatCard from "@/app/components/StatCard";
import { getCategoryBadgeClasses } from "@/app/lib/categoryColors";
import type { HabitStats } from "@/app/types/HabitTypes";

interface StatsSummaryProps {
  stats: HabitStats;
}

export default function StatsSummary({ stats }: StatsSummaryProps) {
  if (stats.total_habits === 0) {
    return (
      <p className="text-sm text-zinc-500">
        No habits tracked yet — add one on the home page and your stats will show up here.
      </p>
    );
  }

  const categories = Object.entries(stats.by_category);

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <StatCard label="Habits" value={stats.total_habits} />
        <StatCard
          label="Done today"
          value={`${stats.completed_today}/${stats.total_habits}`}
        />
        <StatCard label="Active streaks" value={stats.active_streaks} />
        <StatCard
          label="Best streak"
          value={stats.best_streak}
          hint={stats.best_streak === 1 ? "day" : "days"}
        />
        <StatCard label="Total completions" value={stats.total_completions} />
        <StatCard label="This week" value={`${stats.weekly_completion_rate}%`} hint="of target" />
      </div>

      <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/40">
        <h2 className="text-sm font-medium">Habits by category</h2>
        <ul className="mt-2 flex flex-col gap-1.5">
          {categories.map(([category, count]) => (
            <li key={category} className="flex items-center justify-between text-sm">
              <span
                className={`rounded-full px-2 py-0.5 text-xs font-medium ${getCategoryBadgeClasses(category)}`}
              >
                {category}
              </span>
              <span className="text-zinc-500">{count}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
