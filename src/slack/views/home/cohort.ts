import { Blocks, Md } from 'slack-block-builder';
import { ThisWeekCohortSessions } from '../../types/cohortSession';

export const buildCohortSection = (cohort: ThisWeekCohortSessions) => {
  const channel = cohort.slackId ? Md.channel(cohort.slackId) : cohort.name;
  return [
    Blocks.Header().text(cohort.week),
    Blocks.Section().text(
      Md.emoji('slack') + ' ' + channel + ': ' + cohort.type
    ),
    Blocks.Divider(),
  ];
};
