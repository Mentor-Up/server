import { Request, Response } from 'express';
import appDataService from '../../services/slack/appData';
import MessageBuilderService from '../../services/slack/messageBuilder';
import SlackNotificationService from '../../services/slack/notification';

const channelId = 'C05PG2K45EE'; //hedgehog;

export const handleWeeklySessionsNotification = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const weekData = await appDataService.currentWeekData();
    const messages = MessageBuilderService.buildMessages(weekData);

    const responses = await Promise.all(
      messages.map(async (message) => {
        const response = await SlackNotificationService.postToChannel(
          // message.channelId,
          channelId,
          // message.message
          message
        );

        if (response) {
          // return { success: true, channelId: messageObj.channelId, response };
          return { success: true, channelId: channelId, response };
        } else {
          return {
            success: false,
            // channelId: messageObj.channelId,
            channelId: channelId,
            error: 'Failed after retries',
          };
        }
      })
    );

    res.send({
      weekData,
      messages,
      responses,
    });
  } catch (error) {
    console.error('Error in handleWeeklySessionsNotification:', error);
    res.status(500).send({ error: (error as Error).message });
  }
};
