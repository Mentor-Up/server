import { Request, Response } from 'express';
import User from '../models/User';

const getCohorts = async (req: Request, res: Response) => {
  const populateCohortOptions = {
    path: 'cohorts',
    select: 'name weeks',
  };

  const user = await User.findById(req.user.userId).populate(
    populateCohortOptions
  );

  // if the user only have one cohort, we
  // can directly present that cohort information in the home page

  return res.status(200).json({ cohorts: user!.cohorts });
};

export { getCohorts };
