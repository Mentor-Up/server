import { ThisWeekCohortSessions } from '../types/cohortSession';

interface ChannelMessage {
  channelId: string;
  text: string;
  blocks: any[];
}

class MessageBuilderService {
  public static weeklySessions(
    cohortsData: ThisWeekCohortSessions[]
  ): ChannelMessage[] {
    return cohortsData.map((cohort) => {
      return {
        channelId: cohort.slackId!,
        text: 'Weekly Sessions Update',
        blocks: this.buildWeeklyMessageForChannel(cohort),
      };
    });
  }

  private static buildWeeklyMessageForChannel(
    cohort: ThisWeekCohortSessions
  ): any[] {
    const headerBlock = {
      type: 'header',
      text: {
        type: 'plain_text',
        text: `${cohort.name}'s ${cohort.week} Sessions:`,
      },
    };

    const footerTextBlock = {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: 'Want to see the upcoming sessions converted to your timezone or need more details?',
      },
    };

    const footerActionsBlock = {
      type: 'actions',
      elements: [
        {
          type: 'button',
          text: {
            type: 'plain_text',
            text: 'MentorUp Web',
          },
          url: 'http://localhost:8000/api/v1/session/upcoming',
        },
        {
          type: 'button',
          text: {
            type: 'plain_text',
            text: 'MentorUp Slack',
          },
          url: 'slack://app?team=T05N855NZMF&id=A05MY4UJ5RA&tab=home',
        },
      ],
    };

    const sessionBlocks = cohort.sessions.flatMap((session) => {
      const formattedStart = new Date(session.start).toLocaleString('en-US', {
        weekday: 'long',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      });

      const durationMillis =
        new Date(session.end).getTime() - new Date(session.start).getTime();
      const durationHours = Math.floor(durationMillis / (1000 * 60 * 60));
      const durationMinutes = Math.floor(
        (durationMillis % (1000 * 60 * 60)) / (1000 * 60)
      );
      let durationString = '';
      if (durationHours > 0) {
        durationString += `${durationHours} hour`;
      }
      if (durationMinutes > 0) {
        durationString += `${durationMinutes} minutes`;
      }

      const participantCount = session.students.length;
      const participantString = `${participantCount} student${
        participantCount !== 1 ? 's' : ''
      }`;

      return [
        { type: 'divider' },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `${session.type} Session with <@${
              session.mentor.slackId
            }>\n When: ${formattedStart} EST for ${durationString}.\n(${participantString} ${
              participantCount === 1 ? 'is' : 'are'
            } attending so far)`,
          },
        },
      ];
    });

    return [headerBlock, ...sessionBlocks, footerTextBlock, footerActionsBlock];
  }
}

export default MessageBuilderService;
