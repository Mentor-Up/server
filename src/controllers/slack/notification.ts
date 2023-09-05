import { Request, Response } from 'express';
import appDataService from '../../services/slack/appData';

export const handleWeeklySessionsNotification = async (
  req: Request,
  res: Response
): Promise<void> => {
  const sessions = await appDataService.currentWeekData();
  res.send(sessions);
};
