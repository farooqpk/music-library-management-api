import { Router } from "express";
import { validateToken } from "../middlewares/validateToken";
import { validateRole } from "../middlewares/validateRole";
import { validateSchema } from "../middlewares/validateSchema";
import { addUserSchema, getUsersSchema } from "../schemas/users.schema";
import {
  addUserController,
  getUsersController,
} from "../controllers/users.controller";

const router = Router();

router.use(validateToken);

router.get(
  "/",
  validateRole(["ADMIN"]),
  validateSchema(getUsersSchema, "query"),
  getUsersController
);

router.post(
  "/add-user",
  validateRole(["ADMIN"]),
  validateSchema(addUserSchema, "body"),
  addUserController
);

export default router;
