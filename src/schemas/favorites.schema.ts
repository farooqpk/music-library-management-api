import { z } from "zod";

export const getFavoritesCategorySchema = z.object({
  category: z
    .enum(["artist", "album", "track"])
    .transform((val) => val.toUpperCase() as "ARTIST" | "ALBUM" | "TRACK"),
});

export const getFavoritesSchema = z.object({
  limit: z.coerce.number().default(5).optional(),
  offset: z.coerce.number().default(0).optional(),
});

export const addFavoriteSchema = z.object({
  category: z
    .enum(["artist", "album", "track"])
    .transform((val) => val.toUpperCase() as "ARTIST" | "ALBUM" | "TRACK"),
  item_id: z.string(),
});

export type GetFavoritesCategorySchemaType = z.infer<
  typeof getFavoritesCategorySchema
>;
export type GetFavoritesSchemaType = z.infer<typeof getFavoritesSchema>;
export type AddFavoriteSchemaType = z.infer<typeof addFavoriteSchema>;
