import { Request, Response } from 'express';
import { fetchChannelMembersDetails } from '../../utils/slack/member';
import slackDataService from '../../services/slackData';
import User from '../../models/User';
import Cohort from '../../models/Cohort';
import conversionService from '../../services/conversion';
import { NotFoundError } from '../../errors';

export async function getNewMembers(
  req: Request,
  res: Response
): Promise<void> {
  const channelId = req.params.channelId;

  const [cohort, users, members] = await Promise.all([
    // TODO: add Cohort and User services
    Cohort.findOne({ slackId: channelId }),
    User.find().populate({
      path: 'cohorts',
      select: 'name slackId',
    }),
    fetchChannelMembersDetails(channelId),
  ]);
  if (!cohort) throw new NotFoundError('Cohort not found');
  if (!users) throw new NotFoundError('Users not found');

  const newMembers = await slackDataService.handleNewMembers(members, users);
  const newToCohort = slackDataService.handleExistingUsers(
    cohort,
    members,
    users
  );

  res.json({
    cohort: {
      id: cohort.id,
      name: cohort.name,
      slackId: cohort.slackId,
    },
    newUsers: {
      count: newMembers.length,
      list: newMembers.map((member) => conversionService.convertToUser(member)),
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
