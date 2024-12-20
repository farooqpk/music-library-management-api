import { z } from "zod";

export const getAlbumsSchema = z.object({
  limit: z.coerce.number().default(5).optional(),
  offset: z.coerce.number().default(0).optional(),
  artist_id: z.string().optional(),
  hidden: z.coerce.boolean().optional(),
});

export const addAlbumSchema = z.object({
  artist_id: z.string().describe("Artist ID of the album"),
  name: z.string().describe("Name of the album"),
  year: z.number().describe("Release year of the album"),
  hidden: z.boolean().describe("Visibility status of the album"),
});

export const updateAlbumSchema = z.object({
  name: z.string().describe("Name of the album"),
  year: z.number().describe("Release year of the album"),
  hidden: z.boolean().describe("Visibility status of the album"),
});

export type GetAlbumsSchemaType = z.infer<typeof getAlbumsSchema>;
export type AddAlbumSchemaType = z.infer<typeof addAlbumSchema>;
export type UpdateAlbumSchemaType = z.infer<typeof updateAlbumSchema>;
