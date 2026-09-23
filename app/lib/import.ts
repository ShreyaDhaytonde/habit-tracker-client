import { HABIT_CATEGORIES, PRIORITY_LEVELS, WEEKLY_TARGET_OPTIONS } from "@/app/types/HabitTypes";

export interface ImportedHabit {
  name: string;
  category: string;
  target_per_week: number;
  notes?: string;
  priority?: string;
}

export interface ParseResult {
  habits: ImportedHabit[];
  skipped: number;
}

// Mirrors the quoting rules csvCell (export.ts) writes: a field is quoted
// only when it contains a comma, quote, or newline, and embedded quotes are
// doubled. Parsing it back out needs a small state machine rather than a
// split(",") because those embedded commas/newlines are meaningful.
function parseCsvRows(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (inQuotes) {
      if (char === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        field += char;
      }
    } else if (char === '"') {
      inQuotes = true;
    } else if (char === ",") {
      row.push(field);
      field = "";
    } else if (char === "\n" || char === "\r") {
      if (char === "\r" && text[i + 1] === "\n") i++;
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else {
      field += char;
    }
  }
  if (field !== "" || row.length > 0) {
    row.push(field);
    rows.push(row);
  }

  return rows.filter((cells) => cells.some((cell) => cell.trim() !== ""));
}

// Reads whichever of name/category/target_per_week/notes/priority columns
// are present, by header name rather than position -- so both a hand-written
// minimal CSV and a full habits.csv from "Export CSV" (which also carries
// id/streak/completed_days/...) import cleanly, ignoring the extra columns.
export function parseHabitsCsv(text: string): ParseResult {
  const rows = parseCsvRows(text);
  if (rows.length === 0) return { habits: [], skipped: 0 };

  const header = rows[0].map((cell) => cell.trim().toLowerCase());
  const nameIdx = header.indexOf("name");
  if (nameIdx === -1) return { habits: [], skipped: rows.length - 1 };

  const categoryIdx = header.indexOf("category");
  const targetIdx = header.indexOf("target_per_week");
  const notesIdx = header.indexOf("notes");
  const priorityIdx = header.indexOf("priority");

  const habits: ImportedHabit[] = [];
  let skipped = 0;

  for (const row of rows.slice(1)) {
    const name = row[nameIdx]?.trim();
    if (!name) {
      skipped++;
      continue;
    }

    const rawCategory = categoryIdx >= 0 ? row[categoryIdx]?.trim() : undefined;
    const category = (HABIT_CATEGORIES as readonly string[]).includes(rawCategory ?? "")
      ? (rawCategory as string)
      : HABIT_CATEGORIES[0];

    const rawTarget = targetIdx >= 0 ? Number(row[targetIdx]) : NaN;
    const target_per_week = (WEEKLY_TARGET_OPTIONS as readonly number[]).includes(rawTarget)
      ? rawTarget
      : 7;

    const rawPriority = priorityIdx >= 0 ? row[priorityIdx]?.trim() : undefined;
    const priority = (PRIORITY_LEVELS as readonly string[]).includes(rawPriority ?? "")
      ? rawPriority
      : undefined;

    const notes = notesIdx >= 0 ? row[notesIdx]?.trim() || undefined : undefined;

    habits.push({ name, category, target_per_week, notes, priority });
  }

  return { habits, skipped };
}
