import { Request, Response, NextFunction } from 'express';
import { getAllPrivateChannels } from '../../utils/slack';

export const getChannels = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const channels = await getAllPrivateChannels();
    res.json({ channels });
  } catch (error) {
    console.error('Error fetching channels:', error);
    next(error);
  }
};
