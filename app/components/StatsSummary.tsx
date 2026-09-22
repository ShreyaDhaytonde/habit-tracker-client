import StatCard from "@/app/components/StatCard";
import { getCategoryBadgeClasses, getCategoryBarClasses } from "@/app/lib/categoryColors";
import { getPriorityBadgeClasses, getPriorityBarClasses, getPriorityWeight } from "@/app/lib/priorityColors";
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

  const categories = Object.entries(stats.by_category).sort(([, a], [, b]) => b - a);
  const maxCategoryCount = Math.max(...categories.map(([, count]) => count));

  const priorities = Object.entries(stats.by_priority).sort(
    ([a], [b]) => getPriorityWeight(b) - getPriorityWeight(a)
  );
  const maxPriorityCount = Math.max(...priorities.map(([, count]) => count));

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
        <StatCard label="Pinned" value={stats.pinned_count} />
      </div>

      <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/40">
        <div className="flex items-center justify-between text-sm">
          <h2 className="font-medium">Weekly completion</h2>
          <span className="text-zinc-500">{stats.weekly_completion_rate}%</span>
        </div>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
          <div
            className="h-full rounded-full bg-emerald-500 transition-all duration-300"
            style={{ width: `${Math.min(100, stats.weekly_completion_rate)}%` }}
          />
        </div>
      </div>

      <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/40">
        <h2 className="text-sm font-medium">Habits by category</h2>
        <ul className="mt-3 flex flex-col gap-2.5">
          {categories.map(([category, count]) => (
            <li key={category} className="flex items-center gap-3 text-sm">
              <span
                className={`w-20 shrink-0 truncate rounded-full px-2 py-0.5 text-center text-xs font-medium ${getCategoryBadgeClasses(category)}`}
              >
                {category}
              </span>
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${getCategoryBarClasses(category)}`}
                  style={{ width: `${(count / maxCategoryCount) * 100}%` }}
                />
              </div>
              <span className="w-4 shrink-0 text-right text-zinc-500">{count}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/40">
        <h2 className="text-sm font-medium">Habits by priority</h2>
        <ul className="mt-3 flex flex-col gap-2.5">
          {priorities.map(([priority, count]) => (
            <li key={priority} className="flex items-center gap-3 text-sm">
              <span
                className={`w-20 shrink-0 truncate rounded-full px-2 py-0.5 text-center text-xs font-medium ${getPriorityBadgeClasses(priority)}`}
              >
                {priority}
              </span>
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${getPriorityBarClasses(priority)}`}
                  style={{ width: `${(count / maxPriorityCount) * 100}%` }}
                />
              </div>
              <span className="w-4 shrink-0 text-right text-zinc-500">{count}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
