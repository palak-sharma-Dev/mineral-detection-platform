import { NextFunction, Request, Response } from "express";

export function authorize(allowedRoles: Array<"customer" | "admin">) {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as { role?: string } | undefined;
    if (!user?.role || !allowedRoles.includes(user.role as "customer" | "admin")) {
      return res.status(403).json({ status: "error", message: "Forbidden" });
    }
    next();
  };
}
