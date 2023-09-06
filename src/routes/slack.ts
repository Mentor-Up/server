import express from 'express';
import restrict from '../middleware/authorizeRole';
import { getNewChannels } from '../controllers/slack/channel';
import { getNewMembers } from '../controllers/slack/member';

const router = express.Router();

router.get('/channels', restrict('admin'), getNewChannels);
router.get('/channels/:channelId/members', restrict('admin'), getNewMembers);

export default router;
