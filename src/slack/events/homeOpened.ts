import { App } from '@slack/bolt';
import { HomeView } from '@slack/types';
import { generateHomeView, getLoadingView, getErrorView } from '../views';
import sessionDataService from '../../services/slack/sessionsData';

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

      //TODO: update to user slack id
      const sessions = await sessionDataService.getThisWeekSessions(
        '64f73268910c94f0946a3f3f'
      );
      console.log(sessions);

      if (slackResult.user && sessions) {
        const { real_name, tz_offset, tz_label } = slackResult.user;
        const homeView: HomeView = generateHomeView(
          real_name as string,
          tz_offset as number,
          tz_label as string,
          sessions.cohorts
        );
        await client.views.publish({
          user_id: user_id,
          view: homeView,
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
