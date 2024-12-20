import { Request, Response } from "express";
import {
  AddUserSchemaType,
  DeleteUserSchemaType,
  GetUsersSchemaType,
  UpdatePasswordSchemaType,
} from "../schemas/users.schema";
import { prisma } from "../lib/prisma";
import { UserRole } from "@prisma/client";
import bcrypt from "bcrypt";

export const getUsersController = async (
  req: Request<{}, {}, GetUsersSchemaType>,
  res: Response
) => {
  const limit = Number(req.query.limit) || 5;
  const offset = Number(req.query.offset) || 0;
  const role = req.query.role;

  try {
    const admin_organization_id = (
      await prisma.user.findFirst({
        where: {
          role: "ADMIN",
          id: req.id,
        },
        select: {
          organizationId: true,
        },
      })
    )?.organizationId;

    const users = await prisma.user.findMany({
      where: {
        ...(role && { role: role as Exclude<UserRole, "ADMIN"> }),
        organizationId: admin_organization_id,
        id: {
          not: req.id,
        },
      },
      take: limit,
      skip: offset,
      select: {
        id: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    res.status(200).json({
      status: 200,
      data: users,
      message: "Users retrieved successfully.",
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

export const addUserController = async (
  req: Request<{}, {}, AddUserSchemaType>,
  res: Response
) => {
  const { email, password, role } = req.body;

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
        message: null,
        error: "Email already exists.",
      });
      return;
    }

    const hashed_password = await bcrypt.hash(password, 10);

    const admin_organization_id = (
      await prisma.organization.findFirst({
        where: {
          users: {
            some: {
              role: "ADMIN",
            },
          },
        },
        select: {
          id: true,
        },
      })
    )?.id;

    if (!admin_organization_id) {
      res.status(404).json({
        status: 404,
        data: null,
        message: "Admin organization not found.",
        error: null,
      });
      return;
    }

    await prisma.user.create({
      data: {
        email,
        password: hashed_password,
        role: role as Exclude<UserRole, "ADMIN">,
        organizationId: admin_organization_id,
      },
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

export const deleteUserController = async (
  req: Request<DeleteUserSchemaType>,
  res: Response
) => {
  const { id } = req.params;

  try {
    const is_user_exist = await prisma.user.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
      },
    });

    if (!is_user_exist) {
      res.status(404).json({
        status: 404,
        data: null,
        message: "User not found.",
        error: null,
      });
      return;
    }

    const admin_organization_id = (
      await prisma.user.findFirst({
        where: {
          role: "ADMIN",
          id: req.id,
        },
        select: {
          organizationId: true,
        },
      })
    )?.organizationId;

    await prisma.user.delete({
      where: {
        id,
        role: {
          in: ["EDITOR", "VIEWER"],
        },
        organizationId: admin_organization_id,
      },
    });

    res.status(200).json({
      status: 200,
      data: null,
      message: "User deleted successfully.",
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

export const updatePasswordController = async (
  req: Request<{}, {}, UpdatePasswordSchemaType>,
  res: Response
) => {
  const { old_password, new_password } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: {
        id: req.id,
      },
      select: {
        password: true,
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

    const is_password_correct = await bcrypt.compare(
      old_password,
      user.password
    );

    if (!is_password_correct) {
      res.status(401).json({
        status: 401,
        data: null,
        message: "Invalid old password.",
        error: null,
      });
      return;
    }

    const hashed_password = await bcrypt.hash(new_password, 10);

    await prisma.user.update({
      where: {
        id: req.id,
      },
      data: {
        password: hashed_password,
      },
    });

    res.sendStatus(204);
  } catch (error) {
    res.status(500).json({
      status: 500,
      data: null,
      message: "Something went wrong.",
      error: error,
    });
  }
};
