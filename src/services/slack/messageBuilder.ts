import { CohortData } from './appData';
class MessageBuilderService {
  public buildMessages(cohortsData: CohortData[]): string[] {
    return cohortsData.map((cohort) => this.buildSingleMessage(cohort));
  }

  private buildSingleMessage(cohort: CohortData): string {
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
