import { IUser } from '../models/User';
import { ICohort } from '../models/Cohort';
import { SlackMember } from '../utils/slack/member';
import { SlackChannel } from '../utils/slack/channel';

// work on name
class SlackService {
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
