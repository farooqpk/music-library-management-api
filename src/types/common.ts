export type DecodedPayload = {
  id: string;
  email: string;
  role: USER_ROLE;
};

export type USER_ROLE = "ADMIN" | "EDITOR" | "VIEWER";
