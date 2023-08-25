import { Request, Response } from 'express';
import { getAllPrivateChannels } from '../../utils/slack/channel';
import cohortService from '../../services/cohort';

export const getChannels = async (
  req: Request,
  res: Response
): Promise<void> => {
  const channels = await getAllPrivateChannels();
  const cohorts = await cohortService.getNewCohorts(channels);

  res.status(200).json({
    'new cohorts': {
      count: cohorts.length,
      cohorts: cohorts,
    },
    'slack channels': {
      count: channels.length,
      channels,
    },
  });
};
