import User from "../models/User";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { jwtPayload } from "../middleware/authentication";

const register = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;
  const user = await User.create({ name, email, password });

  const token = user.createJWT();
  const refreshToken = user.createRefreshToken();

  await user.updateOne({ refreshToken });

  res.cookie("token", token, {
    httpOnly: true,
    sameSite: "none",
    secure: true,
    maxAge: 24 * 60 * 60 * 1000,
  });

  return res
    .status(201)
    .json({ user: { name: user.name, userId: user._id, email: user.email }, token });
};

const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.sendStatus(404);
  }

  const user = await User.findOne({ email });
  if (!user) {
    return res.sendStatus(401);
  }

  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    return res.sendStatus(401);
  }
  const token = user.createJWT();
  const refreshToken = user.createRefreshToken();

  await user.updateOne({ refreshToken });

  res.cookie("token", refreshToken, {
    httpOnly: true,
    sameSite: "none",
    secure: true,
    maxAge: 24 * 60 * 60 * 1000,
  });

  return res
    .status(200)
    .json({ user: { name: user.name, userId: user._id, email: user.email }, token });
};

const refreshToken = async (req: Request, res: Response) => {
  const cookies = req.cookies;
  if (!cookies?.token) {
    return res.sendStatus(401);
  }

  const refreshToken = cookies.token;

  const user = await User.findOne({ refreshToken });
  if (!user) {
    return res.sendStatus(401);
  }

  if (!process.env.REFRESH_TOKEN_SECRET) {
    return new Error("The .env file must have a REFRESH_TOKEN_SECRET key.");
  }
  if (!process.env.ACCESS_TOKEN_SECRET) {
    return new Error("The .env file must have an ACCESS_TOKEN_SECRET key.");
  }

  const payload = jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET
  ) as jwtPayload;
  if (!payload || payload.name !== user.name) {
    return res.sendStatus(403);
  }

  const token = jwt.sign(
    { username: payload.name },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRATION }
  );

  return res.status(200)
  .json({ user: { name: user.name, userId: user._id, email: user.email  }, token });
};

const logout = async (req: Request, res: Response) => {
  const cookies = req.cookies;
  if (!cookies.token) {
    return res.sendStatus(204);
  }

  const refreshToken = cookies.token;
  const user = await User.findOne({ refreshToken });
  if (user !== null) {
    await user.updateOne({ refreshToken: null });
  }

  res.clearCookie("token", {
    httpOnly: true,
    sameSite: "none",
    secure: true,
  });
  return res.sendStatus(204);
};

export { register, login, refreshToken, logout };
