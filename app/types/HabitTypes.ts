export interface Habit {
  id: number;
  name: string;
  category: string;
  streak: number;
  completed_today: boolean;
  completed_days: string[];
}

export const HABIT_CATEGORIES = ["General", "Health", "Work", "Personal", "Learning"] as const;

