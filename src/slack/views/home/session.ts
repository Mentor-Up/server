import { Blocks, Md } from 'slack-block-builder';
import { CohortSession } from '../../types/cohortSession';
import { SlackMember } from '../../types/member';
import {
  formatSessionStartTime,
  formatSessionEndTime,
  formatSessionDate,
} from '../../utils/sessionTimeUtils';

export const buildSession = (
  user: SlackMember,
  role: string,
  session: CohortSession
) => {
  // admin version
  // link if going
  // build and convert to basic?
  const mentor = session.mentor.slackId
    ? Md.user(session.mentor.slackId)
    : session.mentor.name;
  const title = `${session.type} Session with ${mentor}`;

  const sessionDate = formatSessionDate(session, user);
  const sessionStart = formatSessionStartTime(session, user);
  const sessionEnd = formatSessionEndTime(session, user);
  const count = session.students.length;

  const adminView = [
    Blocks.Section().text(Md.emoji('books') + ' ' + Md.bold(title)),
    Blocks.Section().text(Md.emoji('calendar') + ' ' + sessionDate),
    Blocks.Section().text(
      Md.emoji('hourglass') + ' ' + sessionStart + ' - ' + sessionEnd
    ),
    Blocks.Section().text(
      Md.emoji('busts_in_silhouette') + ` Students attending: ${count}`
    ),
    Blocks.Section().text(Md.link(session.link, 'Join Session')),
    Blocks.Divider(),
  ];

  const mentorView = [
    Blocks.Section().text('*Mentor Session View*'),
    Blocks.Divider(),
  ];

  const studentView = [
    Blocks.Section().text('*Mentor Session View*'),
    Blocks.Divider(),
  ];

  if (role.toLowerCase() === 'admin') {
    return adminView;
  } else if (role.toLowerCase() === 'mentor') {
    return mentorView;
  } else {
    return studentView;
  }
};
