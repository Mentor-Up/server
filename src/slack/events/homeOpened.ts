import { App } from '@slack/bolt';

import { getLoadingView, getErrorView, getGreetingsView } from '../views';

export const handleAppHomeOpened = (slackApp: App) => {
  slackApp.event('app_home_opened', async ({ event, client }) => {
    const user_id = event.user;

    await client.views.publish({
      user_id: user_id,
      view: getLoadingView(),
    });

    try {
      const slackResult = await client.users.info({ user: user_id });
      console.log(slackResult);
      // backend call to user sessions

      if (slackResult.user) {
        const { real_name, tz_label, tz_offset } = slackResult.user;
        await client.views.publish({
          user_id: user_id,
          view: getGreetingsView(
            real_name as string,
            tz_offset as number,
            tz_label as string
          ), // TODO: SlackMember interface?
        });
      }
    } catch (error) {
      console.error(`Failed due to ${(error as Error).message}`);
      await client.views.publish({
        user_id: user_id,
        view: getErrorView(),
      });
    }
  });
};
