const STORAGE_KEY = "habit-tracker:default-weekly-target";

export function loadDefaultWeeklyTarget(): number | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const n = raw ? Number(raw) : NaN;
    return Number.isInteger(n) && n >= 1 && n <= 7 ? n : null;
  } catch {
    return null;
  }
}

export function saveDefaultWeeklyTarget(n: number): void {
  try {
    localStorage.setItem(STORAGE_KEY, String(n));
  } catch {
    // localStorage unavailable, preference just won't persist across reloads
  }
}
