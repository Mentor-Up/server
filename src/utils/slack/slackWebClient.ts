import { WebClient } from '@slack/web-api';
import type { WebAPICallResult, WebAPICallError } from '@slack/web-api';
import { SLACK_API_BOT_USER_OAUTH_TOKEN } from '../../config';

export const slackWebClient = new WebClient(SLACK_API_BOT_USER_OAUTH_TOKEN);

export type { WebAPICallResult, WebAPICallError };
