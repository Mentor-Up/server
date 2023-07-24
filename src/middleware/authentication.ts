import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express-serve-static-core";

export interface jwtPayload {
  userId: string;
  name: string;
}

const auth = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    res.sendStatus(401);
    return;
  }

  const token = authHeader.split(" ")[1];

  try {
    if (!process.env.JWT_SECRET) {
      throw new Error("The .env file must have a JWT_SECRET key.");
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET) as jwtPayload;
    req.user = { userId: payload.userId };
    next();
  } catch (err) {
    res.sendStatus(401);
    return;
  }
};

export default auth;
