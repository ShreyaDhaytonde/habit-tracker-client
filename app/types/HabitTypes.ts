export interface Habit {
  id: number;
  name: string;
  category: string;
  target_per_week: number;
  completed_this_week: number;
  streak: number;
  completed_today: boolean;
  completed_days: string[];
}

export interface HabitStats {
  total_habits: number;
  completed_today: number;
  active_streaks: number;
  best_streak: number;
  total_completions: number;
  weekly_completion_rate: number;
  by_category: Record<string, number>;
}

export const HABIT_CATEGORIES = ["General", "Health", "Work", "Personal", "Learning"] as const;

export const WEEKLY_TARGET_OPTIONS = [1, 2, 3, 4, 5, 6, 7] as const;

