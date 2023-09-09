import { HomeView } from '@slack/types';
export const getLoadingView = (): HomeView => {
  return {
    type: 'home',
    blocks: [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `:hourglass_flowing_sand: Fetching data... Please wait. :hourglass_flowing_sand:`,
        },
      },
    ],
  };
};
