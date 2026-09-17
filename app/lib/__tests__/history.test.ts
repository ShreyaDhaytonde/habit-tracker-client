import { describe, expect, it } from "vitest";
import { dayStatus, lastNDates } from "@/app/lib/history";
import { makeMockHabit } from "@/test/mock-data";

describe("lastNDates", () => {
  it("returns n dates ending on the given day, oldest first", () => {
    const today = new Date("2026-03-10T12:00:00Z");
    const dates = lastNDates(3, today);
    expect(dates).toEqual(["2026-03-08", "2026-03-09", "2026-03-10"]);
  });
});

describe("dayStatus", () => {
  it("returns done when the date is in completed_days", () => {
    const habit = makeMockHabit({ completed_days: ["2026-03-10"], skipped_days: [] });
    expect(dayStatus(habit, "2026-03-10")).toBe("done");
  });

  it("returns skipped when the date is in skipped_days", () => {
    const habit = makeMockHabit({ completed_days: [], skipped_days: ["2026-03-10"] });
    expect(dayStatus(habit, "2026-03-10")).toBe("skipped");
  });

  it("returns missed when the date is in neither list", () => {
    const habit = makeMockHabit({ completed_days: [], skipped_days: [] });
    expect(dayStatus(habit, "2026-03-10")).toBe("missed");
  });

  it("prefers done over skipped when a date is somehow in both", () => {
    const habit = makeMockHabit({ completed_days: ["2026-03-10"], skipped_days: ["2026-03-10"] });
    expect(dayStatus(habit, "2026-03-10")).toBe("done");
  });
});
