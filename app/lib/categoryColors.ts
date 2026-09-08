const CATEGORY_BADGE_CLASSES: Record<string, string> = {
  Health: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400",
  Work: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400",
  Personal: "bg-fuchsia-100 text-fuchsia-700 dark:bg-fuchsia-900/40 dark:text-fuchsia-400",
  Learning: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-400",
  General: "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300",
};

const DEFAULT_BADGE_CLASSES = CATEGORY_BADGE_CLASSES.General;

export function getCategoryBadgeClasses(category: string): string {
  return CATEGORY_BADGE_CLASSES[category] ?? DEFAULT_BADGE_CLASSES;
}
