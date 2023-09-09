import { App, ExpressReceiver, LogLevel } from '@slack/bolt';
import { registerHomeOpenedEvent } from './events/homeOpened';

const appBotToken = 'xoxb-5756175781729-5743785360178-2er832AYxzFco71dTQbyZyoc';
const signingSecret = 'eb0333f42982f0d4f01a5f55cfaa00e1';
const clientId = '5756175781729.5746164617860';
const clientSecret = '3d019efe3c11d35a5ddad89acd6fa196';
const stateSecret = 'my-state-secret';

const ngrokUrl =
  'https://952c-2603-6080-c02-3319-448c-f9c1-139b-cee2.ngrok-free.app';

export const receiver = new ExpressReceiver({
  signingSecret: signingSecret,
  endpoints: {
    events: '/events',
    actions: '/actions',
    commands: '/commands',
  },
});

const slackApp = new App({
  token: appBotToken,
  receiver: receiver,
  logLevel: LogLevel.DEBUG,
  //   clientId: clientId,
  //   clientSecret: clientSecret,
  //   stateSecret: stateSecret,
  //   scopes: ['chat:write', 'im:write'],
});

slackApp.command('/testbolt', async ({ command, ack, say }) => {
  await ack();
  await say(`Hey there <@${command.user_id}>! Bolt setup seems to be working!`);
});

registerHomeOpenedEvent(slackApp);

slackApp.error(async (error) => {
  console.error(`Failed due to ${error.message}`);
});

export default slackApp;
