import { Request, Response } from 'express';
import { fetchChannelMembersDetails } from '../../utils/slack/member';
import slackService from '../../services/slack';
import User from '../../models/User';
import Cohort from '../../models/Cohort';
import conversionService from '../../services/conversion';
import { NotFoundError } from '../../errors';

export async function getNewMembers(
  req: Request,
  res: Response
): Promise<void> {
  const channelId = req.params.channelId;

  // error handling: service is not available
  const [cohort, users, members] = await Promise.all([
    Cohort.findOne({ slackId: channelId }), // TODO: move to a service
    User.find().populate({
      path: 'cohorts',
      select: 'name slackId',
    }), // TODO: move to a service
    fetchChannelMembersDetails(channelId),
  ]);

  // new users
  const newMembers = await slackService.handleNewMembers(members, users);
  const newUsers = newMembers.map((member) =>
    conversionService.convertToUser(member)
  );

  // existing users
  if (!cohort) throw new NotFoundError('Cohort not found');
  const newToCohort = slackService.handleExistingUsers(cohort, members, users);

  res.json({
    cohort: {
      id: cohort.id,
      name: cohort.name,
      slackId: cohort.slackId,
    },
    newUsers: {
      count: newUsers.length,
      list: newUsers,
    },
    newToCohort: {
      count: newToCohort.length,
      list: newToCohort.map((user) => user.generateProfile()),
    },
    'all slack channel members': {
      count: members.length,
      list: members,
    },
  });
}
