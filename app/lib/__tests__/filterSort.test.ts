import { describe, expect, it } from "vitest";
import { filterHabitsByName, sortHabits } from "@/app/lib/filterSort";
import { makeMockHabit } from "@/test/mock-data";

describe("filterHabitsByName", () => {
  it("returns all habits when query is empty", () => {
    const habits = [makeMockHabit({ name: "Drink water" }), makeMockHabit({ name: "Read" })];
    expect(filterHabitsByName(habits, "")).toEqual(habits);
  });

  it("matches case-insensitively on a substring of the name", () => {
    const water = makeMockHabit({ id: 1, name: "Drink water" });
    const read = makeMockHabit({ id: 2, name: "Read" });
    expect(filterHabitsByName([water, read], "WATER")).toEqual([water]);
  });

  it("returns an empty list when nothing matches", () => {
    const habits = [makeMockHabit({ name: "Drink water" })];
    expect(filterHabitsByName(habits, "yoga")).toEqual([]);
  });
});

describe("sortHabits", () => {
  const a = makeMockHabit({ id: 1, name: "Zebra", category: "Health", streak: 1, target_per_week: 3 });
  const b = makeMockHabit({ id: 2, name: "Apple", category: "Work", streak: 5, target_per_week: 7 });

  it("sorts by name ascending", () => {
    expect(sortHabits([a, b], "name")).toEqual([b, a]);
  });

  it("sorts by streak descending", () => {
    expect(sortHabits([a, b], "streak")).toEqual([b, a]);
  });

  it("sorts by category ascending", () => {
    expect(sortHabits([a, b], "category")).toEqual([a, b]);
  });

  it("sorts by target_per_week descending", () => {
    expect(sortHabits([a, b], "target_per_week")).toEqual([b, a]);
  });

  it("does not mutate the original array", () => {
    const original = [a, b];
    sortHabits(original, "name");
    expect(original).toEqual([a, b]);
  });
});
