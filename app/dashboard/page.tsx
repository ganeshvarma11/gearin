import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { getDashboardProfile } from "@/lib/data";

export default async function DashboardPage() {
  const profile = await getDashboardProfile();

  return <DashboardShell initialProfile={profile} />;
}
