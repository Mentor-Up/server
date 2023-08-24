import { Request, Response } from 'express';
import { fetchChannelMembersDetails } from '../../utils/slack/member';

export async function getChannelMembersDetails(
  req: Request,
  res: Response
): Promise<void> {
  const channelId = req.params.channelId;
  const membersDetails = await fetchChannelMembersDetails(channelId);
  res.json({
    channel: {
      id: channelId,
    },
    members: membersDetails,
  });
}
