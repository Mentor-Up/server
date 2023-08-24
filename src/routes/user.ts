import express from 'express';
import {
  getUsers,
  getUser,
  updateUser,
  getOwnCohorts,
} from '../controllers/user';
import restrict from '../middleware/authorizeRole';

const router = express.Router();

router.get('/', getUsers);
router.get('/cohorts', getOwnCohorts);
router.get('/:userId', getUser);
router.patch('/:userId', restrict('admin'), updateUser);

export default router;
