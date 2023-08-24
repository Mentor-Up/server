import {
  slackWebClient,
  WebAPICallResult,
  WebAPICallError,
} from './slackWebClient';

import Cohort, { ICohort } from '../../models/Cohort';

interface SlackChannel {
  slackId: string;
  name: string;
  type: string;
  numberOfMembers: number;
  startDate?: string;
}

async function fetchPrivateChannels(): Promise<WebAPICallResult> {
  try {
    return await slackWebClient.conversations.list({
      exclude_archived: true,
      types: 'private_channel',
    });
  } catch (error) {
    console.error('Error fetching channels:', error);
    throw error;
  }
}

function handleResponse(response: WebAPICallResult): SlackChannel[] {
  const channels = (response.channels || []) as any[];
  return channels.map((channel) => ({
    slackId: channel.id,
    name: channel.name,
    type: channel.topic.value,
    numberOfMembers: channel.num_members - 1, // exclude app bot
    startDate: channel.purpose.value,
  }));
}

export async function getAllPrivateChannels(): Promise<SlackChannel[]> {
  try {
    const response = await fetchPrivateChannels();
    return handleResponse(response);
  } catch (error) {
    if ((error as WebAPICallError).code === 'slack_webapi_platform_error') {
      console.error('API call error:', (error as WebAPICallError).message);
    } else {
      console.error('Unknown error:', error);
    }
    return [];
  }
}

export interface CohortFromSlack {
  name: string;
  slackId: string;
  start: Date;
  end: string;
  type: string;
  participants: string[];
  weeks: string[];
}

export async function syncChannelsWithCohorts(): Promise<CohortFromSlack[]> {
  try {
    const [slackChannels, existingCohorts] = await Promise.all([
      getAllPrivateChannels(),
      Cohort.find(),
    ]);

    // Compare Slack Channels and existing Cohorts
    const newChannels = slackChannels.filter(
      (slackChannel) =>
        !existingCohorts.some(
          (cohort) => cohort.slackId === slackChannel.slackId
        )
    );

    return newChannels.map(
      (channel) =>
        ({
          name: channel.name,
          start: new Date(channel.startDate as string),
          type: channel.type,
          slackId: channel.slackId,
        }) as CohortFromSlack
    );
  } catch (error) {
    console.error('Error syncing channels with cohorts:', error);
    throw error;
  }
}
