import { slackWebClient, WebAPICallResult } from './index';

interface SlackUserProfile {
  id: string;
  email: string;
  name: string;
  title: string;
  displayName: string;
  avatarUrl: string;
  isAdmin: boolean;
  isBot: boolean;
  isEmailConfirmed: boolean;
  teamId: string;
}

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

async function fetchUserData(userId: string): Promise<WebAPICallResult> {
  try {
    return await slackWebClient.users.info({ user: userId });
  } catch (error) {
    console.error('Error fetching user details:', error);
    throw error;
  }
}

function extractUserProfile(userData: WebAPICallResult): SlackUserProfile {
  const user = userData.user as any;
  const profile = user?.profile || {};

  return {
    id: user.id,
    email: profile.email,
    name: profile.real_name,
    title: profile.title,
    displayName: profile.display_name,
    avatarUrl: profile.image_original,
    isAdmin: user.is_admin || false,
    isBot: user.is_bot,
    isEmailConfirmed: user.is_email_confirmed,
    teamId: user.team,
  };
}

export async function fetchChannelMembersDetails(
  channelId: string
): Promise<SlackUserProfile[]> {
  try {
    const channelMembers = await fetchChannelMembers(channelId);
    const userDetailPromises = channelMembers.map(fetchUserData);
    const userResponses = await Promise.all(userDetailPromises);
    const userProfiles = userResponses.map((response) =>
      extractUserProfile(response)
    );

    return userProfiles.filter((profile) => !profile.isBot);
  } catch (error) {
    console.error('Error fetching channel members details:', error);
    throw error;
  }
}
