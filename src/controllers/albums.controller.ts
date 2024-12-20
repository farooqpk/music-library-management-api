import { Request, Response } from "express";
import {
  AddAlbumSchemaType,
  GetAlbumsSchemaType,
  UpdateAlbumSchemaType,
} from "../schemas/albums.schema";
import { prisma } from "../lib/prisma";
import { IdSchemaType } from "../schemas/artists.schema";

export const getAlbumsController = async (
  req: Request<{}, {}, GetAlbumsSchemaType>,
  res: Response
) => {
  const limit = Number(req.query?.limit) || 5;
  const offset = Number(req.query?.offset) || 0;
  const artist_id = req.query?.artist_id as string;
  const hidden = Boolean(req.query?.hidden);
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

    const albums = await prisma.album.findMany({
      where: {
        ...(artist_id && { artist_id }),
        ...(hidden && { hidden: hidden }),
      },
      take: limit,
      skip: offset,
      select: {
        id: true,
        name: true,
        year: true,
        hidden: true,
        artist: {
          select: {
            name: true,
          },
        },
      },
    });

    const transformedAlbums = albums.map((album) => ({
      album_id: album.id,
      artist_name: album.artist.name,
      name: album.name,
      year: album.year,
      hidden: album.hidden,
    }));

    res.status(200).json({
      status: 200,
      data: transformedAlbums,
      message: "Albums retrieved successfully.",
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

export const getAlbumController = async (
  req: Request<IdSchemaType>,
  res: Response
) => {
  const { id } = req.params;

  try {
    const album = await prisma.album.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        name: true,
        year: true,
        hidden: true,
        artist: {
          select: {
            name: true,
          },
        },
      },
    });

    if (!album) {
      res.status(404).json({
        status: 404,
        data: null,
        message: "Album not found.",
        error: null,
      });
      return;
    }

    res.status(200).json({
      status: 200,
      data: {
        album_id: album.id,
        artist_name: album.artist.name,
        name: album.name,
        year: album.year,
        hidden: album.hidden,
      },
      message: "Album retrieved successfully.",
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

export const addAlbumController = async (
  req: Request<{}, {}, AddAlbumSchemaType>,
  res: Response
) => {
  const { artist_id, name, year, hidden } = req.body;

  try {
    const is_artist_exists = await prisma.artist.findUnique({
      where: {
        id: artist_id,
      },
      select: {
        id: true,
      },
    });

    if (!is_artist_exists) {
      res.status(404).json({
        status: 404,
        data: null,
        message: "Artist not found.",
        error: null,
      });
      return;
    }

    await prisma.album.create({
      data: {
        artistId: artist_id,
        name,
        year,
        hidden,
      },
    });

    res.status(201).json({
      status: 201,
      data: null,
      message: "Album created successfully.",
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

export const updateAlbumController = async (
  req: Request<IdSchemaType, {}, UpdateAlbumSchemaType>,
  res: Response
) => {
  const { id } = req.params;
  const { name, year, hidden } = req.body;

  try {
    const album = await prisma.album.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
      },
    });

    if (!album) {
      res.status(404).json({
        status: 404,
        data: null,
        message: "Album not found.",
        error: null,
      });
      return;
    }

    await prisma.album.update({
      where: {
        id,
      },
      data: {
        name,
        year,
        hidden,
      },
    });
    res.status(200).json({
      status: 200,
      data: null,
      message: "Album updated successfully.",
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

export const deleteAlbumController = async (
  req: Request<IdSchemaType>,
  res: Response
) => {
  const { id } = req.params;
  try {
    const album = await prisma.album.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        name: true,
      },
    });

    if (!album) {
      res.status(404).json({
        status: 404,
        data: null,
        message: "Album not found.",
        error: null,
      });
      return;
    }

    await prisma.album.delete({
      where: {
        id,
      },
    });

    res.status(200).json({
      status: 200,
      data: null,
      message: `Album:${album.name} deleted successfully.`,
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
