import express from 'express';
import restrict from '../middleware/authorizeRole';
import { getChannels } from '../controllers/slack/channel';
import { getChannelMembersDetails } from '../controllers/slack/member';

const router = express.Router();

router.get('/channels', restrict('admin'), getChannels);
router.get(
  '/channels/:channelId/members',
  restrict('admin'),
  getChannelMembersDetails
);

export default router;
