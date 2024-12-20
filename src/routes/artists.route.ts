import { Router } from "express";
import { validateToken } from "../middlewares/validateToken";
import { validateSchema } from "../middlewares/validateSchema";
import {
  addArtistSchema,
  getArtistsSchema,
  idSchema,
  updateArtistSchema,
} from "../schemas/artists.schema";
import {
  addArtistController,
  deleteArtistController,
  getArtistController,
  getArtistsController,
  updateArtistController,
} from "../controllers/artists.controller";
import { validateRole } from "../middlewares/validateRole";

const router = Router();

router.use(validateToken);

router.get(
  "/",
  validateSchema(getArtistsSchema, "query"),
  getArtistsController
);

router.get(
  "/:id",
  validateSchema(idSchema, "params"),
  getArtistController
);

router.post(
  "/add-artist",
  validateRole(["ADMIN", "EDITOR"]),
  validateSchema(addArtistSchema, "body"),
  addArtistController
);

router.put(
  "/:id",
  validateRole(["ADMIN", "EDITOR"]),
  validateSchema(idSchema, "params"),
  validateSchema(updateArtistSchema, "body"),
  updateArtistController
);

router.delete(
  "/:id",
  validateRole(["ADMIN", "EDITOR"]),
  validateSchema(idSchema, "params"),
  deleteArtistController
);

export default router;
