import { Request, Response } from 'express';
import appDataService from '../../services/slack/appData';
import MessageBuilderService from '../../services/slack/messageBuilder';
import SlackNotificationService from '../../services/slack/notification';
import { text } from 'stream/consumers';

const channelId = 'C05PG2K45EE'; //hedgehog;

export const handleWeeklySessionsNotification = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const weekData = await appDataService.currentWeekData();
    const messages = MessageBuilderService.weeklySessions(weekData);

    const responses = await Promise.all(
      messages.map(async (message) => {
        const response = await SlackNotificationService.postToChannel(
          channelId, // message.channelId,
          message.text,
          message.blocks
        );

        if (response) {
          // return { success: true, channelId: message.channelId, response };
          return { success: true, channelId: channelId, response };
        } else {
          return {
            success: false,
            channelId: channelId, //message.channelId,
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
