import { IPopulatedSession, ISession } from '../models/Session';
import Cohort, { ICohort } from '../models/Cohort';
import getCurrentWeek from '../utils/currenWeek';

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
        populate: { path: 'creator', select: 'name _id' },
      });

      const transformedCohorts = cohorts.map((cohort) =>
        this.cohortWeekData(cohort, weekStart)
      );
      return transformedCohorts;
    } catch (error) {
      console.log(error as Error);
      throw new Error((error as Error).message);
    }
  }

  private getCurrentWeek = (cohort: ICohort, today: Date) => {
    return cohort.weeks.find(
      (week) => week.start <= today && week.end >= today
    );
  };

  private cohortWeekData = (cohort: ICohort, today: Date) => {
    const currentWeek = this.getCurrentWeek(cohort, today);
    return {
      cohortId: cohort._id,
      cohortName: cohort.name,
      slackId: cohort.slackId || '',
      classType: cohort.type,
      weekName: currentWeek ? currentWeek.name : '',
      sessions: currentWeek ? currentWeek.sessions : [],
    };
  };
}

export default new AppDataService();
