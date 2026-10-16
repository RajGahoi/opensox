import DashboardPageContent from "@/components/dashboard/DashboardPageContent";
import { NOINDEX_METADATA } from "@/lib/noindex";

export const metadata = NOINDEX_METADATA;

export default function Dashboard() {
  return <DashboardPageContent />;
}
