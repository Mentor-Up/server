import { Blocks } from 'slack-block-builder';
import { CohortSession } from '../../types/cohortSession';
import { SlackMember } from '../../types/member';
import {
  formatSessionStart,
  calculateDuration,
} from '../../utils/sessionTimeUtils';

export const buildSession = (
  user: SlackMember,
  role: string,
  session: CohortSession
) => {
  // admin version
  // type
  // mentor/creator
  // start
  // end
  // duration
  // link if going

  // build and convert to basic?

  const sessionStart = formatSessionStart(session, user);
  const sessionDuration = calculateDuration(session);

  const adminView = [
    Blocks.Section().text('*Admin Session View*'),
    Blocks.Section().text(`*Type:* ${session.type} Session`),
    Blocks.Section().text(`*Mentor:* ${session.mentor.name}`),
    Blocks.Section().text(`*When:* ${sessionStart}`),
    Blocks.Section().text(`*Duration:* ${sessionDuration}`),

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
