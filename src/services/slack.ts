// responsiblities
// handle new chnannels logic
// handle new members logic
import { IUser } from '../models/User';
import { SlackMember } from '../utils/slack/member';

// work on name
class SlackService {
  async handleSlackMembers(
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
}

export default new SlackService();
