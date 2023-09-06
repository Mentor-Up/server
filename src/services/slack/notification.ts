import { slackWebClient } from '../../utils/slack/slackWebClient';

class SlackNotificationService {
  async postToChannel(
    channelId: string,
    message: string
  ): Promise<string | null> {
    try {
      console.log('Posting message to channel...');
      const response = await slackWebClient.chat.postMessage({
        channel: channelId,
        text: message,
      });

      console.log('Message sent to channel:', response.ts);

      if (response.ts) {
        return response.ts;
      } else {
        console.warn('Unexpected Slack response format. Missing timestamp.');
        return null;
      }
    } catch (error) {
      console.error('Error posting message to channel:', error);
      return null;
    }
  }
}

export default new SlackNotificationService();
