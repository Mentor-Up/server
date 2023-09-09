import { Block, SectionBlock, HeaderBlock } from '@slack/types';

export const getGreetingsView = (
  real_name: string,
  tz_offset: number,
  tz_label: string
): Block[] => {
  const { greeting, emoji, message } = getTimeBasedGreetingAndEmoji(tz_offset);
  const headerBlock: HeaderBlock = {
    type: 'header',
    text: {
      type: 'plain_text',
      text: `Hello, ${real_name}! 😃`,
    },
  };

  const greetingBlock: SectionBlock = {
    type: 'section',
    text: {
      type: 'mrkdwn',
      text: `${emoji} ${greeting} to you in *${tz_label}* timezone! 🌎\n ${message}`,
    },
  };

  return [headerBlock, greetingBlock];
};

const getTimeBasedGreetingAndEmoji = (tz_offset: number) => {
  // Convert the offset to milliseconds and add it to the current UTC time
  const currentTime = new Date(Date.now() + tz_offset * 1000);
  const hour = currentTime.getUTCHours();

  if (hour >= 5 && hour < 12) {
    return {
      greeting: 'Good morning',
      emoji: '☕️',
      message: 'A fresh day, a fresh code challenge awaits! 🚀',
    };
  } else if (hour >= 12 && hour < 18) {
    return {
      greeting: 'Good afternoon ',
      emoji: '🌤️',
      message: "The day's in full swing! Let's tackle some challenges. 💪",
    };
  } else if (hour >= 18 && hour < 22) {
    return {
      greeting: 'Good evening',
      emoji: '🕘',
      message: "It's never too late for a new algorithm challenge. 📚",
    };
  } else {
    return {
      greeting: 'Good night',
      emoji: '🌙',
      message: 'Night owls have their own coding rhythm. 🦉',
    };
  }
};
