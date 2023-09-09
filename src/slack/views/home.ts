import { HomeView } from '@slack/types';
import { getGreetingsView } from './greeting';
import { getCohortsView } from './sessions';
import { ThisWeekCohortSessions } from '../services/sessions';

// This function will generate the Home view for the user
export const generateHomeView = (
  real_name: string,
  tz_offset: number,
  tz_label: string,
  sessions: ThisWeekCohortSessions[]
): HomeView => {
  const greetingsBlock = getGreetingsView(real_name, tz_offset, tz_label);
  const sessionsBlocks = getCohortsView(sessions);

  // You can add more blocks as required for the Home view
  return {
    type: 'home',
    blocks: [
      ...greetingsBlock,
      ...sessionsBlocks,
      // Other blocks can be added here
    ],
  };
};
