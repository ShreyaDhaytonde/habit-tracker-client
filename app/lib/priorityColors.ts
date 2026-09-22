const PRIORITY_BADGE_CLASSES: Record<string, string> = {
  High: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400",
  Medium: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400",
  Low: "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300",
};

const DEFAULT_PRIORITY_BADGE_CLASSES = PRIORITY_BADGE_CLASSES.Medium;

export function getPriorityBadgeClasses(priority: string): string {
  return PRIORITY_BADGE_CLASSES[priority] ?? DEFAULT_PRIORITY_BADGE_CLASSES;
}

const PRIORITY_BAR_CLASSES: Record<string, string> = {
  High: "bg-red-500",
  Medium: "bg-amber-500",
  Low: "bg-zinc-400 dark:bg-zinc-500",
};

const DEFAULT_PRIORITY_BAR_CLASSES = PRIORITY_BAR_CLASSES.Medium;

export function getPriorityBarClasses(priority: string): string {
  return PRIORITY_BAR_CLASSES[priority] ?? DEFAULT_PRIORITY_BAR_CLASSES;
}

const PRIORITY_WEIGHT: Record<string, number> = { High: 3, Medium: 2, Low: 1 };

export function getPriorityWeight(priority: string): number {
  return PRIORITY_WEIGHT[priority] ?? 0;
}

const PRIORITY_CYCLE: Record<string, string> = { Low: "Medium", Medium: "High", High: "Low" };

export function nextPriority(priority: string): string {
  return PRIORITY_CYCLE[priority] ?? "Medium";
}
