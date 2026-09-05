import { describe, expect, it } from "vitest";
import { habitsToCsv, habitsToJson } from "@/app/lib/export";
import { makeMockHabit } from "@/test/mock-data";

describe("habitsToJson", () => {
  it("serializes the exact habit list", () => {
    const habits = [makeMockHabit({ id: 1, name: "Run" })];
    const parsed = JSON.parse(habitsToJson(habits));
    expect(parsed).toEqual(habits);
  });
});

describe("habitsToCsv", () => {
  it("includes a header row naming every field", () => {
    const csv = habitsToCsv([]);
    expect(csv).toBe(
      "id,name,category,target_per_week,notes,archived,streak,completed_this_week," +
        "completed_today,at_risk,completed_days"
    );
  });

  it("writes one row per habit with the real field values", () => {
    const habit = makeMockHabit({
      id: 1,
      name: "Run",
      category: "Health",
      target_per_week: 3,
      notes: "morning jog",
      archived: false,
      streak: 5,
      completed_this_week: 2,
      completed_today: true,
      at_risk: false,
      completed_days: ["2026-09-01", "2026-09-03"],
    });

    const rows = habitsToCsv([habit]).split("\n");

    expect(rows).toHaveLength(2);
    expect(rows[1]).toBe(
      "1,Run,Health,3,morning jog,false,5,2,true,false,2026-09-01;2026-09-03"
    );
  });

  it("quotes a field containing a comma", () => {
    const habit = makeMockHabit({ name: "Run, but slowly" });
    const rows = habitsToCsv([habit]).split("\n");
    expect(rows[1]).toContain('"Run, but slowly"');
  });

  it("escapes a field containing a double quote", () => {
    const habit = makeMockHabit({ notes: 'say "hi"' });
    const rows = habitsToCsv([habit]).split("\n");
    expect(rows[1]).toContain('"say ""hi"""');
  });

  it("renders a null notes field as an empty cell, not the string null", () => {
    const habit = makeMockHabit({ notes: null });
    const rows = habitsToCsv([habit]).split("\n");
    const cells = rows[1].split(",");
    expect(cells[4]).toBe("");
  });

  it("writes only the header when there are no habits", () => {
    expect(habitsToCsv([]).split("\n")).toHaveLength(1);
  });
});
