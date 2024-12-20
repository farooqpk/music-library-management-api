import { Request, Response } from "express";
import { AuthSchemaType } from "../schemas/auth.schema";
import { prisma } from "../lib/prisma";
import bcrypt from "bcrypt";
import { createJwtToken } from "../utils/createToken";
import { redisClient } from "../lib/redis";
import { APP_NAME } from "../config";

export const signupController = async (
  req: Request<{}, {}, AuthSchemaType>,
  res: Response
) => {
  const { email, password } = req.body;

  try {
    const is_email_already_exist = await prisma.user.findUnique({
      where: {
        email: email,
      },
      select: {
        id: true,
      },
    });

    if (is_email_already_exist) {
      res.status(409).json({
        status: 409,
        data: null,
        message: "Email already exists.",
        error: null,
      });
      return;
    }

    const hashed_password = await bcrypt.hash(password, 10);

    await prisma.$transaction(async (tx) => {
      const organizationId = (
        await tx.organization.create({
          data: {
            name: `${email.split("@")[0]}'s Organization`,
          },
          select: {
            id: true,
          },
        })
      ).id;

      await tx.user.create({
        data: {
          email,
          password: hashed_password,
          role: "ADMIN",
          organizationId,
        },
      });
    });

    res.status(201).json({
      status: 201,
      data: null,
      message: "User created successfully.",
      error: null,
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      data: null,
      message: "Something went wrong.",
      error: error,
    });
  }
};

export const loginController = async (
  req: Request<{}, {}, AuthSchemaType>,
  res: Response
) => {
  const { email, password } = req.body;
  try {
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
      select: {
        password: true,
        id: true,
        email: true,
        role: true,
      },
    });

    if (!user) {
      res.status(404).json({
        status: 404,
        data: null,
        message: "User not found.",
        error: null,
      });
      return;
    }

    const is_password_correct = await bcrypt.compare(password, user.password);

    if (!is_password_correct) {
      res.status(401).json({
        status: 401,
        data: null,
        message: "Invalid email or password.",
        error: null,
      });
      return;
    }

    const token = createJwtToken(user.id, user.email, user.role);

    res.status(200).json({
      status: 200,
      data: {
        token,
      },
      message: "Login successful.",
      error: null,
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      data: null,
      message: "Something went wrong.",
      error: error,
    });
  }
};

export const logoutController = async (req: Request, res: Response) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    res.status(401).json({
      status: 401,
      data: null,
      message: "Unauthorized.",
      error: null,
    });
    return;
  }

  await redisClient.set(`${APP_NAME}:blacklist:${token}`, "true");

  res.status(200).json({
    status: 200,
    data: null,
    message: "User logged out successfully.",
    error: null,
  });
};
