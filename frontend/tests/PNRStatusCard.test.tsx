import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { PNRStatusCard } from "@/components/PNRStatusCard";
import type { NormalizedPNRStatus } from "@/lib/types";

const confirmedStatus: NormalizedPNRStatus = {
  pnr_number: "2521703188",
  chart_prepared: true,
  passengers: [
    {
      number: 1,
      current_status: "CNF",
      current_status_details: "CNF/HA1/2/UB",
      coach: "HA1",
      seat: "2",
      berth_code: "UB",
      quota: "GN",
      waitlist_type: 0,
    },
  ],
  train_number: "20962",
  train_name: "BNRS UDN SF EXP",
  vikalp_opted: false,
  confirmation_probability_percent: null,
};

const waitlistedStatus: NormalizedPNRStatus = {
  ...confirmedStatus,
  chart_prepared: false,
  passengers: [
    {
      number: 1,
      current_status: "WL",
      current_status_details: "WL/12",
      quota: "GNWL",
      waitlist_type: 12,
    },
  ],
  confirmation_probability_percent: 62,
};

describe("PNRStatusCard", () => {
  it("renders train and passenger details for a confirmed ticket", () => {
    render(<PNRStatusCard status={confirmedStatus} showSaveButton={false} />);
    expect(screen.getByText(/2521703188/)).toBeInTheDocument();
    expect(screen.getByText(/BNRS UDN SF EXP/)).toBeInTheDocument();
    expect(screen.getByText("Confirmed")).toBeInTheDocument();
  });

  it("does not show the confirmation gauge for a confirmed ticket", () => {
    render(<PNRStatusCard status={confirmedStatus} showSaveButton={false} />);
    expect(screen.queryByRole("img", { name: /confirmation probability/i })).not.toBeInTheDocument();
  });

  it("shows the confirmation probability gauge for a waitlisted ticket", () => {
    render(<PNRStatusCard status={waitlistedStatus} showSaveButton={false} />);
    expect(screen.getByRole("img", { name: /62 percent/i })).toBeInTheDocument();
    expect(screen.getByText(/not a guarantee/i)).toBeInTheDocument();
  });

  it("calls onSave when the save button is clicked", async () => {
    const onSave = vi.fn();
    render(<PNRStatusCard status={confirmedStatus} onSave={onSave} />);
    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: /save this pnr/i }));
    expect(onSave).toHaveBeenCalled();
  });
});
