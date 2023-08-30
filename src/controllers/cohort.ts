import Cohort, { CohortSubject } from '../models/Cohort';
import { Request, Response } from 'express';
import { BadRequestError } from '../errors';
import { getCohortWeeks } from '../constants/cohortWeeks';
import { isCohortSubject } from '../utils/typeGuards';

const createCohort = async (req: Request, res: Response) => {
  const { name, start, type } = req.body;
  if (!name || !start || !type) {
    throw new BadRequestError('Missing values');
  }

  if (!isCohortSubject(type)) {
    throw new BadRequestError('Invalid cohort type');
  }

  const weeks = createWeeks(type, start);
  const cohort = await Cohort.create({
    name,
    start,
    end: weeks[weeks.length - 1].end,
    type,
    weeks,
  });

  return res.status(201).json({ cohort });
};

const getAllCohort = async (req: Request, res: Response) => {
  const cohorts = await Cohort.find({}).populate('participants', '_id name');

  if (!cohorts) {
    return res
      .status(200)
      .json({ status: 'Success', message: 'There are no cohorts' });
  }

  res.status(200).json({ status: 'Success', cohorts });
};

const getCohort = async (req: Request, res: Response) => {
  const { cohortId } = req.params;

  const populateUserOptions = {
    path: 'participants',
    select: '_id name email role isActivated',
  };

  const cohort = await Cohort.find({ _id: cohortId }).populate(
    populateUserOptions
  );

  if (!cohort) {
    throw new BadRequestError('This cohort does not exist');
  }
  res.status(200).json({ status: 'Success', cohort });
};

const updateCohort = async (req: Request, res: Response) => {
  const { cohortId } = req.params;

  const {
    body: { name, start, end, type },
  } = req;

  if (name === '' || start === '' || end === '' || type === '') {
    throw new BadRequestError(
      'Name or Start or End or Type fields cannot be empty'
    );
  }
  const cohort = await Cohort.findByIdAndUpdate({ _id: cohortId }, req.body, {
    new: true,
    runValidators: true,
  });
  if (!cohort) {
    throw new BadRequestError('This cohort does not exist');
  }
  return res.status(201).json({ cohort });
};

const deleteCohort = async (req: Request, res: Response) => {
  const { cohortId } = req.params;

  const cohort = await Cohort.findByIdAndRemove({ _id: cohortId });

  if (!cohort) {
    throw new BadRequestError('This cohort does not exist');
  }

  res.status(200).json({ status: 'Success! Cohort removed.' });
};

const createWeeks = (type: CohortSubject, startOfCohort: Date) => {
  const weekNames = getCohortWeeks(type);
  let startTimestamp = new Date(startOfCohort).getTime();

  const weeks = [];

  for (let i = 0; i < weekNames.length; i++) {
    weeks.push({
      name: weekNames[i],
      start: new Date(startTimestamp),
      end: new Date(startTimestamp + 7 * 24 * 60 * 60 * 1000 - 1000),
      index: i,
    });
    startTimestamp += 7 * 24 * 60 * 60 * 1000;
  }

  return weeks;
};

export {
  getAllCohort,
  getCohort,
  updateCohort,
  deleteCohort,
  createCohort,
  createWeeks,
};
