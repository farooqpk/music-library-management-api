import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import {
  AddFavoriteSchemaType,
  GetFavoritesCategorySchemaType,
  GetFavoritesSchemaType,
} from "../schemas/favorites.schema";
import { IdSchemaType } from "../schemas/artists.schema";

export const getFavoritesController = async (
  req: Request<GetFavoritesCategorySchemaType, {}, GetFavoritesSchemaType>,
  res: Response
) => {
  const limit = Number(req.query.limit) || 5;
  const offset = Number(req.query.offset) || 0;
  const { category } = req.params;

  try {
    const favorites = await prisma.favorite.findMany({
      where: {
        userId: req.id,
        category,
      },
      include: {
        artist:
          category === "ARTIST"
            ? {
                select: {
                  name: true,
                  id: true,
                },
              }
            : false,
        album:
          category === "ALBUM"
            ? {
                select: {
                  name: true,
                  id: true,
                },
              }
            : false,
        track:
          category === "TRACK"
            ? {
                select: {
                  name: true,
                  id: true,
                },
              }
            : false,
      },
      take: limit,
      skip: offset,
    });

    const transformedFavorites = favorites.map((favorite) => {
      return {
        favorite_id: favorite.id,
        category: favorite.category.toLowerCase(),
        item_id:
          category === "ARTIST"
            ? favorite?.artist?.id
            : category === "ALBUM"
            ? favorite?.album?.id
            : favorite?.track?.id,
        name:
          category === "ARTIST"
            ? favorite?.artist?.name
            : category === "ALBUM"
            ? favorite?.album?.name
            : favorite?.track?.name,
        created_at: favorite.createdAt,
      };
    });

    res.status(200).json({
      status: 200,
      data: transformedFavorites,
      message: "Favorites retrieved successfully.",
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

export const addFavoriteController = async (
  req: Request<{}, {}, AddFavoriteSchemaType>,
  res: Response
) => {
  const { category, item_id } = req.body;

  try {
    let is_item_exist;

    switch (category) {
      case "ARTIST":
        is_item_exist = await prisma.artist.findFirst({
          where: {
            id: item_id,
          },
          select: {
            id: true,
          },
        });
        break;
      case "ALBUM":
        is_item_exist = await prisma.album.findFirst({
          where: {
            id: item_id,
          },
          select: {
            id: true,
          },
        });
        break;
      case "TRACK":
        is_item_exist = await prisma.track.findFirst({
          where: {
            id: item_id,
          },
          select: {
            id: true,
          },
        });
        break;
    }

    if (!is_item_exist) {
      res.status(404).json({
        status: 404,
        data: null,
        message: "Item not found.",
        error: null,
      });
      return;
    }

    const is_already_fav = await prisma.favorite.findFirst({
      where: {
        userId: req.id,
        category,
        albumId: category === "ALBUM" ? item_id : undefined,
        artistId: category === "ARTIST" ? item_id : undefined,
        trackId: category === "TRACK" ? item_id : undefined,
      },
    });

    if (is_already_fav) {
      res.status(400).json({
        status: 400,
        data: null,
        message: "Item already added to favorites.",
        error: null,
      });
      return;
    }

    await prisma.favorite.create({
      data: {
        userId: req.id!,
        category,
        albumId: category === "ALBUM" ? item_id : undefined,
        artistId: category === "ARTIST" ? item_id : undefined,
        trackId: category === "TRACK" ? item_id : undefined,
      },
    });

    res.status(201).json({
      status: 201,
      data: null,
      message: "Favorite added successfully.",
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

export const removeFavoriteController = async (
  req: Request<IdSchemaType>,
  res: Response
) => {
  const { id } = req.params;

  try {
    const is_favorite_exist = await prisma.favorite.findFirst({
      where: {
        id,
      },
      select: {
        id: true,
      },
    });

    if (!is_favorite_exist) {
      res.status(404).json({
        status: 404,
        data: null,
        message: "Favorite not found.",
        error: null,
      });
      return;
    }

    await prisma.favorite.delete({
      where: {
        id,
      },
    });

    res.status(200).json({
      status: 200,
      data: null,
      message: "Favorite removed successfully.",
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
