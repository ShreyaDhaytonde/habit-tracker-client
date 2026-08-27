import type { Habit } from "@/app/types/HabitTypes";
import HabitCard from "@/app/components/HabitCard";

interface HabitListProps {
  habits: Habit[];
  onComplete: (id: number) => void;
  onDelete: (id: number) => void;
}

export default function HabitList({ habits, onComplete, onDelete }: HabitListProps) {
  if (habits.length === 0) {
    return <p className="text-sm text-zinc-500">No habits yet — add one above to get started.</p>;
  }

  return (
    <ul className="flex flex-col gap-2">
      {habits.map((habit) => (
        <HabitCard key={habit.id} habit={habit} onComplete={onComplete} onDelete={onDelete} />
      ))}
    </ul>
  );
}
