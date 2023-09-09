export interface SlackMember {
  id: string;
  email: string;
  name: string;
  firstName: string;
  lastName: string;
  title: string;
  displayName: string;
  avatarUrl: string;
  isAdmin: boolean;
  isBot: boolean;
  isEmailConfirmed: boolean;
  teamId: string;
  tz: string;
  tz_label: string;
  tz_offset: number;
}
