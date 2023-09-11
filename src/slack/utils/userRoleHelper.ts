import { CohortUser } from '../types/cohortSession';

export const determineUserRole = (user: CohortUser): string => {
  if (user.isAdmin) return 'Admin';
  if (user.isMentor) return 'Mentor';
  return 'Student';
};
