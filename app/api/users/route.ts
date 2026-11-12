import { requireApiAdmin } from "@/lib/server/api-auth";
import { sendStaffPassword } from "@/lib/server/email";
import { jsonError, toErrorResponse } from "@/lib/server/http";
import { generatePassword } from "@/lib/server/passwords";
import { createUserSchema } from "@/lib/server/schemas";
import { createStaffUser, deleteUser, listUsers } from "@/lib/server/users";

export async function GET() {
  const admin = await requireApiAdmin();
  if (admin instanceof Response) return admin;

  try {
    const users = await listUsers();
    return Response.json({ users });
  } catch (error) {
    return toErrorResponse(error);
  }
}

export async function POST(request: Request) {
  const admin = await requireApiAdmin();
  if (admin instanceof Response) return admin;

  const body = await request.json().catch(() => null);
  const parsed = createUserSchema.safeParse(body);
  if (!parsed.success) return jsonError(parsed.error.issues[0]?.message ?? "Invalid user.", 400);

  const password = parsed.data.passwordMode === "generate" ? generatePassword() : parsed.data.password;
  if (!password) return jsonError("Password must be at least 8 characters.", 400);

  try {
    const user = await createStaffUser({
      name: parsed.data.name,
      email: parsed.data.email,
      role: parsed.data.role,
      password,
    });

    try {
      await sendStaffPassword({
        toEmail: user.email,
        toName: user.name,
        role: user.role,
        password,
        loginUrl: new URL("/auth/login", request.url).href,
      });
    } catch (error) {
      await deleteUser(admin.id, user.id).catch(() => undefined);
      throw error;
    }

    return Response.json({ user, emailSent: true }, { status: 201 });
  } catch (error) {
    return toErrorResponse(error);
  }
}
