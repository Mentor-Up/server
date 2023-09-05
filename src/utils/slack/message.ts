import { slackWebClient } from './slackWebClient';
import appDataServices from '../../services/appData';

export const postToChannel = async () => {
  try {
    console.log('Posting message to channel...');
    const message = await buildWeeklySessionsMessage();
    console.log(message);
    const response = await slackWebClient.chat.postMessage({
      channel: 'C05PG2K45EE', // hedgehog
      text: message,
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

const buildWeeklySessionsMessage = async () => {
  const cohortsData = await appDataServices.currentWeekData();

  let message = '*This Week Cohort Sessions:*\n\n';

  cohortsData.forEach((cohort) => {
    message += `*Cohort:* ${cohort.cohortName}\n`;
    message += `*Week:* ${cohort.weekName}\n`;
    message += '*Sessions:*\n';

    cohort.sessions.forEach((session: any) => {
      message += `- ${session.type} on ${session.start} to ${session.end}. [Link](${session.link})\n`;
    });

    message += '\n';
  });

  return message;
};
