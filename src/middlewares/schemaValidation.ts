import { Request, Response, NextFunction } from "express";
import { z, ZodError } from "zod";

export function validateData(
  schema: z.ZodObject<any, any>,
  type: "body" | "query" | "params"
) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req[type]);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessage = error.errors
          .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
          .join(", ");
        res.status(400).json({
          status: 400,
          data: null,
          message: `Bad Request, Reason: ${errorMessage}`,
          error: null,
        });
      } else {
        res.status(500).json({
          status: 500,
          data: null,
          message: "Internal Server Error",
          error: null,
        });
      }
    }
  };
}
