import express from 'express';
import restrict from '../middleware/authorizeRole';
import { getNewChannels } from '../controllers/slack/channel';
import { getNewMembers } from '../controllers/slack/member';
import { handleWeeklySessionsNotification } from '../controllers/slack/notification';
import { handleThisWeekSessions } from '../controllers/slack/this-week';
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

router.get(
  '/weekly-sessions-notification',
  express.json(),
  authMiddleware,
  handleWeeklySessionsNotification
);

router.get(
  '/this-week-sessions',
  express.json(),
  authMiddleware,
  handleThisWeekSessions
);

router.use((req, res, next) => {
  console.log('Incoming Request:', req.method, req.path, req.headers, req.body);
  next();
});

// slack events, actions, commands
router.use(receiver.router);

export default router;
