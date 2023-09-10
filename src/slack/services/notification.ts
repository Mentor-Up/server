import { slackWebClient } from '../../utils/slack/slackWebClient';

class SlackNotificationService {
  private async postWithRetry(
    channelId: string,
    text: string,
    message: any[],
    retries: number = 3
  ): Promise<string | null> {
    for (let i = 0; i < retries; i++) {
      try {
        const response = await slackWebClient.chat.postMessage({
          channel: channelId,
          text: text,
          blocks: message,
        });
        if (response.ts) {
          return response.ts;
        } else {
          console.warn('Unexpected Slack response format. Missing timestamp.');
        }
      } catch (error) {
        console.error(
          `Error posting message to channel. Attempt ${i + 1} of ${retries}:`,
          error
        );
      }
    }
    console.error(`Failed to post message after ${retries} attempts.`);
    return null;
  }

  async postToChannel(
    channelId: string,
    text: string,
    message: any[]
  ): Promise<string | null> {
    return this.postWithRetry(channelId, text, message);
  }
}

export default new SlackNotificationService();
