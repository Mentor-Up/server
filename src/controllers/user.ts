import { Request, Response } from 'express';
import { IUser } from '../models/User';
import adminService from '../services/admin';
import { filterByAllowedKeys } from '../utils/filterByAllowedKeys';

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

export const updateUserByAdmin = async (req: Request, res: Response) => {
  const { userId } = req.params;
  const allowedKeys: Array<keyof IUser> = ['role', 'cohorts'];

  const { updateData, invalidKeys } = filterByAllowedKeys(
    req.body,
    allowedKeys
  );

  if (Object.keys(updateData).length === 0) {
    return res.status(400).json({
      message: 'No values to update',
      invalidKeys: invalidKeys,
      allowedKeys: allowedKeys,
    });
  }

  const updatedUser = await adminService.updateUser(userId, updateData);

  if (invalidKeys.length > 0) {
    res.status(200).json({
      profile: updatedUser,
      message: 'Some properties cannot be updated by Admin',
      invalidKeys,
      allowedKeys,
    });
  } else {
    res.status(200).json({ profile: updatedUser });
  }
};
