import { HomeView } from '@slack/types';

export const getErrorView = (): HomeView => {
  return {
    type: 'home',
    blocks: [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `:x: No data available 🆘 Try again later.`,
        },
      },
    ],
  };
};
