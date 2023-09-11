import { Blocks, Md } from 'slack-block-builder';
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
  const timezoneText = `All sessions reflect your ${Md.codeInline(
    member.tz_label
  )} timezone setting ${Md.emoji('earth_americas')}`;

  return [
    Blocks.Header().text(greetingText),
    Blocks.Section().text(timezoneText),
    Blocks.Divider(),
  ];
};
