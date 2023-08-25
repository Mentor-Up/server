import { Request, Response } from 'express';
import { fetchChannelMembersDetails } from '../../utils/slack/member';
import adminService from '../../services/admin';

export async function getChannelMembersDetails(
  req: Request,
  res: Response
): Promise<void> {
  const channelId = req.params.channelId;
  const membersDetails = await fetchChannelMembersDetails(channelId);
  const newMembers = await adminService.handleSlackMembers(membersDetails);
  res.json({
    channel: {
      id: channelId,
    },
    'new members': newMembers,
    'all members': membersDetails,
  });
}
