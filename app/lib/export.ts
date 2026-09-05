import type { Habit } from "@/app/types/HabitTypes";

const CSV_COLUMNS = [
  "id",
  "name",
  "category",
  "target_per_week",
  "notes",
  "archived",
  "streak",
  "completed_this_week",
  "completed_today",
  "at_risk",
  "completed_days",
] as const;

function csvCell(value: string | number | boolean | null): string {
  const text = value === null ? "" : String(value);
  if (/[",\n]/.test(text)) {
    return `"${text.replace(/"/g, '""')}"`;
  }
  return text;
}

export function habitsToCsv(habits: Habit[]): string {
  const rows = habits.map((habit) =>
    CSV_COLUMNS.map((column) => {
      if (column === "completed_days") {
        return csvCell(habit.completed_days.join(";"));
      }
      return csvCell(habit[column]);
    }).join(",")
  );
  return [CSV_COLUMNS.join(","), ...rows].join("\n");
}

export function habitsToJson(habits: Habit[]): string {
  return JSON.stringify(habits, null, 2);
}

export function downloadFile(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
