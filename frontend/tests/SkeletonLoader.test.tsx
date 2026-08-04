import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { SkeletonLoader } from "@/components/SkeletonLoader";

describe("SkeletonLoader", () => {
  it("renders an accessible loading status shaped like the result card", () => {
    render(<SkeletonLoader />);
    const status = screen.getByRole("status");
    expect(status).toHaveAttribute("aria-live", "polite");
    expect(screen.getByText(/fetching your pnr status/i)).toBeInTheDocument();
  });
});
