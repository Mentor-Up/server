import User from '../models/User';
import Cohort from '../models/Cohort';
import Session from '../models/Session';
import Week from '../models/Week';
import { Request, Response } from 'express';
import { BadRequestError, UnauthenticatedError } from '../errors';


const createSession = async (req: Request, res: Response) => {
  const { start, end, type, link, weekId, cohortId } = req.body;
  if (!start || !end || !type || !link) {
    throw new BadRequestError('Missing values');
    
  }


  const session = await Session.create({ start, end, type, link, creator: req.user.userId });
  const week = await Week.findOneAndUpdate(
    { _id: weekId },
    { $push: { sessions: session.id } }
  );



  return res.status(201).json({session });
};


const getAllSession = async (req: Request, res: Response) => {
  const sessions = await Session.find({});

  if (!sessions) {
    return res
      .status(200)
      .json({ status: "Success", message: "There are no sessions" });
  }

  res.status(200).json({ status: "Success", sessions });
};


const getSession = async (req: Request, res: Response) => {
  const { sessionId } = req.params;
  const session = await Session.findOne({ _id: sessionId });

  if (!session) {
    throw new BadRequestError("This session does not exist");
  }
  res.status(200).json({ status: "Success", session });
};

const updateSession = async (req: Request, res: Response) => {
  const { sessionId } = req.params;

  const {body: { start, end, type, link}} = req

  if ( start === '' || end === '' || type === '' || link === '') {
    throw new BadRequestError('Name or Start or End or Type or Link fields cannot be empty')
  }
  const session = await Session.findByIdAndUpdate(
    { _id: sessionId },
    req.body,
    { new: true, runValidators: true }
  )
  if (!session) {
    throw new BadRequestError("This session does not exist");
  }
  return res.status(201).json({session});
};

const deleteSession = async (req: Request, res: Response) => {

  const { sessionId } = req.params;

  const session = await Session.findByIdAndRemove({ _id: sessionId });

  if (!session) {
    throw new BadRequestError("This session does not exist");
  }

  res.status(200).json({ status: 'Success! session removed.' });
};

export { createSession, getAllSession, getSession, updateSession, deleteSession  };
