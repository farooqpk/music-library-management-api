import { z } from "zod";

export const getAlbumsSchema = z.object({
  limit: z.number().default(5).describe("Number of records to fetch"),
  offset: z.number().default(0).describe("Number of records to skip"),
  artist_id: z.string().describe("Filter albums by artist ID"),
  hidden: z.boolean().describe("Filter albums by visibility status"),
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
})

export type GetAlbumsSchemaType = z.infer<typeof getAlbumsSchema>;
export type AddAlbumSchemaType = z.infer<typeof addAlbumSchema>;
export type UpdateAlbumSchemaType = z.infer<typeof updateAlbumSchema>;
