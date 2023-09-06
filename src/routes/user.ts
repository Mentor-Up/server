import express from 'express';
import {
  getUsers,
  getUser,
  updateUserByAdmin,
  addUsersToCohort,
} from '../controllers/user';
import restrict from '../middleware/authorizeRole';

const router = express.Router();

router.get('/', getUsers);
router.patch('/add-to-cohort/:cohortId', restrict('admin'), addUsersToCohort);
router.get('/:userId', getUser);
router.patch('/:userId', restrict('admin'), updateUserByAdmin);

export default router;
