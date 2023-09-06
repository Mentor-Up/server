import express from 'express';
import restrict from '../middleware/authorizeRole';
import { getNewChannels } from '../controllers/slack/channel';
import { getNewMembers } from '../controllers/slack/member';
import { handleWeeklySessionsNotification } from '../controllers/slack/notification';

const router = express.Router();

router.get('/channels', restrict('admin'), getNewChannels);
router.get('/channels/:channelId/members', restrict('admin'), getNewMembers);

router.get('/weekly-sessions-notification', handleWeeklySessionsNotification);

export default router;
