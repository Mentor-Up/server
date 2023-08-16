import { slackWebClient, WebAPICallResult, WebAPICallError } from './index';

interface SlackChannel {
  id: string;
  name: string;
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
  return channels
    .filter((channel) => channel.id !== undefined && channel.name !== undefined)
    .map((channel) => ({
      id: channel.id,
      name: channel.name,
    }));
}

export async function getAllPrivateChannels(): Promise<SlackChannel[]> {
  try {
    const response = await fetchPrivateChannels();
    return handleResponse(response);
  } catch (error) {
    if ((error as WebAPICallError).code === 'slack_webapi_platform_error') {
      console.error('API call error:', (error as WebAPICallError).message!);
    } else {
      console.error('Unknown error:', error);
    }
    return [];
  }
}
