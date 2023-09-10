import { Blocks } from 'slack-block-builder';
import { ThisWeekCohortSessions } from '../../types/cohortSession';

export const buildCohortSection = (cohort: ThisWeekCohortSessions) => {
  return [
    Blocks.Header().text(`${cohort.name}: ${cohort.week}`),
    Blocks.Divider(),
  ];
};
