import type { Habit } from "@/app/types/HabitTypes";

export function makeMockHabit(overrides: Partial<Habit> = {}): Habit {
  return {
    id: 1,
    name: "Drink water",
    streak: 0,
    completed_today: false,
    completed_days: [],
    ...overrides,
  };
}

export const MOCK_HABITS: Habit[] = [
  makeMockHabit({ id: 1, name: "Drink water", streak: 3, completed_today: true }),
  makeMockHabit({ id: 2, name: "Read", streak: 0, completed_today: false }),
];
