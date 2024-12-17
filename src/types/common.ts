import { UserRole } from "@prisma/client";

export type DecodedPayload = {
  id: string;
  email: string;
  role: UserRole;
};
