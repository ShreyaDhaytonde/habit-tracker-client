import { describe, expect, it } from "vitest";
import { getCategoryBadgeClasses } from "@/app/lib/categoryColors";

describe("getCategoryBadgeClasses", () => {
  it("returns a distinct class string for each known category", () => {
    const categories = ["Health", "Work", "Personal", "Learning", "General"];
    const classes = categories.map(getCategoryBadgeClasses);
    expect(new Set(classes).size).toBe(categories.length);
  });

  it("falls back to the General classes for an unrecognized category", () => {
    expect(getCategoryBadgeClasses("Some custom category")).toBe(
      getCategoryBadgeClasses("General")
    );
  });
});
