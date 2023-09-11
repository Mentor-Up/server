import { Blocks, Button } from 'slack-block-builder';
import { ThisWeekCohortSessions } from '../../types/cohortSession';

export const buildUserRoleSection = (
  role: string,
  sessionsByChannels: ThisWeekCohortSessions[]
) => {
  let section = Blocks.Section().text(`*Your Role:* ${role}`);

  if (role.toLowerCase() === 'admin') {
    const notifyButton = Button()
      .text('Notify All Channels')
      .actionId('notify_all_channels_action');

    section = section.accessory(notifyButton);
  }

  return [section, Blocks.Divider()];
};
