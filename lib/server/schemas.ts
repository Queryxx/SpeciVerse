import { z } from "zod";

export const credentialsSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters.").max(80),
  email: z.string().trim().email("Enter a valid email address.").max(120),
  password: z.string().min(8, "Password must be at least 8 characters.").max(72),
});

export const loginSchema = credentialsSchema.pick({ email: true, password: true });

export const createUserSchema = z
  .object({
    name: credentialsSchema.shape.name,
    email: credentialsSchema.shape.email,
    role: z.enum(["admin", "media"]),
    passwordMode: z.enum(["set", "generate"]),
    password: z.string().max(72).optional(),
  })
  .superRefine((value, context) => {
    if (value.passwordMode === "set" && (!value.password || value.password.length < 8)) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Password must be at least 8 characters.",
        path: ["password"],
      });
    }
  });

export const updateRoleSchema = z.object({
  role: z.enum(["admin", "media"]),
});

export const speciesTextSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters.").max(80),
  scientific: z.string().trim().min(2, "Scientific name must be at least 2 characters.").max(120),
  category: z.string().trim().min(1, "Choose a category."),
  region: z.string().trim().min(2, "Region must be at least 2 characters.").max(120),
  status: z.string().trim().min(1, "Choose a status."),
  introduction: z.string().trim().min(10, "Introduction must be at least 10 characters.").max(1200),
});
