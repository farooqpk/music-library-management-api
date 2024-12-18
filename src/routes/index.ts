import { Router } from "express";
import userRoutes from "./users.route";
import artistRoutes from "./artists.route";
import albumRoutes from "./albums.route";
import trackRoutes from "./tracks.route";
import favoriteRoutes from "./favorites.route";
import { validateSchema } from "../middlewares/validateSchema";
import { authSchema } from "../schemas/auth.schema";
import {
  loginController,
  logoutController,
  signupController,
} from "../controllers/auth.controller";
import { validateToken } from "../middlewares/validateToken";

const router = Router();

router.use("/users", userRoutes);
router.use("/artists", artistRoutes);
router.use("/albums", albumRoutes);
router.use("/tracks", trackRoutes);
router.use("/favorites", favoriteRoutes);

router.post("/signup", validateSchema(authSchema, "body"), signupController);
router.post("/login", validateSchema(authSchema, "body"), loginController);
router.get("/logout", validateToken, logoutController);

export default router;
