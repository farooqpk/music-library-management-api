const {
  PORT,
  DATABASE_URL,
  TOKEN_SECRET,
  NODE_ENV,
  TOKEN_EXPIRY,
  REDIS_URL,
  APP_NAME,
} = process.env;

if (
  !PORT ||
  !DATABASE_URL ||
  !NODE_ENV ||
  !TOKEN_EXPIRY ||
  !TOKEN_SECRET ||
  !REDIS_URL ||
  !APP_NAME
) {
  throw new Error("Missing environment variables");
}

export {
  PORT,
  DATABASE_URL,
  TOKEN_SECRET,
  NODE_ENV,
  TOKEN_EXPIRY,
  REDIS_URL,
  APP_NAME,
};
