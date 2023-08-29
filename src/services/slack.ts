import { IUser } from '../models/User';
import { ICohort } from '../models/Cohort';
import { SlackMember } from '../utils/slack/member';
import { SlackChannel } from '../utils/slack/channel';

// work on name
class SlackService {
  // should this be async
  async handleNewMembers(
    members: SlackMember[],
    users: IUser[]
  ): Promise<SlackMember[]> {
    const newMembers = members.filter((member) => {
      return !users.some(
        (user) => user.slackId === member.id || user.email === member.email
      );
    });
    return newMembers;
  }

  handleExistingUsers(
    cohort: ICohort,
    members: SlackMember[],
    users: IUser[]
  ): IUser[] {
    const newToCohort = users.filter((user) => {
      return members.some((member) => {
        return (
          (user.slackId === member.id || user.email === member.email) &&
          !cohort.participants.includes(user._id)
        );
      });
    });

    return newToCohort;
  }

  async handleNewChannels(
    cohorts: ICohort[],
    channels: SlackChannel[]
  ): Promise<SlackChannel[]> {
    const newChannels = channels.filter((channel) => {
      return !cohorts.some(
        (cohort) =>
          cohort.slackId === channel.slackId ||
          cohort.name.toLowerCase() === channel.name.toLowerCase() ||
          channel.numberOfMembers <= 1 // admin only channel
      );
    });
    return newChannels;
  }
}

export default new SlackService();
