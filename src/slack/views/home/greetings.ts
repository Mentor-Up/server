import { Blocks } from 'slack-block-builder';
import { SlackMember } from '../../types/member';

export const getGenericGreetingView = () => {
  return [
    Blocks.Header().text('Hello there!'),
    Blocks.Section().text('We hope you have a wonderful day!'),
    Blocks.Divider(),
  ];
};

export const getGreetingsView = (member: SlackMember) => {
  const greetingText = `Hello, ${member.firstName}!`;
  const timezoneText = `Your current time zone is set to ${member.tz_label}.\n All the sessions below are adjusted to this time zone.`;

  return [
    Blocks.Header().text(greetingText),
    Blocks.Section().text(timezoneText),
    Blocks.Divider(),
  ];
};
