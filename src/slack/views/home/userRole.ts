import { CohortUser } from '../../types/cohortSession';
import { Section } from 'slack-block-builder';
import { determineUserRole } from '../../utils/userRoleHelper';

export const buildUserRoleSection = (user: CohortUser) => {
  const role = determineUserRole(user);
  return Section().text(`*Your Role:* ${role}`);
};
