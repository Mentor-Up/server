import { CohortData } from './appData';

interface ChannelMessage {
  channelId: string;
  text: string;
}

class MessageBuilderService {
  public static weeklySessions(cohortsData: CohortData[]): ChannelMessage[] {
    return cohortsData.map((cohort) => {
      return {
        channelId: cohort.slackId,
        text: this.buildWeeklyMessageForChannel(cohort),
      };
    });
  }

  private static buildWeeklyMessageForChannel(cohort: CohortData): string {
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
