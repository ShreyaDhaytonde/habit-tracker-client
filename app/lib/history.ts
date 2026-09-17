import type { Habit } from "@/app/types/HabitTypes";

export type DayStatus = "done" | "skipped" | "missed";

function toDateKey(d: Date): string {
  return d.toISOString().slice(0, 10);
}

export function lastNDates(n: number, today: Date = new Date()): string[] {
  const dates: string[] = [];
  for (let i = n - 1; i >= 0; i -= 1) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    dates.push(toDateKey(d));
  }
  return dates;
}

export function dayStatus(habit: Habit, dateKey: string): DayStatus {
  if (habit.completed_days.includes(dateKey)) return "done";
  if (habit.skipped_days.includes(dateKey)) return "skipped";
  return "missed";
}
