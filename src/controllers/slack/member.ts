import { Request, Response, NextFunction } from 'express';
import { fetchChannelMembersDetails } from '../../utils/slack/member';

export async function getChannelMembersDetails(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const channelId = req.params.channelId; // Get the channelId from the request params
  try {
    const membersDetails = await fetchChannelMembersDetails(channelId);
    const response = {
      channel: {
        id: channelId,
      },
      members: membersDetails,
    };
    res.json(response);
  } catch (error) {
    console.error('Error fetching channel members details:', error);
    next(error);
  }
}
