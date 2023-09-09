import { App } from '@slack/bolt';
import { handleHomeOpened } from '../controllers/home';

export const registerHomeOpenedEvent = (slackApp: App) => {
  slackApp.event('app_home_opened', async ({ event, client }) => {
    const userId = event.user;
    await handleHomeOpened(client, userId);
  });
};
