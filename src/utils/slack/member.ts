import { slackWebClient, WebAPICallResult } from './slackWebClient';
import { SlackMember } from '../../slack/types/member';

async function fetchChannelMembers(channelId: string): Promise<string[]> {
  try {
    const response = await slackWebClient.conversations.members({
      channel: channelId,
    });
    return response.members as string[];
  } catch (error) {
    console.error('Error fetching channel members:', error);
    throw error;
  }
}

async function fetchMemberData(userId: string): Promise<WebAPICallResult> {
  try {
    return await slackWebClient.users.info({ user: userId });
  } catch (error) {
    console.error('Error fetching user details:', error);
    throw error;
  }
}

function extractMemberProfile(userData: WebAPICallResult): SlackMember {
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
}

export async function fetchChannelMembersDetails(
  channelId: string
): Promise<SlackMember[]> {
  try {
    const channelMembers = await fetchChannelMembers(channelId);
    const userDetailPromises = channelMembers.map(fetchMemberData);
    const userResponses = await Promise.all(userDetailPromises);
    const userProfiles = userResponses.map((response) =>
      extractMemberProfile(response)
    );

    return userProfiles.filter(
      (profile) => !profile.isBot && profile.isEmailConfirmed
    );
  } catch (error) {
    console.error('Error fetching channel members details:', error);
    throw error;
  }
}
