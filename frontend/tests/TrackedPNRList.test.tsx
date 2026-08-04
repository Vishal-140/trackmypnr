import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TrackedPNRList } from "@/components/TrackedPNRList";
import type { TrackedPNR } from "@/lib/types";

const sampleItem: TrackedPNR = {
  id: "doc1",
  pnr_number: "2521703188",
  status: {
    pnr_number: "2521703188",
    chart_prepared: true,
    passengers: [
      {
        number: 1,
        current_status: "CNF",
        current_status_details: "CNF/HA1/2/UB",
      },
    ],
    train_name: "BNRS UDN SF EXP",
    vikalp_opted: false,
  },
  journey_date: "2026-08-12T12:20:00Z",
  active: true,
  last_checked_at: "2026-08-01T00:00:00Z",
  created_at: "2026-08-01T00:00:00Z",
};

describe("TrackedPNRList", () => {
  beforeEach(() => {
    Object.defineProperty(navigator, "clipboard", {
      value: { writeText: vi.fn().mockResolvedValue(undefined) },
      configurable: true,
      writable: true,
    });
  });

  it("shows an empty state when there are no tracked PNRs", () => {
    render(<TrackedPNRList items={[]} onRemove={vi.fn()} />);
    expect(screen.getByText(/haven't saved any pnrs yet/i)).toBeInTheDocument();
  });

  it("copies the PNR number to the clipboard and shows confirmation", async () => {
    render(<TrackedPNRList items={[sampleItem]} onRemove={vi.fn()} />);

    fireEvent.click(screen.getByRole("button", { name: /copy pnr 2521703188/i }));

    await waitFor(() =>
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith("2521703188")
    );
    await waitFor(() => expect(screen.getByText("Copied")).toBeInTheDocument());
  });

  it("calls onRemove with the item id when Remove is clicked", async () => {
    const onRemove = vi.fn().mockResolvedValue(undefined);
    render(<TrackedPNRList items={[sampleItem]} onRemove={onRemove} />);
    const user = userEvent.setup();

    await user.click(screen.getByRole("button", { name: /remove pnr 2521703188/i }));

    expect(onRemove).toHaveBeenCalledWith("doc1");
  });

  it("visually distinguishes past-journey (archived) PNRs", () => {
    render(
      <TrackedPNRList items={[{ ...sampleItem, active: false }]} onRemove={vi.fn()} />
    );
    expect(screen.getByText("Past journey")).toBeInTheDocument();
  });
});
