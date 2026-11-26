import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { CategoryComingSoon } from "@/components/property/category-coming-soon";

describe("CategoryComingSoon", () => {
  it("renders Coliving Coming Soon view with appropriate titles and benefits", () => {
    render(<CategoryComingSoon category="COLIVING" />);

    expect(screen.getAllByText(/Coliving/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/Coming Soon to Pune West/i)).toBeInTheDocument();
    expect(screen.getByText(/100% Verified Flatmates/i)).toBeInTheDocument();
    expect(screen.getByText(/Browse 90\+ Live Residential Homes/i)).toBeInTheDocument();
  });

  it("renders Commercial Coming Soon view with appropriate titles and benefits", () => {
    render(<CategoryComingSoon category="COMMERCIAL" />);

    expect(screen.getAllByText(/Commercial/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/Coming Soon to Pune West/i)).toBeInTheDocument();
    expect(screen.getByText(/Tech Parks & Prime High Streets/i)).toBeInTheDocument();
    expect(screen.getByText(/Direct Owner Terms/i)).toBeInTheDocument();
  });

  it("allows user to submit waitlist notification input and shows success feedback", async () => {
    render(<CategoryComingSoon category="COLIVING" />);

    const input = screen.getByPlaceholderText(/Enter phone number or email/i);
    const submitBtn = screen.getByRole("button", { name: /Notify Me/i });

    fireEvent.change(input, { target: { value: "test@example.com" } });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText(/You're on the Priority Waitlist!/i)).toBeInTheDocument();
    });
  });
});
