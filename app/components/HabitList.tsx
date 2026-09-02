import type { Habit } from "@/app/types/HabitTypes";
import HabitCard from "@/app/components/HabitCard";

interface HabitListProps {
  habits: Habit[];
  onComplete: (id: number) => void;
  onDelete: (id: number) => void;
  emptyMessage?: string;
}

export default function HabitList({
  habits,
  onComplete,
  onDelete,
  emptyMessage = "No habits yet — add one above to get started.",
}: HabitListProps) {
  if (habits.length === 0) {
    return <p className="text-sm text-zinc-500">{emptyMessage}</p>;
  }

  return (
    <ul className="flex flex-col gap-2">
      {habits.map((habit) => (
        <HabitCard key={habit.id} habit={habit} onComplete={onComplete} onDelete={onDelete} />
      ))}
    </ul>
  );
}
