import { IWeek } from '../../models/Week';
import Cohort, { ICohort } from '../../models/Cohort';
import User, { IUser } from '../../models/User';
import { NotFoundError } from '../../errors';

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

class SessionsDataService {
  private getCohortFindPredicate(
    user: IUser,
    today: Date
  ): Record<string, any> {
    let predicate: Record<string, any> = {
      start: { $lte: today },
      end: { $gte: today },
      slackId: { $ne: null },
    };

    if (!user.role.includes('admin')) {
      predicate['_id'] = { $in: user.cohorts };
    }
    return predicate;
  }

  private getSessionPopulateOptions(user: IUser) {
    if (user.role.includes('mentor')) {
      return {
        path: 'weeks.sessions',
        match: { creator: user._id }, // session created by mentor
        populate: {
          path: 'participant',
          select: 'name _id slackId',
          model: 'User',
        },
      };
    } else {
      return {
        path: 'weeks.sessions',
        populate: [
          {
            path: 'creator',
            select: 'name _id slackId',
          },
          {
            path: 'participant',
            select: 'name _id slackId',
            model: 'User',
          },
        ],
      };
    }
  }

  async getThisWeekSessions(
    slackId: string
  ): Promise<{ user: CohortUser; cohorts: ThisWeekCohortSessions[] }> {
    const user = await User.findOne({ slackId });
    if (!user) {
      throw new NotFoundError('User not found.');
    }
    const today = new Date();

    const predicate = this.getCohortFindPredicate(user, today);
    const populateOptions = this.getSessionPopulateOptions(user);
    const cohorts = await Cohort.find(predicate).populate(populateOptions);

    return {
      user: this.handleCohortUser(user),
      cohorts: cohorts.map((cohort) => this.handleCohortData(cohort, today)),
    };
  }

  private handleCohortData(
    cohort: ICohort,
    date: Date
  ): ThisWeekCohortSessions {
    const week = this.getThisWeek(cohort, date);
    return {
      id: cohort._id,
      name: cohort.name,
      slackId: cohort.slackId || null,
      type: cohort.type,
      weekId: week._id,
      week: week.name,
      sessions: week.sessions.map((session) =>
        this.handleCohortSession(session)
      ),
    };
  }

  private getThisWeek(cohort: ICohort, date: Date): IWeek {
    return cohort.weeks.find((week) => week.start <= date && week.end >= date)!;
  }

  private handleCohortUser(user: Partial<IUser>): CohortUser {
    return {
      id: user._id,
      name: user.name || 'Unknown',
      slackId: user.slackId || null,
      isAdmin: user.role?.includes('admin') || false,
      isMentor: user.role?.includes('mentor') || false,
    };
  }

  // TODO: find the way to avoid any type
  private handleCohortSession(session: any): CohortSession {
    return {
      id: session._id,
      type: session.type,
      start: session.start,
      end: session.end,
      mentor: this.handleCohortUser(session.creator),
      students: session.participant.map((user: Partial<IUser>) =>
        this.handleCohortUser(user)
      ),
      link: session.link,
    };
  }
}

export default new SessionsDataService();
