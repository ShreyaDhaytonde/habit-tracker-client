import { beforeEach, describe, expect, it } from "vitest";
import { loadViewPrefs, saveViewPrefs } from "@/app/lib/viewPrefs";

describe("viewPrefs", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("returns an empty object when nothing has been saved", () => {
    expect(loadViewPrefs()).toEqual({});
  });

  it("round-trips saved preferences", () => {
    saveViewPrefs({
      categoryFilter: "Health",
      showArchived: true,
      searchQuery: "water",
      sortBy: "streak",
    });

    expect(loadViewPrefs()).toEqual({
      categoryFilter: "Health",
      showArchived: true,
      searchQuery: "water",
      sortBy: "streak",
    });
  });

  it("ignores malformed JSON instead of throwing", () => {
    localStorage.setItem("habit-tracker:view-prefs", "{not json");
    expect(loadViewPrefs()).toEqual({});
  });

  it("drops fields with the wrong type or an unrecognized sort key", () => {
    localStorage.setItem(
      "habit-tracker:view-prefs",
      JSON.stringify({ categoryFilter: 42, showArchived: "yes", sortBy: "bogus" })
    );
    expect(loadViewPrefs()).toEqual({});
  });
});
