import { Request, Response } from 'express';
import dataService from '../../services/appData';

export const getThisWeekSessions = async (
  req: Request,
  res: Response
): Promise<void> => {
  const sessions = await dataService.currentWeekData();
  res.send(sessions);
};
