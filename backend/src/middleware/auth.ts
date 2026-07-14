import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import User from "../models/user";
import { config } from "../config";

interface TokenPayload extends JwtPayload {
  userId: string;
  role: string;
  email: string;
}

export async function authenticate(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ status: "error", message: "Authorization token missing" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, config.jwtSecret) as TokenPayload;
    if (!decoded.userId) {
      return res.status(401).json({ status: "error", message: "Invalid token" });
    }

    const user = await User.findById(decoded.userId).select("name email role status");
    if (!user) {
      return res.status(401).json({ status: "error", message: "Invalid token" });
    }

    req.user = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
    };

    next();
  } catch (error) {
    return res.status(401).json({ status: "error", message: "Invalid or expired token" });
  }
}
