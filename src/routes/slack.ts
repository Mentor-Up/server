import express from 'express';
import restrict from '../middleware/authorizeRole';
import { getNewChannels } from '../controllers/slack/channel';
import { getNewMembers } from '../controllers/slack/member';
import authMiddleware from '../middleware/authentication';
import { receiver } from '../slack/slackApp';

const router = express.Router();

router.get(
  '/channels',
  express.json(),
  authMiddleware,
  restrict('admin'),
  getNewChannels
);
router.get(
  '/channels/:channelId/members',
  express.json(),
  authMiddleware,
  restrict('admin'),
  getNewMembers
);

// slack events, actions, commands
router.use(receiver.router);

export default router;
