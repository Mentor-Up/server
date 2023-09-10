import { Blocks, Md, Button } from 'slack-block-builder';
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
  const mentor = session.mentor.slackId
    ? Md.user(session.mentor.slackId)
    : session.mentor.name;
  const title = `${session.type} Session with ${mentor}`;

  const sessionDate = formatSessionDate(session, user);
  const sessionStart = formatSessionStartTime(session, user);
  const sessionEnd = formatSessionEndTime(session, user);
  const count = session.students.length;

  // admin view logic
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

  // mentor view logic
  const mentorView = [
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

  // student view logic
  const isAttending = session.students.some(
    (student) => student.slackId === user.id
  );

  const statusText = isAttending ? '(including you)' : '';
  const buttonText = isAttending ? 'Join Video Call' : 'Want to Go!';
  const buttonValue = isAttending ? 'join' : 'want_to_go';

  const studentView = [
    Blocks.Section().text(Md.emoji('books') + ' ' + Md.bold(title)),
    Blocks.Section().text(Md.emoji('calendar') + ' ' + sessionDate),
    Blocks.Section().text(
      Md.emoji('hourglass') + ' ' + sessionStart + ' - ' + sessionEnd
    ),
    Blocks.Section().text(
      Md.emoji('busts_in_silhouette') +
        ` Students attending: ${count} ${statusText}`
    ),
    Blocks.Actions().elements([
      Button()
        .text(buttonText)
        .value(buttonValue)
        .primary(isAttending)
        .danger(!isAttending),
    ]),
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
