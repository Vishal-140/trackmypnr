import type { Metadata } from "next";
import { DashboardView } from "@/components/DashboardView";

export const metadata: Metadata = {
  title: "My PNRs",
  description: "Your saved PNRs and their status history.",
  robots: { index: false, follow: false },
};

export default function DashboardPage() {
  return <DashboardView />;
}
