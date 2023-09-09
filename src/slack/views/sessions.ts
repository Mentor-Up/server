import { ThisWeekCohortSessions, CohortSession } from '../services/sessions';

// Function to generate a view for a single session
const getSessionView = (session: CohortSession) => {
  return {
    type: 'section',
    text: {
      type: 'mrkdwn',
      text: `*${session.type} Session*\nMentor: ${
        session.mentor.name
      }\nTime: ${new Date(session.start).toLocaleString()} - ${new Date(
        session.end
      ).toLocaleString()}\n[Join Session](${session.link})`,
    },
  };
};

// Function to generate a view for a week of a cohort
const getCohortWeekView = (cohortWeek: ThisWeekCohortSessions) => {
  const sessionBlocks = cohortWeek.sessions.map(getSessionView);
  return [
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `*${cohortWeek.name} - ${cohortWeek.week}*`,
      },
    },
    ...sessionBlocks,
  ];
};

// Function to generate a view for all cohorts
export const getCohortsView = (cohorts: ThisWeekCohortSessions[]) => {
  return cohorts.flatMap(getCohortWeekView);
};
