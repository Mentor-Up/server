import { Request, Response } from 'express';
import { IUser } from '../models/User';
import adminService from '../services/admin';

export const getUsers = async (req: Request, res: Response) => {
  // users by cohort
  // users by role
  // users by session
  const users = await adminService.findAllUsers();
  res.status(200).json({ users });
};

export const getUser = async (req: Request, res: Response) => {
  const { userId } = req.params;
  const user = await adminService.findUserById(userId);
  res.status(200).json({ user });
};

export const updateUser = async (req: Request, res: Response) => {
  const { userId } = req.params;
  // const user = req.body;
  // console.log('values to update', user);
  const update: Partial<IUser> = {};

  // TODO: Review refactoring into utility function
  const allowedKeys: Array<keyof IUser> = ['role', 'cohorts'];
  const notAllowedKeys: Array<keyof IUser> = [];

  // Filter and track not allowed keys
  Object.keys(req.body).forEach((key) => {
    if (allowedKeys.includes(key as keyof IUser)) {
      update[key as keyof IUser] = req.body[key];
    } else {
      notAllowedKeys.push(key as keyof IUser);
    }
  });

  if (Object.keys(update).length === 0) {
    return res.status(400).json({
      message: 'No values to update',
      notAllowedKeys: notAllowedKeys,
      allowedKeys: allowedKeys,
    });
  }

  const updatedUser = await adminService.updateUser(userId, update);

  if (notAllowedKeys.length > 0) {
    res.status(200).json({
      profile: updatedUser,
      message: 'Some properties cannot be updated using profile endpoint',
      notAllowedKeys,
      allowedKeys,
    });
  } else {
    res.status(200).json({ profile: updatedUser });
  }
};
