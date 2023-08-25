import User, { IUser, IUserProfile } from '../models/User';
import { NotFoundError } from '../errors';
import mongoose from 'mongoose';
import Cohort from '../models/Cohort';
import getConfirmationCode from '../utils/getConfirmationCode';
import { SlackMember } from '../utils/slack/member';

class AdminService {
  async findAllUsers(): Promise<IUserProfile[]> {
    const users = await User.find().populate('cohorts', '_id name');

    return users.map((user) => user.generateProfile());
  }

  async findUserById(userId: string): Promise<IUserProfile | null> {
    const user = await User.findById(userId).populate('cohorts', '_id name');
    if (!user) {
      throw new NotFoundError(`User with id ${userId} not found`);
    }
    return user.generateProfile();
  }

  async updateUser(
    userId: string,
    dataUpdate: Partial<IUser>
  ): Promise<IUserProfile | null> {
    const session = await mongoose.startSession();
    session.startTransaction();
    console.log('UPDATE STARTED');

    try {
      const user = await User.findById(userId).session(session);
      if (!user) {
        throw new NotFoundError('User not found.');
      }

      if (dataUpdate.role) {
        await this.updateUserRoles(user, dataUpdate.role);
      }

      if (dataUpdate.cohorts) {
        await this.updateCohorts(user, dataUpdate.cohorts, session);
      }

      await session.commitTransaction();
      console.log('UPDATED COMPLETED');

      const updatedUser = await this.findUserById(userId);
      return updatedUser;
    } catch (error) {
      await session.abortTransaction();
      throw new Error(
        `Failed to finish update. Error: ${(error as Error).message}`
      );
    } finally {
      session.endSession();
    }
  }

  private async updateUserRoles(
    user: IUser,
    roles: IUser['role']
  ): Promise<void> {
    console.log('1. UPDATE ROLE');
    user.role = roles;
    await user.save();
  }

  private async updateCohorts(
    user: IUser,
    cohorts: IUser['cohorts'],
    session: mongoose.ClientSession
  ): Promise<void> {
    console.log('2. UPDATE COHORT');

    // Additional step: Validate provided cohorts
    const validCohorts = await Cohort.find({
      _id: { $in: cohorts },
    });

    if (validCohorts.length !== cohorts.length) {
      throw new NotFoundError(
        'At least one of the provided cohorts is invalid.'
      );
    }

    const previousCohorts = user.cohorts;
    user.cohorts = cohorts;
    await user.save();

    // Update cohort participants
    for (const cohortId of previousCohorts) {
      await Cohort.findByIdAndUpdate(
        cohortId,
        { $pull: { participants: user._id } },
        { session }
      );
    }

    for (const cohortId of cohorts) {
      await Cohort.findByIdAndUpdate(
        cohortId,
        { $addToSet: { participants: user._id } },
        { session }
      );
    }
  }

  async registerDirectUser(
    userData: Partial<IUser>
  ): Promise<IUserProfile | null> {
    const user = await User.create({
      ...userData,
      isActivated: true,
      confirmationCode: getConfirmationCode(),
    });

    return user.generateProfile();
  }

  async handleSlackMembers(members: SlackMember[]): Promise<SlackMember[]> {
    const users = await User.find();
    const newMembers = members.filter((member) => {
      return !users.some(
        (user) => user.slackId === member.id || user.email === member.email
      );
    });

    return newMembers;
  }
}

export default new AdminService();
