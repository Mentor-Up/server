import express from 'express';
import { getChannels, getChannelMembersDetails } from '../controllers/slack';

const router = express.Router();

router.get('/channels', getChannels);
router.get('/channels/:channelId/members', getChannelMembersDetails);

export default router;
