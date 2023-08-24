import { Request, Response } from 'express';
import {
  getAllPrivateChannels,
  syncChannelsWithCohorts,
} from '../../utils/slack/channel';

export const getChannels = async (
  req: Request,
  res: Response
): Promise<void> => {
  const channels = await getAllPrivateChannels();

  const newCohorts = await syncChannelsWithCohorts();

  res.status(200).json({
    'CTD-Dev Channels': channels,
    Cohorts: newCohorts,
  });
};
