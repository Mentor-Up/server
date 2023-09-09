import { WebClient } from '@slack/web-api';
import { getLoadingView, generateHomeView, getErrorView } from '../views';
import { HomeView } from '@slack/types';
import sessionsService from '../services/sessions';

export const handleHomeOpened = async (client: WebClient, userId: string) => {
  console.log('handleHomeOpened');

  await client.views.publish({
    user_id: userId,
    view: getLoadingView(),
  });

  try {
    const slackUserInfo = await client.users.info({ user: userId });
    console.log(slackUserInfo);
    const sessions = await sessionsService.getThisWeekSessions(userId);
    console.log(sessions);

    if (slackUserInfo.user && sessions) {
      const { real_name, tz_offset, tz_label } = slackUserInfo.user;
      const homeView: HomeView = generateHomeView(
        real_name as string,
        tz_offset as number,
        tz_label as string,
        sessions.cohorts
      );
      await client.views.publish({
        user_id: userId,
        view: homeView,
      });
    }
  } catch (error) {
    console.error(`Failed due to ${(error as Error).message}`);
    await client.views.publish({
      user_id: userId,
      view: getErrorView(),
    });
  }
};
