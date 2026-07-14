import "express";

declare global {
  namespace Express {
    interface User {
      id: string;
      name: string;
      email: string;
      role: "customer" | "admin";
      status: "active" | "inactive";
    }

    interface Request {
      user?: User;
    }
  }
}
