export interface Habit {
  id: number;
  name: string;
  streak: number;
  completed_today: boolean;
  completed_days: string[];
}
