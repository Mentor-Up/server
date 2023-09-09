import { Request, Response } from 'express';
import sessionsDataService from '../../services/slack/sessionsData';

export const handleThisWeekSessions = async (
  req: Request,
  res: Response
): Promise<void> => {
  const user = req.user;
  try {
    const weekData = await sessionsDataService.getThisWeekSessions(user.userId);
    res.send(weekData);
  } catch (error) {
    console.error('Error in handleThisWeekSessions:', error);
    res.status(500).send({ error: (error as Error).message });
  }
};
