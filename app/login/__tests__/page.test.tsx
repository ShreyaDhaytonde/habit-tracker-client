import { afterEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const pushMock = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: pushMock }),
}));

import LoginPage from "@/app/login/page";

function clearAuthCookie() {
  document.cookie = "habit_auth=; path=/; max-age=0";
}

describe("LoginPage", () => {
  afterEach(() => {
    pushMock.mockClear();
    clearAuthCookie();
  });

  it("renders name and password fields and a sign in button", () => {
    render(<LoginPage />);
    expect(screen.getByLabelText("Name")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Sign in" })).toBeInTheDocument();
  });

  it("shows an error and does not navigate on invalid credentials", async () => {
    render(<LoginPage />);
    await userEvent.type(screen.getByLabelText("Name"), "wrong");
    await userEvent.type(screen.getByLabelText("Password"), "wrong");
    await userEvent.click(screen.getByRole("button", { name: "Sign in" }));

    expect(screen.getByText("Invalid username or password.")).toBeInTheDocument();
    expect(pushMock).not.toHaveBeenCalled();
    expect(document.cookie).not.toContain("habit_auth=1");
  });

  it("sets the auth cookie and navigates home on valid credentials", async () => {
    render(<LoginPage />);
    await userEvent.type(screen.getByLabelText("Name"), "Shreya");
    await userEvent.type(screen.getByLabelText("Password"), "Shreya#23");
    await userEvent.click(screen.getByRole("button", { name: "Sign in" }));

    expect(document.cookie).toContain("habit_auth=1");
    expect(pushMock).toHaveBeenCalledWith("/");
  });
});
