import type { Habit, HabitStats } from "@/app/types/HabitTypes";

export function makeMockHabit(overrides: Partial<Habit> = {}): Habit {
  return {
    id: 1,
    name: "Drink water",
    category: "General",
    priority: "Medium",
    target_per_week: 7,
    notes: null,
    archived: false,
    pinned: false,
    completed_this_week: 0,
    streak: 0,
    longest_streak: 0,
    completed_today: false,
    completed_days: [],
    skipped_today: false,
    skipped_days: [],
    at_risk: false,
    ...overrides,
  };
}

export function makeMockStats(overrides: Partial<HabitStats> = {}): HabitStats {
  return {
    total_habits: 3,
    completed_today: 2,
    skipped_today: 0,
    active_streaks: 2,
    best_streak: 5,
    total_completions: 12,
    weekly_completion_rate: 60,
    pinned_count: 0,
    by_category: { Health: 2, Learning: 1 },
    by_priority: { Medium: 2, High: 1 },
    ...overrides,
  };
}

export const MOCK_HABITS: Habit[] = [
  makeMockHabit({ id: 1, name: "Drink water", streak: 3, completed_today: true }),
  makeMockHabit({ id: 2, name: "Read", streak: 0, completed_today: false }),
];
