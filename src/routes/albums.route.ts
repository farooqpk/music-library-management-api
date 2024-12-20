import { Router } from "express";
import { validateToken } from "../middlewares/validateToken";
import { validateSchema } from "../middlewares/validateSchema";
import {
  addAlbumSchema,
  getAlbumsSchema,
  updateAlbumSchema,
} from "../schemas/albums.schema";
import {
  addAlbumController,
  deleteAlbumController,
  getAlbumController,
  getAlbumsController,
  updateAlbumController,
} from "../controllers/albums.controller";
import { idSchema } from "../schemas/artists.schema";
import { validateRole } from "../middlewares/validateRole";

const router = Router();

router.use(validateToken);

router.get("/", validateSchema(getAlbumsSchema, "query"), getAlbumsController);

router.get("/:id", validateSchema(idSchema, "params"), getAlbumController);

router.post(
  "/add-album",
  validateRole(["ADMIN", "EDITOR"]),
  validateSchema(addAlbumSchema, "body"),
  addAlbumController
);

router.put(
  "/:id",
  validateRole(["ADMIN", "EDITOR"]),
  validateSchema(idSchema, "params"),
  validateSchema(updateAlbumSchema, "body"),
  updateAlbumController
);

router.delete(
  "/:id",
  validateSchema(idSchema, "params"),
  deleteAlbumController
);
export default router;
