import express from "express";
import dotenv from "dotenv";
import { connectPrisma } from "./lib/prisma";
import { PORT } from "./config";
import helmet from "helmet";
import { rateLimit } from "express-rate-limit";
dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(
  rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 150,
    standardHeaders: true,
  })
);

app.listen(PORT, async () => {
  console.log(`Server listening on port ${PORT}`);
  await connectPrisma();
});
