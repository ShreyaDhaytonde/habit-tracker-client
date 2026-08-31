import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import HabitForm from "@/app/components/HabitForm";

describe("HabitForm", () => {
  it("submits the trimmed habit name with the default category and clears the input", async () => {
    const onCreate = vi.fn().mockResolvedValue(undefined);
    render(<HabitForm onCreate={onCreate} />);

    const input = screen.getByLabelText(/new habit name/i);
    await userEvent.type(input, "  Drink water  ");
    await userEvent.click(screen.getByRole("button", { name: /add habit/i }));

    expect(onCreate).toHaveBeenCalledWith("Drink water", "General");
    expect(input).toHaveValue("");
  });

  it("submits the category selected by the user", async () => {
    const onCreate = vi.fn().mockResolvedValue(undefined);
    render(<HabitForm onCreate={onCreate} />);

    await userEvent.type(screen.getByLabelText(/new habit name/i), "Run 5k");
    await userEvent.selectOptions(screen.getByLabelText(/habit category/i), "Health");
    await userEvent.click(screen.getByRole("button", { name: /add habit/i }));

    expect(onCreate).toHaveBeenCalledWith("Run 5k", "Health");
  });

  it("does not submit an empty or whitespace-only name", async () => {
    const onCreate = vi.fn();
    render(<HabitForm onCreate={onCreate} />);

    await userEvent.type(screen.getByLabelText(/new habit name/i), "   ");
    expect(screen.getByRole("button", { name: /add habit/i })).toBeDisabled();
    expect(onCreate).not.toHaveBeenCalled();
  });
});
