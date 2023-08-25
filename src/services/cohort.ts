import Cohort, { ICohort } from '../models/Cohort';
import { SlackChannel } from '../utils/slack/channel';
import { isCohortSubject } from '../utils/typeGuards';

class CohortService {
  async fetchAllCohorts(): Promise<ICohort[]> {
    return Cohort.find();
  }

  private convertToCohort(channel: SlackChannel): Partial<ICohort> {
    const cohort: Partial<ICohort> = {
      name: channel.name,
      slackId: channel.slackId,
    };

    if (isCohortSubject(channel.type)) {
      cohort.type = channel.type;
    }

    const startDate = new Date(channel.startDate as string);
    if (!isNaN(startDate.getTime())) {
      cohort.start = startDate;
    }
    return cohort;
  }
}

export default new CohortService();
