import { Request, Response } from 'express';
import { getAllPrivateChannels } from '../../utils/slack/channel';
import slackService from '../../services/slack';
import Cohort from '../../models/Cohort';

export const getNewChannels = async (
  req: Request,
  res: Response
): Promise<void> => {
  const [channels, cohorts] = await Promise.all([
    getAllPrivateChannels(),
    Cohort.find(), // refactor to service
  ]);
  const newChannels = await slackService.handleNewChannels(cohorts, channels);

  res.status(200).json({
    channels: {
      count: newChannels.length,
      list: newChannels,
    },
    'all slack channels': {
      count: channels.length,
      list: channels,
    },
  });
};
