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
    const sessionMessages = cohort.sessions
      .map((session) => {
        const formattedStart = new Date(session.start).toLocaleString('en-US', {
          weekday: 'short',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        });
        const formattedEnd = new Date(session.end).toLocaleString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
        });
        return `• *Mentoring Session* on ${formattedStart} to ${formattedEnd}. [<${session.link}|Join Session>])`;
      })
      .join('\n'); // extra line between sessions;

    return `*This Week Cohort Sessions:*\n
*Cohort:* ${cohort.name}\n
*Week:* ${cohort.week}\n
*Sessions:*\n
${sessionMessages}\n`;
  }
}

export default MessageBuilderService;
