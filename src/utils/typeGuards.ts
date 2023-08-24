import { CohortSubject } from '../models/Cohort';

export const isCohortSubject = (subject: string): subject is CohortSubject => {
  const cohortSubjects = [
    'Intro to programming',
    'React.js',
    'Node.js/Express',
    'Ruby on Rails',
  ];
  return cohortSubjects.includes(subject);
};
