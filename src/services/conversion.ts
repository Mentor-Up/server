import { ICohort } from '../models/Cohort';
import User, { IUser } from '../models/User';
import { isCohortSubject } from '../utils/typeGuards';
import { SlackChannel } from '../utils/slack/channel';
import { SlackMember } from '../slack/types/member';

class ConvesionService {
  convertToCohort(channel: SlackChannel): Partial<ICohort> {
    const cohort: Partial<ICohort> = {
      name: channel.name,
      slackId: channel.slackId,
    };

    if (isCohortSubject(channel.type)) {
      cohort.type = channel.type;
    }

    const startDate = new Date(channel.startDate as string);
    if (!isNaN(startDate.getTime())) {
      cohort.start = startDate;
    }
    return cohort;
  }

  convertToUser(member: SlackMember): Partial<IUser> {
    type UserRole = IUser['role'][number];

    const user: Partial<IUser> = {
      name: member.name,
      email: member.email,
      slackId: member.id,
      avatarUrl: member.avatarUrl,
    };

    if (this.isValidTitle(member.title)) {
      user.role = [member.title.toLocaleLowerCase() as UserRole];
    } else {
      user.role = ['student'];
    }
    return user;
  }

  private isValidTitle(title: string): boolean {
    return ['student', 'mentor', 'student-leader', 'admin'].includes(
      title.toLowerCase()
    );
  }
}

export default new ConvesionService();
