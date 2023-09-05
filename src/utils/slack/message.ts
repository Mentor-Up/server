import { slackWebClient } from './slackWebClient';

export const postToChannel = async () => {
  try {
    console.log('Posting message to channel...');
    const response = await slackWebClient.chat.postMessage({
      channel: 'C05PG2K45EE', // hedgehog
      text: 'hey you!',
    });

    console.log('Message sent to channel:', response.ts);
  } catch (error) {
    console.error('Error posting message to channel:', error);
  }
};

export const sendDM = async () => {
  try {
    const response = await slackWebClient.conversations.open({
      users: 'U05MVFX85EW',
    });

    if (response.ok && response.channel && response.channel.id) {
      await slackWebClient.chat.postMessage({
        channel: response.channel.id,
        text: 'Hey there',
      });
    } else {
      // Handle error or unexpected response
      console.error(
        'Failed to post message due to an unexpected response or missing channel ID.'
      );
    }
  } catch (error) {
    console.error('Error sending direct message:', error);
  }
};
