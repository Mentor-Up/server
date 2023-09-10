import { SlackActionMiddlewareArgs } from '@slack/bolt';

import sessionsDataService from '../../services/sessions';
import MessageBuilderService from '../../services/messageBuilder';
import SlackNotificationService from '../../services/notification';

export const handleNotifyAllChannels = async (
  args: SlackActionMiddlewareArgs
) => {
  const { ack, body } = args;
  await ack();
  try {
    const weekData = await sessionsDataService.getThisWeekSessions(
      body.user.id
    );
    const messages = MessageBuilderService.weeklySessions(weekData.cohorts);

    await Promise.all(
      messages.map(async (message) => {
        const response = await SlackNotificationService.postToChannel(
          message.channelId,
          message.text,
          message.blocks
        );

        if (response) {
          return { success: true, channelId: message.channelId, response };
        } else {
          return {
            success: false,
            channelId: message.channelId,
            error: 'Failed after retries',
          };
        }
      })
    );
  } catch (error) {
    console.error('Error in handleNotifyAllChannels:', error);
  }
};
