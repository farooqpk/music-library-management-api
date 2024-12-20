import { Router } from "express";
import { validateToken } from "../middlewares/validateToken";
import { validateSchema } from "../middlewares/validateSchema";
import {
  addTrackSchema,
  getTracksSchema,
  updateTrackSchema,
} from "../schemas/tracks.schema";
import {
  addTrackController,
  deleteTrackController,
  getTrackController,
  getTracksController,
  updateTrackController,
} from "../controllers/tracks.controller";
import { idSchema } from "../schemas/artists.schema";
import { validateRole } from "../middlewares/validateRole";

const router = Router();

router.use(validateToken);

router.get("/", validateSchema(getTracksSchema, "query"), getTracksController);

router.get("/:id", validateSchema(idSchema, "params"), getTrackController);

router.post(
  "/add-track",
  validateRole(["ADMIN", "EDITOR"]),
  validateSchema(addTrackSchema, "body"),
  addTrackController
);

router.put(
  "/:id",
  validateRole(["ADMIN", "EDITOR"]),
  validateSchema(idSchema, "params"),
  validateSchema(updateTrackSchema, "body"),
  updateTrackController
);

router.delete(
  "/:id",
  validateRole(["ADMIN", "EDITOR"]),
  validateSchema(idSchema, "params"),
  deleteTrackController
);

export default router;
