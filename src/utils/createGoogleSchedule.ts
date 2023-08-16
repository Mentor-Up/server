import { google } from 'googleapis';
import moment from 'moment-timezone';
import { Request, Response } from 'express';
import User from '../models/User';

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_CLIENT_URL
);

const scheduleEvent = async ({
  summary,
  desc,
  start,
  end,
  email,
}: {
  summary: string;
  desc: string;
  start: Date;
  end: Date;
  email: string;
}) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error('error');
  }
  const refresh_token = user.OAuthToken;

  const formattedStart = moment(start)
    .tz('America/Los_Angeles')
    .format('YYYY-MM-DDTHH:mm:ssZ');
  const formattedEnd = moment(end)
    .tz('America/Los_Angeles')
    .format('YYYY-MM-DDTHH:mm:ssZ');

  oauth2Client.setCredentials({ refresh_token: refresh_token });
  const calendar = google.calendar('v3');
  const response = await calendar.events.insert({
    auth: oauth2Client,
    calendarId: 'primary',
    requestBody: {
      summary: summary,
      description: desc,
      start: {
        dateTime: formattedStart,
        timeZone: 'America/Los_Angeles',
      },
      end: {
        dateTime: formattedEnd,
        timeZone: 'America/Los_Angeles',
      },
    },
  });
  console.log(response);
};

export default scheduleEvent;
