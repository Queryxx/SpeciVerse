import { mkdir, readFile, unlink, writeFile } from "node:fs/promises";
import path from "node:path";

import { speciesCategories, speciesStatuses, type UploadedSpecies } from "@/lib/auth/types";
import { StoreError } from "@/lib/server/errors";

type SpeciesDatabase = {
  species: UploadedSpecies[];
};

const databasePath = path.join(process.cwd(), "data", "db", "species.json");
const uploadDirectory = path.join(process.cwd(), "public", "uploads", "species");
const maxImageBytes = 5 * 1024 * 1024;

const imageExtensions = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
} as const;

let writeQueue = Promise.resolve();

function withLock<T>(task: () => Promise<T>) {
  const run = writeQueue.then(task, task);
  writeQueue = run.then(
    () => undefined,
    () => undefined,
  );
  return run;
}

async function readDatabase(): Promise<SpeciesDatabase> {
  try {
    const raw = await readFile(databasePath, "utf8");
    const parsed = JSON.parse(raw) as Partial<SpeciesDatabase>;
    return { species: Array.isArray(parsed.species) ? parsed.species : [] };
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return { species: [] };
    throw error;
  }
}

async function writeDatabase(database: SpeciesDatabase) {
  await mkdir(path.dirname(databasePath), { recursive: true });
  await writeFile(databasePath, JSON.stringify(database, null, 2));
}

export async function listSpecies() {
  const database = await readDatabase();
  return [...database.species].sort((left, right) => right.createdAt.localeCompare(left.createdAt));
}

export async function createSpecies(input: {
  name: string;
  scientific: string;
  category: UploadedSpecies["category"];
  region: string;
  status: UploadedSpecies["status"];
  introduction: string;
  image: File;
  createdBy: string;
  createdByName: string;
}) {
  const extension = imageExtensions[input.image.type as keyof typeof imageExtensions];
  if (!extension) throw new StoreError("Upload a JPG, PNG, or WebP image.", 400);
  if (input.image.size > maxImageBytes) throw new StoreError("Images must be 5 MB or smaller.", 400);

  return withLock(async () => {
    const id = crypto.randomUUID();
    const filename = `${id}${extension}`;
    await mkdir(uploadDirectory, { recursive: true });
    await writeFile(path.join(uploadDirectory, filename), Buffer.from(await input.image.arrayBuffer()));

    const record: UploadedSpecies = {
      id,
      name: input.name.trim(),
      scientific: input.scientific.trim(),
      category: input.category,
      region: input.region.trim(),
      status: input.status,
      introduction: input.introduction.trim(),
      image: `/uploads/species/${filename}`,
      createdAt: new Date().toISOString(),
      createdBy: input.createdBy,
      createdByName: input.createdByName,
    };

    const database = await readDatabase();
    database.species.push(record);
    await writeDatabase(database);
    return record;
  });
}

export async function deleteSpecies(id: string) {
  return withLock(async () => {
    const database = await readDatabase();
    const record = database.species.find((item) => item.id === id);
    if (!record) throw new StoreError("Species not found.", 404);

    database.species = database.species.filter((item) => item.id !== id);
    await writeDatabase(database);

    const filename = path.basename(record.image);
    await unlink(path.join(uploadDirectory, filename)).catch((error: NodeJS.ErrnoException) => {
      if (error.code !== "ENOENT") throw error;
    });
  });
}

export function isSpeciesCategory(value: string): value is UploadedSpecies["category"] {
  return speciesCategories.some((category) => category === value);
}

export function isSpeciesStatus(value: string): value is UploadedSpecies["status"] {
  return speciesStatuses.some((status) => status === value);
}
