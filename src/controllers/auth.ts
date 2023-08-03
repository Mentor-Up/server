import User from '../models/User';
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { jwtPayload } from '../middleware/authentication';
import { BadRequestError, UnauthenticatedError } from '../errors';
import {
  ACCESS_TOKEN_EXPIRATION,
  ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET,
} from '../config';

const register = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    throw new BadRequestError('Missing credentials');
  }
  const user = await User.create({ name, email, password });

  const token = user.createJWT();
  const refreshToken = user.createRefreshToken();

  await user.updateOne({ refreshToken });

  res.cookie('token', token, {
    httpOnly: true,
    sameSite: 'none',
    secure: true,
    maxAge: 24 * 60 * 60 * 1000,
  });

  return res
    .status(201)
    .json({
      user: { name: user.name, userId: user._id, email: user.email },
      token,
    });
};

const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new BadRequestError('Missing credentials');
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw new UnauthenticatedError('Invalid credentials');
  }

  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new UnauthenticatedError('Invalid credentials');
  }
  const token = user.createJWT();
  const refreshToken = user.createRefreshToken();

  await user.updateOne({ refreshToken });

  res.cookie('token', refreshToken, {
    httpOnly: true,
    sameSite: 'none',
    secure: true,
    maxAge: 24 * 60 * 60 * 1000,
  });

  return res
    .status(200)
    .json({
      user: { name: user.name, userId: user._id, email: user.email },
      token,
    });
};

const refreshToken = async (req: Request, res: Response) => {
  const cookies = req.cookies;
  if (!cookies?.token) {
    throw new UnauthenticatedError('Invalid token');
  }

  const refreshToken = cookies.token;

  const user = await User.findOne({ refreshToken });
  if (!user) {
    throw new UnauthenticatedError('Invalid token');
  }

  const payload = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET!) as jwtPayload;
  if (!payload || payload.name !== user.name) {
    return res.sendStatus(403);
  }

  const token = jwt.sign({ username: payload.name }, ACCESS_TOKEN_SECRET!, {
    expiresIn: ACCESS_TOKEN_EXPIRATION,
  });

  return res
    .status(200)
    .json({
      user: { name: user.name, userId: user._id, email: user.email },
      token,
    });
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

  res.clearCookie('token', {
    httpOnly: true,
    sameSite: 'none',
    secure: true,
  });
  return res.sendStatus(204);
};

// exports.restrict = (...role) => {
//   return (req: Request, res: Response, next: NextFunction) => {
//     if (!role.includes(req.user.role)) {
//       throw new UnauthenticatedError('Invalid credentials');
//     }
//     next()
//   }
// }

export { register, login, refreshToken, logout };
