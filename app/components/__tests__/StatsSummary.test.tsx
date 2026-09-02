import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import StatsSummary from "@/app/components/StatsSummary";
import { makeMockStats } from "@/test/mock-data";

describe("StatsSummary", () => {
  it("renders each headline stat", () => {
    render(<StatsSummary stats={makeMockStats()} />);

    expect(screen.getByText("Habits").nextElementSibling).toHaveTextContent("3");
    expect(screen.getByText("Done today").nextElementSibling).toHaveTextContent("2/3");
    expect(screen.getByText("Active streaks").nextElementSibling).toHaveTextContent("2");
    expect(screen.getByText("Best streak").nextElementSibling).toHaveTextContent("5");
    expect(screen.getByText("Total completions").nextElementSibling).toHaveTextContent("12");
    expect(screen.getByText("This week").nextElementSibling).toHaveTextContent("60%");
  });

  it("lists the per-category breakdown", () => {
    render(<StatsSummary stats={makeMockStats()} />);

    expect(screen.getByText("Habits by category")).toBeInTheDocument();
    expect(screen.getByText("Health")).toBeInTheDocument();
    expect(screen.getByText("Learning")).toBeInTheDocument();
  });

  it("shows an empty state when no habits are tracked", () => {
    render(<StatsSummary stats={makeMockStats({ total_habits: 0, by_category: {} })} />);

    expect(screen.getByText(/no habits tracked yet/i)).toBeInTheDocument();
    expect(screen.queryByText("Habits by category")).not.toBeInTheDocument();
  });

  it("labels a one-day best streak in the singular", () => {
    render(<StatsSummary stats={makeMockStats({ best_streak: 1 })} />);

    expect(screen.getByText("day")).toBeInTheDocument();
  });
});
