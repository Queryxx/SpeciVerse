import { requireApiAdmin } from "@/lib/server/api-auth";
import { jsonError, toErrorResponse } from "@/lib/server/http";
import { updateRoleSchema } from "@/lib/server/schemas";
import { deleteUser, updateUserRole } from "@/lib/server/users";

type UserRouteContext = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: Request, context: UserRouteContext) {
  const admin = await requireApiAdmin();
  if (admin instanceof Response) return admin;

  const body = await request.json().catch(() => null);
  const parsed = updateRoleSchema.safeParse(body);
  if (!parsed.success) return jsonError(parsed.error.issues[0]?.message ?? "Invalid role.", 400);

  try {
    const { id } = await context.params;
    const user = await updateUserRole(admin.id, id, parsed.data.role);
    return Response.json({ user });
  } catch (error) {
    return toErrorResponse(error);
  }
}

export async function DELETE(_request: Request, context: UserRouteContext) {
  const admin = await requireApiAdmin();
  if (admin instanceof Response) return admin;

  try {
    const { id } = await context.params;
    await deleteUser(admin.id, id);
    return Response.json({ ok: true });
  } catch (error) {
    return toErrorResponse(error);
  }
}
