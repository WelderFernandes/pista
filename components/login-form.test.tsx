import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { LoginForm } from "./login-form";

// Mock next/navigation
vi.mock("next/navigation", () => ({
  useRouter: vi.fn(() => ({
    push: vi.fn(),
  })),
  usePathname: vi.fn(() => "/login"),
}));

// Mock tanstack/react-query
vi.mock("@tanstack/react-query", () => ({
  useMutation: vi.fn(() => ({
    mutate: vi.fn(),
    isPending: false,
  })),
}));

// Mock auth-client
vi.mock("@/lib/auth-client", () => ({
  signIn: {
    email: vi.fn(),
  },
  signUp: {
    email: vi.fn(),
  },
  authClient: {
    organization: {
      list: vi.fn(),
      setActive: vi.fn(),
    },
  },
}));

describe("LoginForm Prefill Flow", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should read name and email parameters from URL and prefill register fields", async () => {
    // Set mock search parameters
    const searchParamsStr = "?profile=instructor&name=Carlos+Silva&email=carlos%40exemplo.com";
    Object.defineProperty(window, "location", {
      writable: true,
      value: {
        search: searchParamsStr,
      },
    });

    render(<LoginForm />);

    // Wait for the useEffect and setTimeout to trigger state updates
    await waitFor(() => {
      // The signup header or subtext should be visible, confirming we switched to signup mode
      expect(screen.getByText(/Preencha as informações para registrar sua Autoescola./i)).toBeInTheDocument();
    });

    // Check if the inputs are prefilled with the mock parameters
    const nameInput = screen.getByLabelText(/Nome completo/i) as HTMLInputElement;
    const emailInput = screen.getByLabelText(/E-mail institucional/i) as HTMLInputElement;
    const orgInput = screen.getByLabelText(/Nome da Autoescola/i) as HTMLInputElement;

    expect(nameInput.value).toBe("Carlos Silva");
    expect(emailInput.value).toBe("carlos@exemplo.com");
    expect(orgInput.value).toBe("Aulas de Carlos Silva");
  });
});
