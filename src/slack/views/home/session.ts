import { Blocks } from 'slack-block-builder';
import { CohortSession } from '../../types/cohortSession';

export const buildSession = (role: string, session: CohortSession) => {
  // admin version
  // type
  // mentor/creator
  // start
  // end
  // duration
  // link if going

  // build and convert to basic?
  const adminSessionView = [
    Blocks.Divider(),
    Blocks.Section().text('*Session*'),
  ];

  if (role.toLowerCase() === 'admin') {
    return adminSessionView;
  } else {
    return [Blocks.Divider()];
  }
};
