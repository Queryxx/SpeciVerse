import { DashboardHome } from "@/components/admin/dashboard-home";
import { requireUser } from "@/lib/server/current-user";
import { listSpecies } from "@/lib/server/species-records";
import { listUsers } from "@/lib/server/users";

export default async function AdminDashboardPage() {
  const user = await requireUser();
  const species = await listSpecies();
  const userCount = user.role === "admin" ? (await listUsers()).length : 0;

  return <DashboardHome user={user} userCount={userCount} species={species} />;
}
