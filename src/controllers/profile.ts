import { Request, Response } from 'express';
import profileService from '../services/profile';

export const getProfile = async (req: Request, res: Response) => {
  const userId = req.user.userId;
  const userProfile = await profileService.getUser(userId);
  res.status(200).json({ profile: userProfile });
};

export const updateProfile = async (req: Request, res: Response) => {
  const userId = req.user.userId;
  const { name, email, avatarUrl } = req.body;
  if (!name && !email && !avatarUrl) {
    return res.status(400).json({ message: 'No values to update' });
  }
  const updatedUser = await profileService.updateUser(userId, {
    name,
    email,
    avatarUrl,
  });
  res.status(200).json({ profile: updatedUser });
};

export const deleteProfile = async (req: Request, res: Response) => {
  await profileService.deleteUser(req.user.userId);
  res.clearCookie('token');
  res
    .status(200)
    .json({ message: `${req.user.name}'s profile was successfully removed` });
};
