declare namespace Express {
  interface Request {
    // add arbitrary keys to the request
    [id: string]: any;
    [email: string]: any;
    [role: string]: any;
  }
}
