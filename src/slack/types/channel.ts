export interface SlackChannel {
  slackId: string;
  name: string;
  type: string;
  numberOfMembers: number;
  startDate?: string;
  endDate?: string;
}
