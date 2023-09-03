import User, { IUser, IUserProfile } from '../models/User';
import { NotFoundError } from '../errors';
import mongoose from 'mongoose';
import Cohort from '../models/Cohort';
import getConfirmationCode from '../utils/getConfirmationCode';

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

    const validCohortsCount = await Cohort.countDocuments({
      _id: { $in: cohorts },
    });

    if (validCohortsCount !== cohorts.length) {
      throw new NotFoundError(
        `Mismatch in provided cohorts. Expected ${cohorts.length} valid cohorts, found ${validCohortsCount}.`
      );
    }

    // logic to determine cohorts to add and remove
    const previousUserCohorts = user.cohorts.map((c) => c.toString());
    const cohortsToAdd = cohorts.filter(
      (c) => !previousUserCohorts.includes(c)
    );
    const cohortsToRemove = previousUserCohorts.filter(
      (c) => !cohorts.includes(c)
    );

    console.log('cohortsToAdd', cohortsToAdd);
    console.log('cohortsToRemove', cohortsToRemove);

    // limit db calls to only when necessary
    if (cohortsToAdd.length > 0 || cohortsToRemove.length > 0) {
      user.cohorts = cohorts;
      await user.save();
    } else {
      console.log('No changes in cohorts. Skipping user save.');
    }

    if (cohortsToRemove.length > 0) {
      await Cohort.updateMany(
        { _id: { $in: cohortsToRemove } },
        { $pull: { participants: user._id } },
        { session }
      );
    }

    if (cohortsToAdd.length > 0) {
      await Cohort.updateMany(
        { _id: { $in: cohortsToAdd } },
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
}

export default new AdminService();
