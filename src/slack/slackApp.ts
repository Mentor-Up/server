import { App, ExpressReceiver, LogLevel } from '@slack/bolt';
import { registerHomeOpenedEvent } from './events/homeOpened';
import {
  SLACK_APP_SIGNING_SECRET,
  SLACK_API_BOT_USER_OAUTH_TOKEN,
} from '../config';

import appDataService from '../services/slack/appData';
import MessageBuilderService from '../services/slack/messageBuilder';
import SlackNotificationService from '../services/slack/notification';

export const receiver = new ExpressReceiver({
  signingSecret: SLACK_APP_SIGNING_SECRET!,
  endpoints: {
    events: '/events',
    actions: '/actions',
    commands: '/commands',
  },
});

const slackApp = new App({
  token: SLACK_API_BOT_USER_OAUTH_TOKEN,
  receiver: receiver,
  logLevel: LogLevel.DEBUG,
});

slackApp.command('/testbolt', async ({ command, ack, say }) => {
  await ack();
  await say(`Hey there <@${command.user_id}>! Bolt setup seems to be working!`);
});

slackApp.action(
  'notify_all_channels_action',
  async ({ ack, body, context }) => {
    await ack();
    console.log('Notify All button was clicked!');
    try {
      const weekData = await appDataService.currentWeekData();
      const messages = MessageBuilderService.weeklySessions(weekData);

      const channelId = 'C05PG2K45EE'; //hedgehog;
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
  }
);

registerHomeOpenedEvent(slackApp);

slackApp.error(async (error) => {
  console.error(`Failed due to ${error.message}`);
});

export default slackApp;
