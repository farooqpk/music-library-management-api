import jwt from "jsonwebtoken";
import { TOKEN_SECRET, TOKEN_EXPIRY } from "../config";

export const createJwtToken = (
  id: string,
  email: string,
  role: string
): string => {
  return jwt.sign({ id, email, role }, TOKEN_SECRET!, {
    expiresIn: `${TOKEN_EXPIRY}h`,
  });
};
