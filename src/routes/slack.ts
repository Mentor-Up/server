import express from 'express';
import { getChannels } from '../controllers/slack';

const router = express.Router();

router.get('/', (req, res) => {
  res.send('Hello from Slack Router!');
});

router.get('/channels', getChannels);

export default router;
