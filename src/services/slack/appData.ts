import Cohort, { ICohort } from '../../models/Cohort';
import getCurrentWeek from '../../utils/currenWeek';

export interface CohortData {
  _id: string;
  name: string;
  slackId: string;
  type: string;
  week: string;
  sessions: {
    id: string;
    type: string;
    start: Date;
    end: Date;
    creator: {
      _id: string;
      name: string;
      slackId: string;
    };
    participants: [
      {
        _id: string;
        name: string;
        slackId: string;
      },
    ];
    link: string;
  }[];
}

class AppDataService {
  async currentWeekData() {
    const { weekStart, weekEnd } = getCurrentWeek();
    console.log('start', weekStart);
    console.log('end', weekEnd);

    try {
      const cohorts = await Cohort.find({
        start: { $lte: weekStart },
        end: { $gte: weekStart },
        slackId: { $ne: null },
      }).populate({
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
      });

      const transformedCohorts = cohorts.map((cohort) =>
        this.cohortWeekData(cohort, weekStart)
      );
      return transformedCohorts;
    } catch (error) {
      console.error(error as Error);
      throw new Error((error as Error).message);
    }
  }

  private getCurrentWeek = (cohort: ICohort, today: Date) => {
    return cohort.weeks.find(
      (week) => week.start <= today && week.end >= today
    );
  };

  private cohortWeekData = (cohort: ICohort, today: Date): CohortData => {
    const currentWeek = this.getCurrentWeek(cohort, today);
    console.log('currentWeekStart', currentWeek?.start);
    return {
      _id: cohort._id,
      name: cohort.name,
      slackId: cohort.slackId || '',
      type: cohort.type,
      week: currentWeek ? currentWeek.name : '',
      sessions: currentWeek
        ? currentWeek.sessions.map(this.transformSession)
        : [],
    };
  };

  private transformSession(session: any): CohortData['sessions'][0] {
    return {
      id: session._id.toString(),
      type: session.type,
      start: session.start,
      end: session.end,
      creator: {
        _id: session.creator._id.toString(),
        name: session.creator.name,
        slackId: session.creator.slackId,
      },
      participants: session.participant.map((user: any) => ({
        _id: user._id.toString(),
        name: user.name,
        slackId: user.slackId,
      })),
      link: session.link,
    };
  }
}

export default new AppDataService();
