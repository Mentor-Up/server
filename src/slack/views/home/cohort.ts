import { Divider, Section } from 'slack-block-builder';
import { ThisWeekCohortSessions } from '../../types/cohortSession';

export const buildCohortSection = (cohort: ThisWeekCohortSessions) => {
  const blocks = [];
  //   blocks.push(Section().text(`*Cohort Name:* ${cohort.name}`));
  blocks.push(Section().text(`*${cohort.name}*: ${cohort.week}`));
  blocks.push(Divider());
  return blocks;
};
