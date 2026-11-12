import { requireApiUser } from "@/lib/server/api-auth";
import { jsonError, toErrorResponse } from "@/lib/server/http";
import { speciesTextSchema } from "@/lib/server/schemas";
import { createSpecies, isSpeciesCategory, isSpeciesStatus, listSpecies } from "@/lib/server/species-records";

export async function GET() {
  const user = await requireApiUser();
  if (user instanceof Response) return user;

  try {
    const species = await listSpecies();
    return Response.json({ species });
  } catch (error) {
    return toErrorResponse(error);
  }
}

export async function POST(request: Request) {
  const user = await requireApiUser();
  if (user instanceof Response) return user;

  const form = await request.formData().catch(() => null);
  if (!form) return jsonError("Upload a species record.", 400);

  const parsed = speciesTextSchema.safeParse({
    name: form.get("name"),
    scientific: form.get("scientific"),
    category: form.get("category"),
    region: form.get("region"),
    status: form.get("status"),
    introduction: form.get("introduction"),
  });
  if (!parsed.success) return jsonError(parsed.error.issues[0]?.message ?? "Invalid species.", 400);
  if (!isSpeciesCategory(parsed.data.category) || !isSpeciesStatus(parsed.data.status)) {
    return jsonError("Choose a valid category and status.", 400);
  }

  const image = form.get("image");
  if (!(image instanceof File) || image.size === 0) return jsonError("Choose an image to upload.", 400);

  try {
    const species = await createSpecies({
      name: parsed.data.name,
      scientific: parsed.data.scientific,
      category: parsed.data.category,
      region: parsed.data.region,
      status: parsed.data.status,
      introduction: parsed.data.introduction,
      image,
      createdBy: user.id,
      createdByName: user.name,
    });
    return Response.json({ species }, { status: 201 });
  } catch (error) {
    return toErrorResponse(error);
  }
}
