import { Request, Response } from 'express';
import { fetchChannelMembersDetails } from '../../utils/slack/member';
import slackService from '../../services/slack';
import User from '../../models/User';
import conversionService from '../../services/conversion';

export async function getNewMembers(
  req: Request,
  res: Response
): Promise<void> {
  const channelId = req.params.channelId;
  const [members, users] = await Promise.all([
    fetchChannelMembersDetails(channelId),
    User.find(), // TODO: move to a service
  ]);
  const newMembers = await slackService.handleNewMembers(members, users);
  const newUsers = newMembers.map((member) =>
    conversionService.convertToUser(member)
  );

  res.json({
    members: {
      channelId: channelId,
      count: newUsers.length,
      list: newUsers,
    },
    'all channel members': {
      count: members.length,
      list: members,
    },
  });
}
