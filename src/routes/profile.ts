import express from 'express';
import authMiddleware from '../middleware/authentication';
import {
  getProfile,
  updateProfile,
  deleteProfile,
  updatePassword,
} from '../controllers/profile';

const router = express.Router();

router.get('/', getProfile);
router.patch('/', updateProfile);
router.delete('/', deleteProfile);
router.patch('/password', updatePassword);
updatePassword;
export default router;
