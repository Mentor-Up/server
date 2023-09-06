import { CohortData } from './appData';

interface IMessage {
  channelId: string;
  text: string;
}

class MessageBuilderService {
  public static buildMessages(cohortsData: CohortData[]): IMessage[] {
    return cohortsData.map((cohortSessions) => {
      return {
        channelId: cohortSessions.slackId,
        text: this.buildSingleMessage(cohortSessions),
      };
    });
  }

  private static buildSingleMessage(cohort: CohortData): string {
    let message = '*This Week Cohort Sessions:*\n\n';

    message += `*Cohort:* ${cohort.name}\n`;
    message += `*Week:* ${cohort.week}\n`;
    message += '*Sessions:*\n';

    cohort.sessions.forEach((session) => {
      message += `- ${session.type} on ${session.start} to ${session.end}. [Link](${session.link})\n`;
    });

    message += '\n';
    return message;
  }
}

export default MessageBuilderService;
