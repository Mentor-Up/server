import { Request, Response } from 'express';
import userService from '../services/user';

export const getProfile = async (req: Request, res: Response) => {
  const userId = req.user.userId;
  const userProfile = await userService.getUser(userId);
  res.status(200).json({ profile: userProfile });
};

export const updateProfile = async (req: Request, res: Response) => {
  const userId = req.user.userId;
  const updatedData = req.body;
  console.log('data to update', updatedData);
  const updatedUser = await userService.updateUser(userId, updatedData);
  res.status(200).json({ profile: updatedUser });
};

export const deleteProfile = async (req: Request, res: Response) => {
  await userService.deleteUser(req.user.userId);
  res.clearCookie('token');
  res
    .status(200)
    .json({ message: `${req.user.name}'s profile was successfully removed` });
};
