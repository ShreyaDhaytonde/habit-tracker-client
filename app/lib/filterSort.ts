import type { Habit } from "@/app/types/HabitTypes";

export type HabitSortKey = "name" | "streak" | "category" | "target_per_week";

export function filterHabitsByName(habits: Habit[], query: string): Habit[] {
  const trimmed = query.trim().toLowerCase();
  if (!trimmed) return habits;
  return habits.filter((habit) => habit.name.toLowerCase().includes(trimmed));
}

export function sortHabits(habits: Habit[], sortBy: HabitSortKey): Habit[] {
  const sorted = [...habits];
  switch (sortBy) {
    case "name":
      return sorted.sort((a, b) => a.name.localeCompare(b.name));
    case "streak":
      return sorted.sort((a, b) => b.streak - a.streak);
    case "category":
      return sorted.sort((a, b) => a.category.localeCompare(b.category));
    case "target_per_week":
      return sorted.sort((a, b) => b.target_per_week - a.target_per_week);
  }
}
