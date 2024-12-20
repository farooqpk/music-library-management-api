import { z } from "zod";

export const getTracksSchema = z.object({
  limit: z.coerce.number().default(5).optional(),
  offset: z.coerce.number().default(0).optional(),
  artist_id: z.string().optional(),
  album_id: z.string().optional(),
  hidden: z.boolean().optional(),
});

export const addTrackSchema = z.object({
  artist_id: z.string(),
  album_id: z.string(),
  name: z.string(),
  duration: z.number(),
  hidden: z.boolean(),
});


export const updateTrackSchema = z.object({
  name: z.string().optional(),
  duration: z.number().optional(),
  hidden: z.boolean().optional()
})

export type GetTracksSchemaType = z.infer<typeof getTracksSchema>;
export type AddTrackSchemaType = z.infer<typeof addTrackSchema>;
export type UpdateTrackSchemaType = z.infer<typeof updateTrackSchema>;
