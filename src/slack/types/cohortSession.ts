export interface CohortUser {
  id: string;
  name: string;
  slackId: string | null;
  isAdmin: boolean;
  isMentor: boolean;
}

export interface CohortSession {
  id: string;
  type: string;
  start: Date;
  end: Date;
  mentor: CohortUser;
  students: CohortUser[];
  link: string;
}

export interface ThisWeekCohortSessions {
  id: string;
  name: string;
  slackId: string | null;
  type: string;
  weekId: string;
  week: string;
  sessions: CohortSession[];
}
