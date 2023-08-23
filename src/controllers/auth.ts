import User, { IUser } from '../models/User';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { jwtPayload } from '../middleware/authentication';
import {
  BadRequestError,
  UnauthenticatedError,
  UnauthorizedError,
} from '../errors';
import {
  ACCESS_TOKEN_EXPIRATION,
  ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET,
} from '../config';
import getConfirmationCode from '../utils/getConfirmationCode';
import { Document } from 'mongoose';
import transporter from '../utils/mailSender';
import sendRegistrationMail from '../mail/registrationMail';
import createHash from '../utils/hashPassword';
import Cohort from '../models/Cohort';
import adminService from '../services/admin';

const register = async (req: Request, res: Response) => {
  const users: IUser[] = req.body.users;
  const cohortId = req.body.cohort;

  const cohort = await Cohort.findById(cohortId);
  if (!cohort) {
    throw new BadRequestError('This cohort does not exist');
  }

  // // saves all users from the req
  const newUserPromises = users.map(async (u) => {
    if (!u.name || !u.email) {
      return Promise.reject(
        `Could not save ${JSON.stringify(u)}: Missing credentials`
      );
    }
    // maybe the user is already register in another cohort
    const user = await User.findOne({ email: u.email });
    if (user) {
      if (user.cohorts.includes(cohortId)) {
        return Promise.reject(`${user.email} already in this cohort`);
      }
      return User.findByIdAndUpdate(user._id, {
        cohorts: user.cohorts.concat(cohortId),
      });
    }

    const confirmationCode = getConfirmationCode();
    return User.create({
      name: u.name,
      email: u.email,
      role: u.role,
      cohorts: [cohortId],
      confirmationCode,
    });
  });

  const savedUsers = await Promise.allSettled(newUserPromises);
  const newUsers: Document<IUser>[] = [];
  const errors: PromiseRejectedResult[] = [];

  savedUsers.forEach((u) => {
    if (u.status === 'fulfilled') {
      if (u.value) {
        newUsers.push(u.value);
        transporter.sendMail(
          sendRegistrationMail(u.value.email, u.value.confirmationCode)
        );
      }
    }
    if (u.status === 'rejected') {
      errors.push(u.reason);
    }
  });

  await cohort.updateOne({
    participants: cohort.participants.concat(newUsers.map((u) => u._id as any)),
  });

  res.status(201).json({ users: newUsers, errors, count: newUsers.length });
};

const directRegister = async (req: Request, res: Response) => {
  const user = await adminService.registerDirectUser(req.body);
  res.status(201).json({ user });
};

const activateAccount = async (req: Request, res: Response) => {
  const { password, confirmationCode } = req.body;
  if (!confirmationCode || !password) {
    throw new BadRequestError('Missing data to activate account');
  }

  const user = await User.findOne({ confirmationCode });
  if (!user) {
    throw new BadRequestError('Invalid confirmation code');
  }

  const hashedPassword = await createHash(password);
  const updatedUser = await user.updateOne(
    {
      password: hashedPassword,
      isActivated: true,
      confirmationCode: null,
    },
    { new: true }
  );

  return res.status(200).json({ user: updatedUser });
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

  if (!user.isActivated) {
    throw new UnauthorizedError('Account was not activated');
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

  return res.status(200).json({
    user: {
      name: user.name,
      userId: user._id,
      email: user.email,
      role: user.role,
    },
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

  const token = jwt.sign(
    { name: payload.name, role: payload.role, userId: user._id },
    ACCESS_TOKEN_SECRET!,
    {
      expiresIn: ACCESS_TOKEN_EXPIRATION,
    }
  );

  return res.status(200).json({
    user: {
      name: user.name,
      userId: user._id,
      email: user.email,
      role: user.role,
    },
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

export {
  register,
  login,
  refreshToken,
  logout,
  activateAccount,
  directRegister,
};
