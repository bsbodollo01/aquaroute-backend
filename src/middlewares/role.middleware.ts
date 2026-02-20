import { Request, Response, NextFunction } from "express";

declare global {
  namespace Express {
    interface Request {
      user: {
        role: "BUYER" | "SELLER";
      };
    }
  }
}

export const requireRole = (role: "BUYER" | "SELLER") => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (req.user.role !== role) {
      return res.status(403).json({ message: "Forbidden" });
    }
    next();
  };
};
