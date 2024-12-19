import { z } from "zod";

export const getUsersSchema = z.object({
  limit: z.coerce.number().optional().default(5),
  offset: z.coerce.number().optional().default(0),
  role: z.enum(["EDITOR", "VIEWER"]).optional(),
});

export const addUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  role: z.enum(["EDITOR", "VIEWER"]),
});

export type GetUsersSchemaType = z.infer<typeof getUsersSchema>;
export type AddUserSchemaType = z.infer<typeof addUserSchema>;
