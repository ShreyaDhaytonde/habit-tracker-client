export interface Habit {
  id: number;
  name: string;
  category: string;
  priority: string;
  target_per_week: number;
  notes: string | null;
  archived: boolean;
  pinned: boolean;
  completed_this_week: number;
  streak: number;
  longest_streak: number;
  completed_today: boolean;
  completed_days: string[];
  skipped_today: boolean;
  skipped_days: string[];
  at_risk: boolean;
}

export interface HabitStats {
  total_habits: number;
  completed_today: number;
  skipped_today: number;
  active_streaks: number;
  best_streak: number;
  total_completions: number;
  weekly_completion_rate: number;
  pinned_count: number;
  by_category: Record<string, number>;
  by_priority: Record<string, number>;
}

export const HABIT_CATEGORIES = ["General", "Health", "Work", "Personal", "Learning"] as const;

export const WEEKLY_TARGET_OPTIONS = [1, 2, 3, 4, 5, 6, 7] as const;

export const PRIORITY_LEVELS = ["Low", "Medium", "High"] as const;

export const STREAK_MILESTONES = [100, 30, 7] as const;

