import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import HabitList from "@/app/components/HabitList";
import { MOCK_HABITS } from "@/test/mock-data";

describe("HabitList", () => {
  it("shows an empty state when there are no habits", () => {
    render(<HabitList habits={[]} onComplete={vi.fn()} onDelete={vi.fn()} onEdit={vi.fn()} />);
    expect(screen.getByText(/no habits yet/i)).toBeInTheDocument();
  });

  it("renders one card per habit", () => {
    render(
      <HabitList habits={MOCK_HABITS} onComplete={vi.fn()} onDelete={vi.fn()} onEdit={vi.fn()} />
    );
    expect(screen.getByText("Drink water")).toBeInTheDocument();
    expect(screen.getByText("Read")).toBeInTheDocument();
  });

  it("shows a custom empty message when one is provided", () => {
    render(
      <HabitList
        habits={[]}
        onComplete={vi.fn()}
        onDelete={vi.fn()}
        onEdit={vi.fn()}
        emptyMessage='No habits in the "Health" category yet.'
      />
    );
    expect(screen.getByText('No habits in the "Health" category yet.')).toBeInTheDocument();
    expect(screen.queryByText(/no habits yet — add one above/i)).not.toBeInTheDocument();
  });
});
