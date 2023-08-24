import { Request, Response } from 'express';
import { getAllPrivateChannels } from '../../utils/slack/channel';

export const getChannels = async (
  req: Request,
  res: Response
): Promise<void> => {
  const channels = await getAllPrivateChannels();
  res.status(200).json({ 'CTD-Dev Channels': channels });
};
