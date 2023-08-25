import { Request, Response } from 'express';
import { fetchChannelMembersDetails } from '../../utils/slack/member';
import slackService from '../../services/slack';
import User from '../../models/User';

export async function getChannelMembersDetails(
  req: Request,
  res: Response
): Promise<void> {
  const channelId = req.params.channelId;
  const membersDetails = await fetchChannelMembersDetails(channelId);
  // TODO: move to a service
  const users = await User.find();
  const newMembers = await slackService.handleSlackMembers(
    membersDetails,
    users
  );
  res.json({
    channel: {
      id: channelId,
    },
    'new members': newMembers,
    'all members': membersDetails,
  });
}
