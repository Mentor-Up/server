import { Request, Response } from 'express';
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
  const { cohorts } = req.body;
  const updatedUser = await adminService.updateUserCohort(userId, cohorts);
  res.status(200).json({ user: updatedUser });
};
