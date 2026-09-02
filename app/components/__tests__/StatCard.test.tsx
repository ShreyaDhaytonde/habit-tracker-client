import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import StatCard from "@/app/components/StatCard";

describe("StatCard", () => {
  it("renders its label and value", () => {
    render(<StatCard label="Best streak" value={7} />);

    expect(screen.getByText("Best streak")).toBeInTheDocument();
    expect(screen.getByText("7")).toBeInTheDocument();
  });

  it("renders a hint when one is given", () => {
    render(<StatCard label="Best streak" value={7} hint="days" />);

    expect(screen.getByText("days")).toBeInTheDocument();
  });

  it("omits the hint element when no hint is given", () => {
    render(<StatCard label="Habits" value={3} />);

    expect(screen.queryByText("days")).not.toBeInTheDocument();
  });
});
