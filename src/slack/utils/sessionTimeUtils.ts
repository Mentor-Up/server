import moment from 'moment-timezone';
import { CohortSession } from '../types/cohortSession';
import { SlackMember } from '../types/member';

const convertToUserTime = (utcDate: Date, user: SlackMember): moment.Moment => {
  return moment.tz(utcDate, 'UTC').tz(user.tz);
};

export const formatSessionStart = (
  session: CohortSession,
  user: SlackMember
): string => {
  const startTime = convertToUserTime(session.start, user);
  return startTime.format('dddd, MMM D [at] h:mm a');
};

const formatSessionEnd = (
  session: CohortSession,
  user: SlackMember
): string => {
  const endTime = convertToUserTime(session.end, user);
  return endTime.format('h:mm a');
};

export const calculateDuration = (session: CohortSession): string => {
  const start = moment(session.start);
  const end = moment(session.end);
  const duration = moment.duration(end.diff(start));

  const hours = duration.hours();
  const minutes = duration.minutes();

  return `${hours ? hours + 'h ' : ''}${minutes}m`;
};
