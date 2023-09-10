import { WebClient } from '@slack/web-api';
import { Blocks, HomeTab } from 'slack-block-builder';
import {
  getGenericGreetingView,
  getGreetingsView,
} from '../views/home/greetings';
import { buildUserRoleSection } from '../views/home/userRole';
import { buildCohortSection } from '../views/home/cohort';
import { getLoadingView, getErrorView } from '../views';
import sessionsService from '../services/sessions';
import { SlackMember } from '../types/member';
import { extractMemberProfile } from '../utils/memberHelper';

export const handleHomeOpened = async (client: WebClient, userId: string) => {
  console.log('handleHomeOpened');

  await client.views.publish({
    user_id: userId,
    view: getLoadingView(),
  });

  let greetingView = getGenericGreetingView();

  try {
    const slackUserInfo = await client.users.info({ user: userId });
    if (slackUserInfo.ok) {
      const member: SlackMember = extractMemberProfile(slackUserInfo);
      greetingView = getGreetingsView(member);
    }
  } catch (error) {
    console.error(
      `Failed to fetch user info due to ${(error as Error).message}`
    );
  }

  let sessionView: any[] = [];
  try {
    const sessions = await sessionsService.getThisWeekSessions(userId);
    console.log('Sessions:', sessions);
    const userRoleSection = buildUserRoleSection(sessions.user);
    sessionView.push(...userRoleSection);

    // cohort section
    sessions.cohorts.forEach((cohort) => {
      const cohortSection = buildCohortSection(cohort);
      sessionView.push(...cohortSection);
    });

    // placeholder
    sessionView.push(Blocks.Section().text('Session details would go here'));
  } catch (error) {
    console.error(
      `Failed to fetch sessions due to ${(error as Error).message}`
    );
    sessionView = [getErrorView()];
  }

  const homeTab = HomeTab()
    .blocks([...greetingView, ...sessionView])
    .buildToObject();

  await client.views.publish({
    user_id: userId,
    view: homeTab,
  });
};
