import { test, expect, type Page } from "@playwright/test";

const MOCK_STATUS = {
  pnr_number: "2521703188",
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
  train_number: "20962",
  train_name: "BNRS UDN SF EXP",
  class: "2A",
  from_station: "BNRS",
  to_station: "UJN",
  journey_date: "2026-08-12T12:20:00Z",
  fare: 2040,
  vikalp_opted: false,
  confirmation_probability_percent: 62,
};

const MOCK_TRACKED = {
  id: "doc1",
  pnr_number: "2521703188",
  status: MOCK_STATUS,
  journey_date: MOCK_STATUS.journey_date,
  active: true,
  last_checked_at: "2026-08-01T00:00:00Z",
  created_at: "2026-08-01T00:00:00Z",
};

async function mockBackend(page: Page) {
  await page.route("**/api/pnr/check", (route) =>
    route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify(MOCK_STATUS) })
  );
  await page.route("**/api/pnr/track", (route) =>
    route.fulfill({ status: 201, contentType: "application/json", body: JSON.stringify(MOCK_TRACKED) })
  );
  let tracked = [MOCK_TRACKED];
  await page.route("**/api/pnr/tracked", (route) => {
    if (route.request().method() === "GET") {
      route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify(tracked) });
    } else {
      route.continue();
    }
  });
  await page.route("**/api/pnr/tracked/*", (route) => {
    if (route.request().method() === "DELETE") {
      tracked = [];
      route.fulfill({ status: 204 });
    } else {
      route.continue();
    }
  });
}

test.describe("check -> save -> dashboard -> remove flow", () => {
  test("lets a user check a PNR, save it, see it on the dashboard, and remove it", async ({
    page,
  }) => {
    await mockBackend(page);
    await page.goto("/");

    await page.getByLabel(/10-digit pnr number/i).fill("2521703188");
    await page.getByRole("button", { name: /track pnr/i }).click();

    await expect(page.getByText("BNRS UDN SF EXP")).toBeVisible();
    await expect(page.getByText("Waitlisted")).toBeVisible();
    await expect(page.getByRole("img", { name: /62 percent/i })).toBeVisible();

    await page.getByRole("button", { name: /save this pnr/i }).click();
    await expect(page.getByText(/saved to my pnrs/i)).toBeVisible();

    await page.goto("/dashboard");
    await expect(page.getByText("2521703188")).toBeVisible();

    await page.getByRole("button", { name: /remove pnr 2521703188/i }).click();
    await expect(page.getByText(/haven't saved any pnrs yet/i)).toBeVisible();
  });
});
