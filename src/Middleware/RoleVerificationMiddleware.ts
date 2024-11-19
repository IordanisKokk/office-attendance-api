import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthenticatedRequest extends Request {
  user?: { id: string; role: string };
}

const verifyRole = (requiredRole: string) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const token = authHeader.split(" ")[1];

    try {
      const decodedJWT = jwt.verify(
        token,
        process.env.JWT_SECRET as string
      ) as {
        userID: string;
        username: string;
        role: string;
      };

      req.user = { id: decodedJWT.userID, role: decodedJWT.role };

      if (decodedJWT.role !== requiredRole) {
        res.status(403).json({ error: "Forbidden: Insufficient Access" });
      }

      next();
    } catch (error) {
      console.log("JWT verification error: ", error);
      res.status(401).json({ error: "Invalid or Expired Token" });
    }
  };
};

export default verifyRole;
