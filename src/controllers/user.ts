import { Request, Response, NextFunction } from 'express';
import userService from '../services/user';

export const getProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = req.user.userId;
  try {
    const userProfile = await userService.getUserById(userId);
    if (!userProfile) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ profile: userProfile });
  } catch (err) {
    next(err);
  }
};

export const updateProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = req.user.userId;
  const updatedData = req.body;
  console.log(updatedData);
  try {
    const updatedUser = await userService.updateUser(userId, updatedData);
    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ profile: updatedUser });
  } catch (err) {
    next(err);
  }
};
