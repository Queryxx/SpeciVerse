import { requireApiUser } from "@/lib/server/api-auth";
import { toErrorResponse } from "@/lib/server/http";
import { deleteSpecies } from "@/lib/server/species-records";

type SpeciesRouteContext = {
  params: Promise<{ id: string }>;
};

export async function DELETE(_request: Request, context: SpeciesRouteContext) {
  const user = await requireApiUser();
  if (user instanceof Response) return user;

  try {
    const { id } = await context.params;
    await deleteSpecies(id);
    return Response.json({ ok: true });
  } catch (error) {
    return toErrorResponse(error);
  }
}
