import { UserRole } from "@prisma/client";
import { NextFunction, Request, Response } from "express";

export const validateRole = (allowedRoles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const userRole = req.role;

    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({
        status: 403,
        data: null,
        message: "Forbidden",
        error: null,
      });
    }

    next();
  };
};
