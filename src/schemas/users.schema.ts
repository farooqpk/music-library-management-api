import { z } from "zod";

export const getUsersSchema = z.object({
  limit: z.coerce.number().optional().default(5),
  offset: z.coerce.number().optional().default(0),
  role: z
    .enum(["editor", "viewer"])
    .transform((val) => val.toUpperCase() as "EDITOR" | "VIEWER")
    .optional(),
});

export const addUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  role: z
    .enum(["editor", "viewer"])
    .transform((val) => val.toUpperCase() as "EDITOR" | "VIEWER")
    .optional(),
});

export const deleteUserSchema = z.object({
  id: z.string().uuid(),
});

export const updatePasswordSchema = z.object({
  old_password: z.string().min(8),
  new_password: z.string().min(8),
});

export type GetUsersSchemaType = z.infer<typeof getUsersSchema>;
export type AddUserSchemaType = z.infer<typeof addUserSchema>;
export type DeleteUserSchemaType = z.infer<typeof deleteUserSchema>;
export type UpdatePasswordSchemaType = z.infer<typeof updatePasswordSchema>;
