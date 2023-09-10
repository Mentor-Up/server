import { App } from '@slack/bolt';
import { handleHomeOpened } from '../handlers/events/homePageOpened';

export const registerEventListeners = (slackApp: App) => {
  slackApp.event('app_home_opened', async ({ event, client }) => {
    const userId = event.user;
    await handleHomeOpened(client, userId);
  });
};
