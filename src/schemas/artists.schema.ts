import { z } from "zod";

export const getArtistsSchema = z.object({
  limit: z.coerce.number().default(5).optional(),
  offset: z.coerce.number().default(0).optional(),
  grammy: z.coerce
    .number()
    .refine((val) => val === 0 || val === 10, {
      message: "Grammy filter must be either 0 or 10",
    })
    .optional(),
  hidden: z.boolean().optional(),
});

export const addArtistSchema = z.object({
  name: z.string(),
  grammy: z.number(),
  hidden: z.boolean(),
});

export const idSchema = z.object({
  id: z.string().uuid(),
});

export const updateArtistSchema = z.object({
  name: z.string().optional(),
  grammy: z.number().optional(),
  hidden: z.boolean().optional(),
});

export type GetArtistsSchemaType = z.infer<typeof getArtistsSchema>;
export type AddArtistSchemaType = z.infer<typeof addArtistSchema>;
export type UpdateArtistSchemaType = z.infer<typeof updateArtistSchema>;
export type IdSchemaType = z.infer<typeof idSchema>;
