import User from '../models/User';
import Cohort from '../models/Cohort';
import Session from '../models/Session';
import { Request, Response } from 'express';
import { BadRequestError, UnauthenticatedError } from '../errors';


const createSession = async (req: Request, res: Response) => {
  const { start, end, type, link } = req.body;
  if (!start || !end || !type || !link) {
    throw new BadRequestError('Missing values');
  }

  const session = await Cohort.create({ start, end, type, link });

  return res.status(201).json({session});
};


const getAllSession = async (req: Request, res: Response) => {
  const sessions = await Session.find({});

  if (!sessions) {
    return res
      .status(200)
      .json({ status: "Success", message: "There are no cohorts" });
  }

  res.status(200).json({ status: "Success", sessions });
};


const getSession = async (req: Request, res: Response) => {
  const { sessionId } = req.params;
  const session = await Cohort.findOne({ _id: sessionId });

  if (!session) {
    throw new BadRequestError("This cohort does not exist");
  }
  res.status(200).json({ status: "Success", session });
};

const updateSession = async (req: Request, res: Response) => {
  const { sessionId } = req.params;

  const {body: { start, end, type, link}} = req

  if ( start === '' || end === '' || type === '' || link === '') {
    throw new BadRequestError('Name or Start or End or Type fields cannot be empty')
  }
  const session = await Cohort.findByIdAndUpdate(
    { _id: sessionId },
    req.body,
    { new: true, runValidators: true }
  )
  if (!session) {
    throw new BadRequestError("This cohort does not exist");
  }
  return res.status(201).json({session});
};

const deleteSession = async (req: Request, res: Response) => {

  const { sessionId } = req.params;

  const session = await Session.findByIdAndRemove({ _id: sessionId });

  if (!session) {
    throw new BadRequestError("This cohort does not exist");
  }

  res.status(200).json({ status: 'Success! Cohort removed.' });
};

export { createSession, getAllSession, getSession, updateSession, deleteSession  };
