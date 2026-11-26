import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { KeyraLogo } from "@/components/common/keyra-logo";

describe("KeyraLogo", () => {
  it("renders default tight logo with proper alt text and link", () => {
    render(<KeyraLogo height={38} />);
    const img = screen.getByAltText("KEYRA - New Era of Finding Homes");
    expect(img).toBeInTheDocument();
    expect(img.getAttribute("src")).toContain("keyra-logo.png");
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/");
  });

  it("renders without link when href is null", () => {
    render(<KeyraLogo height={44} href={null} />);
    const img = screen.getByAltText("KEYRA - New Era of Finding Homes");
    expect(img).toBeInTheDocument();
    expect(screen.queryByRole("link")).toBeNull();
  });

  it("renders full variant correctly", () => {
    render(<KeyraLogo variant="full" height={50} />);
    const img = screen.getByAltText("KEYRA - New Era of Finding Homes");
    expect(img.getAttribute("src")).toContain("keyra-logo-full.png");
  });
});
