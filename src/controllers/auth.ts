import User from "../models/User";
import { Request, Response } from "express";

const register = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;
  const user = await User.create({ name, email, password });

  const token = user.createJWT();

  res.status(201).json({ userId: user._id, token });
};

const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.sendStatus(404);
    return;
  }

  const user = await User.findOne({ email });
  if (!user) {
    res.sendStatus(401);
  }
  const isPasswordCorrect = await user!.comparePassword(password);
  if (!isPasswordCorrect) {
    res.sendStatus(401);
  }
  const token = user!.createJWT();

  res.cookie("token", token, {
    httpOnly: true,
    sameSite: "none",
    secure: true,
    maxAge: 24 * 60 * 60 * 1000,
  });

  res
    .status(200)
    .json({ user: { name: user!.name, userId: user!._id }, token });
};

export { register, login };
