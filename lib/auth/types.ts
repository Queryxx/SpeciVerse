export const roles = ["admin", "media"] as const;
export type Role = (typeof roles)[number];

export const speciesCategories = ["Mammals", "Insects", "Reptiles", "Birds", "Plants", "Other"] as const;
export const speciesStatuses = ["Least concern", "Vulnerable", "Endangered"] as const;

export type PublicUser = {
  id: string;
  name: string;
  email: string;
  role: Role;
  createdAt: string;
};

export type UploadedSpecies = {
  id: string;
  name: string;
  scientific: string;
  category: (typeof speciesCategories)[number];
  region: string;
  status: (typeof speciesStatuses)[number];
  introduction: string;
  image: string;
  createdAt: string;
  createdBy: string;
  createdByName: string;
};

export function roleLabel(role: Role) {
  return role === "admin" ? "Administrator" : "Media manager";
}

export function safeNextPath(value: string | undefined) {
  if (!value || !value.startsWith("/admin") || value.startsWith("//") || value.includes("\\")) {
    return "/admin";
  }
  return value;
}
