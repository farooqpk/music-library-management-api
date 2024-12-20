import { NextFunction, Response, Request } from "express";
import jwt from "jsonwebtoken";
import { APP_NAME, TOKEN_SECRET } from "../config";
import { DecodedPayload } from "../types/common";
import { redisClient } from "../lib/redis";

export const validateToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    res.status(401).json({
      status: 401,
      data: null,
      message: "Unauthorized. Token is missing.",
      error: "Unauthorized",
    });
    return;
  }

  try {
    const is_blacklisted = await redisClient.get(
      `${APP_NAME}:blacklist:${token}`
    );

    if (is_blacklisted && Boolean(is_blacklisted)) {
      res.status(401).json({
        status: 401,
        data: null,
        message: "Unauthorized. Token is blacklisted.",
        error: "Unauthorized",
      });
      return;
    }

    const tokenDecoded = jwt.verify(token, TOKEN_SECRET!) as DecodedPayload;

    if (!tokenDecoded) {
      res.status(401).json({ success: false, message: "token is invalid" });
      return;
    }

    req.id = tokenDecoded.id;
    req.email = tokenDecoded.email;
    req.role = tokenDecoded.role;
    next();
  } catch (err) {
    res.status(401).json({
      status: "401",
      data: null,
      message: "Unauthorized access. Invalid token.",
      error: "Unauthorized",
    });
  }
};
