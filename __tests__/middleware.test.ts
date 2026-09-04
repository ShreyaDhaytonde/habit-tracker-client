import { describe, expect, it } from "vitest";
import { NextRequest } from "next/server";
import { middleware } from "@/middleware";

function requestTo(path: string, cookie?: string) {
  return new NextRequest(new URL(path, "http://localhost:3000"), {
    headers: cookie ? { cookie } : undefined,
  });
}

describe("middleware", () => {
  it("redirects to /login when the auth cookie is missing", () => {
    const response = middleware(requestTo("/"));
    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toBe("http://localhost:3000/login");
  });

  it("redirects to /login when the auth cookie has the wrong value", () => {
    const response = middleware(requestTo("/", "habit_auth=0"));
    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toBe("http://localhost:3000/login");
  });

  it("passes the request through when the auth cookie is set", () => {
    const response = middleware(requestTo("/", "habit_auth=1"));
    expect(response.headers.get("location")).toBeNull();
  });
});
