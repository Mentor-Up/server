import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express-serve-static-core";

export interface jwtPayload {
  userId: string;
  name: string;
}

const auth = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return res.sendStatus(401);
  }

  const token = authHeader.split(" ")[1];

  try {
    if (!process.env.ACCESS_TOKEN_SECRET) {
      throw new Error("The .env file must have a ACCESS_TOKEN_SECRET key.");
    }

    const payload = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET
    ) as jwtPayload;

    req.user = { userId: payload.userId };
    next();
  } catch (err) {
    return res.sendStatus(401);
  }
};

export default auth;
