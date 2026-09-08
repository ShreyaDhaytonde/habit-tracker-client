import type { HabitSortKey } from "@/app/lib/filterSort";

const STORAGE_KEY = "habit-tracker:view-prefs";
const SORT_KEYS: HabitSortKey[] = ["name", "streak", "category", "target_per_week"];

export interface ViewPrefs {
  categoryFilter: string;
  showArchived: boolean;
  searchQuery: string;
  sortBy: HabitSortKey;
}

export function loadViewPrefs(): Partial<ViewPrefs> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    const prefs: Partial<ViewPrefs> = {};
    if (typeof parsed.categoryFilter === "string") prefs.categoryFilter = parsed.categoryFilter;
    if (typeof parsed.showArchived === "boolean") prefs.showArchived = parsed.showArchived;
    if (typeof parsed.searchQuery === "string") prefs.searchQuery = parsed.searchQuery;
    if (SORT_KEYS.includes(parsed.sortBy)) prefs.sortBy = parsed.sortBy;
    return prefs;
  } catch {
    return {};
  }
}

export function saveViewPrefs(prefs: ViewPrefs): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
  } catch {
    // localStorage unavailable, preferences just won't persist across reloads
  }
}
