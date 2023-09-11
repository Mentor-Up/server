// TODO: gather all slack types in one place; User Bolt?
import { WebAPICallResult } from '@slack/web-api';
import { SlackMember } from '../../slack/types/member';

export const extractMemberProfile = (
  userData: WebAPICallResult
): SlackMember => {
  const user = userData.user as any;
  const profile = user?.profile || {};
  return {
    id: user.id,
    email: profile.email,
    name: profile.real_name,
    firstName: profile.first_name,
    lastName: profile.last_name,
    title: profile.title,
    displayName: profile.display_name,
    avatarUrl: profile.image_original,
    isAdmin: user.is_admin || false,
    isBot: user.is_bot,
    isEmailConfirmed: user.is_email_confirmed,
    teamId: user.team,
    tz: user.tz,
    tz_label: user.tz_label,
    tz_offset: user.tz_offset,
  };
};
