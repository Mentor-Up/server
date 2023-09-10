import { App } from '@slack/bolt';
import { handleNotifyAllChannels } from '../handlers/actions/notifyAllChannels';

export const registerActionListeners = (slackApp: App) => {
  slackApp.action('notify_all_channels_action', async (payload) => {
    await handleNotifyAllChannels(payload);
  });
};
