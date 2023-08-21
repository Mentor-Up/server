import User, { IUserProfile } from '../models/User';
import { NotFoundError } from '../errors';
import mongoose from 'mongoose';
import Cohort from '../models/Cohort';

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

  async updateUserCohort(
    userId: string,
    updatedCohorts: string[]
  ): Promise<IUserProfile | null> {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const user = await User.findById(userId).session(session);
      console.log('user', user);
      if (!user) {
        throw new NotFoundError('User not found.');
      }

      const previousCohorts = user.cohorts;
      console.log('previousCohorts', previousCohorts);

      user.cohorts = updatedCohorts;
      await user.save();

      // Update cohort participants
      for (const cohortId of previousCohorts) {
        await Cohort.findByIdAndUpdate(
          cohortId,
          { $pull: { participants: userId } },
          { session }
        );
      }

      for (const cohortId of updatedCohorts) {
        await Cohort.findByIdAndUpdate(
          cohortId,
          { $addToSet: { participants: userId } },
          { session }
        );
      }

      await session.commitTransaction();

      const updatedUser = await this.findUserById(userId);
      return updatedUser;
    } catch (error) {
      await session.abortTransaction();
      throw new Error('Failed to update user cohorts.');
    } finally {
      session.endSession();
    }
  }

  // add/remove roles to/from user
}

export default new AdminService();
