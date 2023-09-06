import { Request, Response } from 'express';
import appDataService from '../../services/slack/appData';
import MessageBuilderService from '../../services/slack/messageBuilder';

export const handleWeeklySessionsNotification = async (
  req: Request,
  res: Response
): Promise<void> => {
  const weekData = await appDataService.currentWeekData();
  const messages = MessageBuilderService.buildMessages(weekData);

  res.send({
    weekData,
    messages,
  });
};
