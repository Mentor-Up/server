import { App, SlackActionMiddlewareArgs } from '@slack/bolt';

import appDataService from '../../../services/slack/appData';
import MessageBuilderService from '../../../services/slack/messageBuilder';
import SlackNotificationService from '../../../services/slack/notification';

export const handleNotifyAllChannels = async (
  args: SlackActionMiddlewareArgs
) => {
  const { ack } = args;
  await ack();
  console.log('Notify All button was clicked!');
  try {
    const weekData = await appDataService.currentWeekData();
    const messages = MessageBuilderService.weeklySessions(weekData);

    const channelId = 'C05PG2K45EE'; // hedgehog;
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
    console.log('responses:', responses);
  } catch (error) {
    console.error('Error in handleWeeklySessionsNotification:', error);
  }
};
