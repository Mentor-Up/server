import { Request, Response } from 'express';
import profileService from '../services/profile';
import { IUser } from '../models/User';

export const getProfile = async (req: Request, res: Response) => {
  const userId = req.user.userId;
  const userProfile = await profileService.getUser(userId);
  res.status(200).json({ profile: userProfile.generateProfile() });
};

export const updateProfile = async (req: Request, res: Response) => {
  const userId = req.user.userId;
  const update: Partial<IUser> = {};
  const allowedKeys: Array<keyof IUser> = ['name', 'email', 'avatarUrl'];
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
      notAllowedKeys,
      allowedKeys,
    });
  }

  const updatedUser = await profileService.updateUser(userId, update);

  res.cookie('token', updatedUser.refreshToken, {
    httpOnly: true,
    sameSite: 'none',
    secure: true,
    maxAge: 24 * 60 * 60 * 1000,
  });

  if (notAllowedKeys.length > 0) {
    return res.status(200).json({
      profile: updatedUser.generateProfile(),
      message: 'Some properties cannot be updated using profile endpoint',
      notAllowedKeys,
      allowedKeys,
    });
  } else {
    return res.status(200).json({ profile: updatedUser.generateProfile() });
  }
};

export const deleteProfile = async (req: Request, res: Response) => {
  await profileService.deleteUser(req.user.userId);
  res.clearCookie('token');
  res
    .status(200)
    .json({ message: `${req.user.name}'s profile was successfully removed` });
};

export const updatePassword = async (req: Request, res: Response) => {
  const userId = req.user.userId;
  const { currentPassword, newPassword } = req.body;
  const updatedUser = await profileService.updatePassword(
    userId,
    currentPassword,
    newPassword
  );
  res.status(200).json({
    status: 'success',
    profile: updatedUser,
  });
};
