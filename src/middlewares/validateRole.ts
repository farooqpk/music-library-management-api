import { NextFunction, Request, Response } from "express";
import { USER_ROLE } from "../types/common";

export const validateRole = (allowedRoles: Array<USER_ROLE>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const userRole = req.role as USER_ROLE;

    if (!userRole) {
      res.status(403).json({
        status: 403,
        data: null,
        message: "Forbidden",
        error: null,
      });
      return;
    }

    if (!allowedRoles.includes(userRole)) {
      res.status(403).json({
        status: 403,
        data: null,
        message: "Forbidden",
        error: null,
      });
      return;
    }

    next();
  };
};
