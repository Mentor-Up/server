import { SlackActionMiddlewareArgs } from '@slack/bolt';

import sessionsDataService from '../../services/sessions';
import MessageBuilderService from '../../services/messageBuilder';
import SlackNotificationService from '../../services/notification';

export const handleNotifyAllChannels = async (
  args: SlackActionMiddlewareArgs
) => {
  const { ack } = args;
  await ack();
  console.log('Notify All button was clicked!');
  try {
    const weekData = await sessionsDataService.getThisWeekSessions(
      'U05MVFX85EW'
    );
    const messages = MessageBuilderService.weeklySessions(weekData.cohorts);

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
