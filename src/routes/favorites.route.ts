import { Router } from "express";
import { validateSchema } from "../middlewares/validateSchema";
import { validateRole } from "../middlewares/validateRole";
import { idSchema } from "../schemas/artists.schema";
import { validateToken } from "../middlewares/validateToken";
import {
  addFavoriteSchema,
  getFavoritesCategorySchema,
  getFavoritesSchema,
} from "../schemas/favorites.schema";
import {
  addFavoriteController,
  getFavoritesController,
  removeFavoriteController,
} from "../controllers/favorites.controller";

const router = Router();

router.use(validateToken);

router.get(
  "/:category",
  validateSchema(getFavoritesCategorySchema, "params"),
  validateSchema(getFavoritesSchema, "query"),
  getFavoritesController
);

router.post(
  "/add-favorite",
  validateRole(["ADMIN", "EDITOR"]),
  validateSchema(addFavoriteSchema, "body"),
  addFavoriteController
);

router.delete(
  "/remove-favorite/:id",
  validateRole(["ADMIN", "EDITOR"]),
  validateSchema(idSchema, "params"),
  removeFavoriteController
);
export default router;
