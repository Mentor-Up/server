// TODO: Use Bolt instead of WebClient
import { slackWebClient, WebAPICallResult } from './slackWebClient';
import { SlackMember } from '../../slack/types/member';
import { extractMemberProfile } from '../../slack/utils/memberHelper';

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
