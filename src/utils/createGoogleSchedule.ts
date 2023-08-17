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
  start,
  end,
  email,
}: {
  summary: string;
  start: Date;
  end: Date;
  email: string;
}) => {
  console.log(summary, start, end, email);

  const user = await User.findOne({ email });
  if (!user) {
    throw new Error('error');
  }
  const refresh_token =
    '1//01Rtz68-UmnTlCgYIARAAGAESNwF-L9IraFisYgY9OO-yDGvNchokFFCpXc_ypc2HUXq8pHPCLMSMeTsTROyPrEC3IfLYwDCs5SU';

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
