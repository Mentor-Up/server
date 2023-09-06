import { CohortData } from './appData';

interface ChannelMessage {
  channelId: string;
  text: string;
  blocks: any[];
}

class MessageBuilderService {
  public static weeklySessions(cohortsData: CohortData[]): ChannelMessage[] {
    return cohortsData.map((cohort) => {
      return {
        channelId: cohort.slackId,
        text: 'Weekly Sessions Update',
        blocks: this.buildWeeklyMessageForChannel(cohort),
      };
    });
  }

  private static buildWeeklyMessageForChannel(cohort: CohortData): any[] {
    const headerBlock = {
      type: 'header',
      text: {
        type: 'plain_text',
        text: 'This Week Cohort Sessions:',
      },
    };

    const cohortDetailsBlock = {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `*Cohort:* ${cohort.name}\n*Week:* ${cohort.week}`,
      },
    };

    const sessionBlocks = cohort.sessions.map((session) => {
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
      return {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `• *Mentoring Session* on ${formattedStart} to ${formattedEnd}. [<${session.link}|Join Session>]`,
        },
      };
    });

    return [headerBlock, cohortDetailsBlock, ...sessionBlocks];
  }
}

export default MessageBuilderService;
