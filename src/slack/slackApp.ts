import { App, ExpressReceiver, LogLevel } from '@slack/bolt';
import { registerHomeOpenedEvent } from './events/homeOpened';
import {
  SLACK_APP_SIGNING_SECRET,
  SLACK_API_BOT_USER_OAUTH_TOKEN,
} from '../config';

import { registerActionListeners } from './listeners/actions';

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

registerActionListeners(slackApp);
registerHomeOpenedEvent(slackApp);

slackApp.error(async (error) => {
  console.error(`Failed due to ${error.message}`);
});

export default slackApp;
