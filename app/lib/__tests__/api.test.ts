import { afterEach, describe, expect, it, vi } from "vitest";
import { completeHabit, createHabit, deleteHabit, listCategories, listHabits } from "@/app/lib/api";
import { MOCK_HABITS, makeMockHabit } from "@/test/mock-data";

describe("habits api client", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("listHabits fetches and parses the habit list", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => MOCK_HABITS,
    });
    vi.stubGlobal("fetch", fetchMock);

    const result = await listHabits();

    expect(result).toEqual(MOCK_HABITS);
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining("/habits"),
      expect.objectContaining({ headers: expect.any(Object) })
    );
  });

  it("createHabit posts the name and category as JSON", async () => {
    const created = makeMockHabit({ id: 9, name: "Journal", category: "Personal" });
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 201,
      json: async () => created,
    });
    vi.stubGlobal("fetch", fetchMock);

    const result = await createHabit("Journal", "Personal");

    expect(result).toEqual(created);
    const [, init] = fetchMock.mock.calls[0];
    expect(init.method).toBe("POST");
    expect(JSON.parse(init.body)).toEqual({ name: "Journal", category: "Personal" });
  });

  it("listHabits includes the category as a query param when given", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => MOCK_HABITS,
    });
    vi.stubGlobal("fetch", fetchMock);

    await listHabits("Health");

    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining("/habits?category=Health"),
      expect.anything()
    );
  });

  it("listCategories fetches the distinct category list", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ["Health", "Learning"],
    });
    vi.stubGlobal("fetch", fetchMock);

    const result = await listCategories();

    expect(result).toEqual(["Health", "Learning"]);
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining("/habits/categories"),
      expect.anything()
    );
  });

  it("completeHabit posts to the complete endpoint", async () => {
    const updated = makeMockHabit({ id: 2, completed_today: true, streak: 1 });
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => updated,
    });
    vi.stubGlobal("fetch", fetchMock);

    const result = await completeHabit(2);

    expect(result).toEqual(updated);
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining("/habits/2/complete"),
      expect.objectContaining({ method: "POST" })
    );
  });

  it("deleteHabit issues a DELETE and resolves without a body", async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, status: 204 });
    vi.stubGlobal("fetch", fetchMock);

    await expect(deleteHabit(4)).resolves.toBeUndefined();
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining("/habits/4"),
      expect.objectContaining({ method: "DELETE" })
    );
  });

  it("throws when the response is not ok", async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: false, status: 500 });
    vi.stubGlobal("fetch", fetchMock);

    await expect(listHabits()).rejects.toThrow(/500/);
  });
});
