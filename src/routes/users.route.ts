import { Router } from "express";
import { validateToken } from "../middlewares/validateToken";
import { validateRole } from "../middlewares/validateRole";
import { validateSchema } from "../middlewares/validateSchema";
import {
  addUserSchema,
  deleteUserSchema,
  getUsersSchema,
  updatePasswordSchema,
} from "../schemas/users.schema";
import {
  addUserController,
  deleteUserController,
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

router.delete(
  "/:id",
  validateRole(["ADMIN"]),
  validateSchema(deleteUserSchema, "params"),
  deleteUserController
);

router.put(
  "/update-password",
  validateSchema(updatePasswordSchema, "body"),
  deleteUserController
);

export default router;
