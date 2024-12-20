import { Request, Response } from "express";
import {
  AddTrackSchemaType,
  GetTracksSchemaType,
  UpdateTrackSchemaType,
} from "../schemas/tracks.schema";
import { prisma } from "../lib/prisma";
import { IdSchemaType } from "../schemas/artists.schema";

export const getTracksController = async (
  req: Request<{}, {}, GetTracksSchemaType>,
  res: Response
) => {
  const limit = Number(req.query.limit) || 5;
  const offset = Number(req.query.offset) || 0;
  const hidden = Boolean(req.query.hidden);
  const artist_id = req.query.artist_id as string;
  const album_id = req.query.album_id as string;

  try {
    if (artist_id) {
      const artist_exists = await prisma.artist.findUnique({
        where: {
          id: artist_id,
        },
        select: {
          id: true,
        },
      });

      if (!artist_exists) {
        res.status(404).json({
          status: 404,
          data: null,
          message: "Artist not found.",
          error: null,
        });
        return;
      }
    }

    if (album_id) {
      const album_exists = await prisma.album.findUnique({
        where: {
          id: album_id,
        },
        select: {
          id: true,
        },
      });

      if (!album_exists) {
        res.status(404).json({
          status: 404,
          data: null,
          message: "Album not found.",
          error: null,
        });
        return;
      }
    }

    const tracks = await prisma.track.findMany({
      where: {
        ...(artist_id && { artist_id }),
        ...(album_id && { album_id }),
        ...(hidden && { hidden: hidden }),
      },
      take: limit,
      skip: offset,
      select: {
        id: true,
        name: true,
        duration: true,
        hidden: true,
        artist: {
          select: {
            name: true,
          },
        },
        album: {
          select: {
            name: true,
          },
        },
      },
    });

    const transformedTracks = tracks.map((track) => {
      return {
        track_id: track.id,
        artist_name: track.artist.name,
        album_name: track.album.name,
        name: track.name,
        duration: track.duration,
        hidden: track.hidden,
      };
    });

    res.status(200).json({
      status: 200,
      data: transformedTracks,
      message: "Tracks retrieved successfully.",
      error: null,
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      data: null,
      message: "Something went wrong.",
      error: error,
    });
  }
};

export const getTrackController = async (
  req: Request<IdSchemaType>,
  res: Response
) => {
  const id = req.params.id;

  try {
    const track = await prisma.track.findUnique({
      where: {
        id: id,
      },
      select: {
        id: true,
        name: true,
        duration: true,
        hidden: true,
        artist: {
          select: {
            name: true,
          },
        },
        album: {
          select: {
            name: true,
          },
        },
      },
    });

    if (!track) {
      res.status(404).json({
        status: 404,
        data: null,
        message: "Track not found.",
        error: null,
      });
      return;
    }

    const transformedTrack = {
      track_id: track.id,
      artist_name: track.artist.name,
      album_name: track.album.name,
      name: track.name,
      duration: track.duration,
      hidden: track.hidden,
    };

    res.status(200).json({
      status: 200,
      data: transformedTrack,
      message: "Track retrieved successfully.",
      error: null,
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      data: null,
      message: "Something went wrong.",
      error: error,
    });
  }
};

export const addTrackController = async (
  req: Request<{}, {}, AddTrackSchemaType>,
  res: Response
) => {
  const { artist_id, album_id, name, duration, hidden } = req.body;

  try {
    const artist_exists = await prisma.artist.findUnique({
      where: {
        id: artist_id,
      },
      select: {
        id: true,
      },
    });

    if (!artist_exists) {
      res.status(404).json({
        status: 404,
        data: null,
        message: "Artist not found.",
        error: null,
      });
      return;
    }

    const album_exists = await prisma.album.findUnique({
      where: {
        id: album_id,
      },
      select: {
        id: true,
      },
    });

    if (!album_exists) {
      res.status(404).json({
        status: 404,
        data: null,
        message: "Album not found.",
        error: null,
      });
      return;
    }

    await prisma.track.create({
      data: {
        artistId: artist_id,
        albumId: album_id,
        name: name,
        duration: duration,
        hidden: hidden,
      },
    });

    res.status(201).json({
      status: 201,
      data: null,
      message: "Track created successfully.",
      error: null,
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      data: null,
      message: "Something went wrong.",
      error: error,
    });
  }
};

export const updateTrackController = async (
  req: Request<IdSchemaType, {}, UpdateTrackSchemaType>,
  res: Response
) => {
  const id = req.params.id;
  const { name, duration, hidden } = req.body;

  try {
    const track = await prisma.track.findUnique({
      where: {
        id: id,
      },
      select: {
        id: true,
      },
    });

    if (!track) {
      res.status(404).json({
        status: 404,
        data: null,
        message: "Track not found.",
        error: null,
      });
      return;
    }

    await prisma.track.update({
      where: {
        id: id,
      },
      data: {
        name: name,
        duration: duration,
        hidden: hidden,
      },
    });

    res.status(204).json({
      status: 204,
      data: null,
      message: "Track updated successfully.",
      error: null,
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      data: null,
      message: "Something went wrong.",
      error: error,
    });
  }
};

export const deleteTrackController = async (
  req: Request<IdSchemaType>,
  res: Response
) => {
  const { id } = req.params;

  try {
    const track = await prisma.track.findUnique({
      where: {
        id: id,
      },
      select: {
        id: true,
        name: true,
      },
    });

    if (!track) {
      res.status(404).json({
        status: 404,
        data: null,
        message: "Track not found.",
        error: null,
      });
      return;
    }

    await prisma.track.delete({
      where: {
        id: id,
      },
    });

    res.status(200).json({
      status: 200,
      data: null,
      message: `Track:${track.name} deleted successfully.`,
      error: null,
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      data: null,
      message: "Something went wrong.",
      error: error,
    });
  }
};
