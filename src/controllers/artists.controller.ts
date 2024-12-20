import { Request, Response } from "express";
import {
  AddArtistSchemaType,
  GetArtistsSchemaType,
  IdSchemaType,
  UpdateArtistSchemaType,
} from "../schemas/artists.schema";
import { prisma } from "../lib/prisma";

export const getArtistsController = async (
  req: Request<{}, {}, GetArtistsSchemaType>,
  res: Response
) => {
  const limit = Number(req.query.limit) || 5;
  const offset = Number(req.query.offset) || 0;
  const grammy = Number(req.query.grammy);
  const hidden = Boolean(req.query.hidden);

  try {
    const artists = await prisma.artist.findMany({
      where: {
        ...(grammy && { grammy }),
        ...(hidden && { hidden: hidden }),
      },
      take: limit,
      skip: offset,
      select: {
        id: true,
        name: true,
        grammy: true,
        hidden: true,
      },
    });

    res.status(200).json({
      status: 200,
      data: artists,
      message: "Artists retrieved successfully.",
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

export const getArtistController = async (
  req: Request<IdSchemaType>,
  res: Response
) => {
  const { id } = req.params;

  try {
    const artist = await prisma.artist.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        name: true,
        grammy: true,
        hidden: true,
      },
    });

    if (!artist) {
      res.status(404).json({
        status: 404,
        data: null,
        message: "Artist not found.",
        error: null,
      });
      return;
    }

    res.status(200).json({
      status: 200,
      data: artist,
      message: "Artist retrieved successfully.",
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

export const addArtistController = async (
  req: Request<{}, {}, AddArtistSchemaType>,
  res: Response
) => {
  const { name, grammy, hidden } = req.body;

  try {
    await prisma.artist.create({
      data: {
        name,
        grammy,
        hidden,
      },
    });

    res.status(201).json({
      status: 201,
      data: null,
      message: "Artist created successfully.",
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

export const updateArtistController = async (
  req: Request<IdSchemaType, {}, UpdateArtistSchemaType>,
  res: Response
) => {
  const { id } = req.params;
  const { name, grammy, hidden } = req.body;
  try {
    const artist_exists = await prisma.artist.findUnique({
      where: {
        id,
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
    await prisma.artist.update({
      where: {
        id,
      },
      data: {
        name,
        grammy,
        hidden,
      },
    });

    res.status(204).json({
      status: 204,
      data: null,
      message: "Artist updated successfully.",
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

export const deleteArtistController = async (
  req: Request<IdSchemaType>,
  res: Response
) => {
  const { id } = req.params;
  try {
    const artist_exists = await prisma.artist.findUnique({
      where: {
        id,
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

    await prisma.artist.delete({
      where: {
        id,
      },
    });
    res.status(200).json({
      status: 200,
      data: null,
      message: "Artist deleted successfully.",
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
