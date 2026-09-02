import { afterEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import HabitCard from "@/app/components/HabitCard";
import { makeMockHabit } from "@/test/mock-data";

describe("HabitCard", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

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

  it("shows weekly progress toward the habit's target", () => {
    render(
      <HabitCard
        habit={makeMockHabit({
          name: "Run",
          target_per_week: 3,
          completed_this_week: 2,
        })}
        onComplete={vi.fn()}
        onDelete={vi.fn()}
      />
    );
    expect(screen.getByText("2/3 this week")).toBeInTheDocument();
    const bar = screen.getByRole("progressbar", { name: /run weekly progress/i });
    expect(bar).toHaveAttribute("aria-valuenow", "2");
    expect(bar).toHaveAttribute("aria-valuemax", "3");
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

  it("calls onDelete with the habit id once the user confirms", async () => {
    vi.spyOn(window, "confirm").mockReturnValue(true);
    const onDelete = vi.fn();
    render(
      <HabitCard
        habit={makeMockHabit({ id: 3, name: "Stretch" })}
        onComplete={vi.fn()}
        onDelete={onDelete}
      />
    );
    await userEvent.click(screen.getByRole("button", { name: /delete stretch/i }));
    expect(window.confirm).toHaveBeenCalledWith(expect.stringContaining("Stretch"));
    expect(onDelete).toHaveBeenCalledWith(3);
  });

  it("does not call onDelete when the user cancels the confirmation", async () => {
    vi.spyOn(window, "confirm").mockReturnValue(false);
    const onDelete = vi.fn();
    render(
      <HabitCard
        habit={makeMockHabit({ id: 3, name: "Stretch" })}
        onComplete={vi.fn()}
        onDelete={onDelete}
      />
    );
    await userEvent.click(screen.getByRole("button", { name: /delete stretch/i }));
    expect(onDelete).not.toHaveBeenCalled();
  });
});
