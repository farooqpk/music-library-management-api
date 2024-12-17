import { NextFunction, Response, Request } from "express";
import jwt from "jsonwebtoken";
import { TOKEN_SECRET } from "../config";
import { DecodedPayload } from "../types/common";

export const verifyToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const accessToken = req.headers.authorization;

  if (!accessToken)
    return res
      .status(401)
      .json({ success: false, message: "token is missing" });

  try {
    const tokenDecoded = jwt.verify(
      accessToken,
      TOKEN_SECRET!
    ) as DecodedPayload;

    if (!tokenDecoded) {
      return res
        .status(401)
        .json({ success: false, message: "token is invalid" });
    }

    req.id = tokenDecoded.id;
    req.email = tokenDecoded.email;
    req.role = tokenDecoded.role;
    next();
  } catch (err) {
    return res.status(401).json({
      status: "401",
      data: null,
      message: "Unauthorized access. Invalid token.",
      error: "Unauthorized",
    });
  }
};
