import { slackWebClient } from '../../utils/slack/slackWebClient';

class SlackNotificationService {
  private async postWithRetry(
    channelId: string,
    message: string,
    retries: number = 3
  ): Promise<string | null> {
    for (let i = 0; i < retries; i++) {
      try {
        const response = await slackWebClient.chat.postMessage({
          channel: channelId,
          text: message,
        });
        if (response.ts) {
          console.log('Message sent to channel:', response.ts);
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
    message: string
  ): Promise<string | null> {
    return this.postWithRetry(channelId, message);
  }
}

export default new SlackNotificationService();
