import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import HistoryStrip from "@/app/components/HistoryStrip";
import { lastNDates } from "@/app/lib/history";
import { makeMockHabit } from "@/test/mock-data";

describe("HistoryStrip", () => {
  it("renders the habit name, category, and 28 day markers", () => {
    const habit = makeMockHabit({ name: "Meditate", category: "Health" });
    render(<HistoryStrip habit={habit} />);
    expect(screen.getByText("Meditate")).toBeInTheDocument();
    expect(screen.getByText("Health")).toBeInTheDocument();
    expect(screen.getByRole("img", { name: /meditate activity for the last 28 days/i })).toBeInTheDocument();
  });

  it("marks today as done when it is in completed_days", () => {
    const today = lastNDates(1)[0];
    const habit = makeMockHabit({ name: "Meditate", completed_days: [today] });
    render(<HistoryStrip habit={habit} />);
    expect(screen.getByTitle(`${today}: done`)).toBeInTheDocument();
  });
});
