import { NextFunction, Request, Response } from "express";

interface ErrorResponse extends Error {
  status?: number;
}

export function errorHandler(err: ErrorResponse, _req: Request, res: Response, _next: NextFunction) {
  const status = err.status ?? 500;
  res.status(status).json({
    status: "error",
    message: err.message ?? "Internal Server Error",
  });
}
