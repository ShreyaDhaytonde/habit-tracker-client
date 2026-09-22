import { getPriorityWeight } from "@/app/lib/priorityColors";
import type { Habit } from "@/app/types/HabitTypes";

export type HabitSortKey = "name" | "streak" | "category" | "target_per_week" | "priority";

export function filterHabitsByName(habits: Habit[], query: string): Habit[] {
  const trimmed = query.trim().toLowerCase();
  if (!trimmed) return habits;
  return habits.filter((habit) => habit.name.toLowerCase().includes(trimmed));
}

function sortByKey(habits: Habit[], sortBy: HabitSortKey): Habit[] {
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
    case "priority":
      return sorted.sort((a, b) => getPriorityWeight(b.priority) - getPriorityWeight(a.priority));
  }
}

// Pinned habits always float to the top, regardless of the chosen sort key --
// applied as a second, stable pass over the already-sorted list so ties (both
// pinned, or both unpinned) keep the order sortByKey gave them.
export function sortHabits(habits: Habit[], sortBy: HabitSortKey): Habit[] {
  return sortByKey(habits, sortBy).sort((a, b) => Number(b.pinned) - Number(a.pinned));
}
