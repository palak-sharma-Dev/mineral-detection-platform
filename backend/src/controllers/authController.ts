import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user";
import { config } from "../config";

export async function registerController(req: Request, res: Response) {
  const { name, email, password } = req.body as {
    name: string;
    email: string;
    password: string;
  };

  const existingUser = await User.findOne({ email: email.toLowerCase() });
  if (existingUser) {
    return res.status(409).json({ status: "error", message: "Email already in use" });
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await User.create({
    name,
    email: email.toLowerCase(),
    password: hashedPassword,
    role: "customer",
    status: "active",
  });

  return res.status(201).json({
    status: "ok",
    data: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    },
  });
}

export async function loginController(req: Request, res: Response) {
  const { email, password } = req.body as { email: string; password: string };

  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user || user.status !== "active") {
    return res.status(401).json({ status: "error", message: "Invalid credentials" });
  }

  const passwordMatches = await bcrypt.compare(password, user.password);
  if (!passwordMatches) {
    return res.status(401).json({ status: "error", message: "Invalid credentials" });
  }

  const token = jwt.sign(
    { userId: user._id.toString(), role: user.role, email: user.email },
    config.jwtSecret,
    { expiresIn: "7d" }
  );

  return res.status(200).json({
    status: "ok",
    data: {
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
      },
    },
  });
}
