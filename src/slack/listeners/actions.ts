import { App } from '@slack/bolt';
import { handleNotifyAllAction } from '../handlers/actions/notifyAllChannels';

export const registerActionListeners = (slackApp: App) => {
  handleNotifyAllAction(slackApp);
};
