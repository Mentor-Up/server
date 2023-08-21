import { Request, Response } from 'express';
import userService from '../services/user';

export const getUsers = async (req: Request, res: Response) => {
  // users by cohort
  // users by role
  // users by session
  const users = await userService.getUsers();
  res.status(200).json({ users });
};
