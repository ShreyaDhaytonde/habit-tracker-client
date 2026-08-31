import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import HabitCard from "@/app/components/HabitCard";
import { makeMockHabit } from "@/test/mock-data";

describe("HabitCard", () => {
  it("renders the habit name, category, and streak", () => {
    render(
      <HabitCard
        habit={makeMockHabit({ name: "Meditate", category: "Health", streak: 5 })}
        onComplete={vi.fn()}
        onDelete={vi.fn()}
      />
    );
    expect(screen.getByText("Meditate")).toBeInTheDocument();
    expect(screen.getByText("Health")).toBeInTheDocument();
    expect(screen.getByText(/5 days streak/)).toBeInTheDocument();
  });

  it("calls onComplete with the habit id when marking done", async () => {
    const onComplete = vi.fn();
    render(
      <HabitCard
        habit={makeMockHabit({ id: 7, completed_today: false })}
        onComplete={onComplete}
        onDelete={vi.fn()}
      />
    );
    await userEvent.click(screen.getByRole("button", { name: /mark done/i }));
    expect(onComplete).toHaveBeenCalledWith(7);
  });

  it("disables the button once already completed today", () => {
    render(
      <HabitCard
        habit={makeMockHabit({ completed_today: true })}
        onComplete={vi.fn()}
        onDelete={vi.fn()}
      />
    );
    expect(screen.getByRole("button", { name: /done today/i })).toBeDisabled();
  });

  it("calls onDelete with the habit id", async () => {
    const onDelete = vi.fn();
    render(
      <HabitCard
        habit={makeMockHabit({ id: 3, name: "Stretch" })}
        onComplete={vi.fn()}
        onDelete={onDelete}
      />
    );
    await userEvent.click(screen.getByRole("button", { name: /delete stretch/i }));
    expect(onDelete).toHaveBeenCalledWith(3);
  });
});
