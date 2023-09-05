import express from 'express';
import restrict from '../middleware/authorizeRole';
import { getNewChannels } from '../controllers/slack/channel';
import { getNewMembers } from '../controllers/slack/member';
import { getThisWeekSessions } from '../controllers/slack/data';

import { postToChannel, sendDM } from '../utils/slack/message';

const router = express.Router();

router.get('/channels', restrict('admin'), getNewChannels);
router.get('/channels/:channelId/members', restrict('admin'), getNewMembers);

router.get('/this-week-sessions', getThisWeekSessions);

router.get('/sendToChannel', async (req, res) => {
  try {
    await postToChannel();
    res.send('Message sent to channel successfully');
  } catch (error) {
    res.status(500).send('Error sending message to channel');
  }
});

// Endpoint to send a DM to the user
router.get('/sendDM', async (req, res) => {
  try {
    await sendDM();
    res.send('DM sent successfully');
  } catch (error) {
    res.status(500).send('Error sending DM');
  }
});
export default router;
