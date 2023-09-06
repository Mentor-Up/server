import { Request, Response } from 'express';
import { getAllPrivateChannels } from '../../utils/slack/channel';
import slackDataService from '../../services/slackData';
import Cohort from '../../models/Cohort';
import conversionService from '../../services/conversion';

export const getNewChannels = async (
  req: Request,
  res: Response
): Promise<void> => {
  const [channels, cohorts] = await Promise.all([
    getAllPrivateChannels(),
    Cohort.find(), // refactor to service
  ]);
  const newChannels = await slackDataService.handleNewChannels(
    cohorts,
    channels
  );
  const newCohorts = newChannels.map((channel) =>
    conversionService.convertToCohort(channel)
  );

  res.status(200).json({
    channels: {
      count: newChannels.length,
      list: newChannels,
    },
    cohorts: {
      count: newCohorts.length,
      list: newCohorts,
    },
    'all slack channels': {
      count: channels.length,
      list: channels,
    },
  });
};
