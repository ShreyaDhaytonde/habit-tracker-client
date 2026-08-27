import type { Habit } from "@/app/types/HabitTypes";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", ...init?.headers },
  });
  if (!res.ok) {
    throw new Error(`Request to ${path} failed with status ${res.status}`);
  }
  if (res.status === 204) {
    return undefined as T;
  }
  return res.json() as Promise<T>;
}

export function listHabits(): Promise<Habit[]> {
  return request<Habit[]>("/habits");
}

export function createHabit(name: string): Promise<Habit> {
  return request<Habit>("/habits", {
    method: "POST",
    body: JSON.stringify({ name }),
  });
}

export function completeHabit(id: number): Promise<Habit> {
  return request<Habit>(`/habits/${id}/complete`, { method: "POST" });
}

export function deleteHabit(id: number): Promise<void> {
  return request<void>(`/habits/${id}`, { method: "DELETE" });
}
