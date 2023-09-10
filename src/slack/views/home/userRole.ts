import { CohortUser } from '../../types/cohortSession';
import { Blocks } from 'slack-block-builder';
import { determineUserRole } from '../../utils/userRoleHelper';

export const buildUserRoleSection = (user: CohortUser) => {
  const role = determineUserRole(user);
  return [Blocks.Section().text(`*Your Role:* ${role}`), Blocks.Divider()];
};
