import { NotFoundError } from '../errors';
import User, { IUser } from '../models/User';

interface IUserProfile {
  _id: string;
  name: string;
  email: string;
  role: string[];
  cohorts: string[];
  slackId?: string;
  avatarUrl?: string;
  isActivated?: boolean;
}

class UserService {
  private generateUserProfile(user: IUser): IUserProfile {
    return {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      cohorts: user.cohorts,
      avatarUrl: user.avatarUrl,
      slackId: user.slackId,
      isActivated: user.isActivated,
    };
  }

  // I have users and cohort -> result all users are added to the cohort
  // I need to check if the cohort exists - controller
  // I need to check if the users are already registered
  // I need to check if the users are already registered in the cohort
  // I need to create the users
  // I need to add the users to the cohort

  // create user as separate function
  // add to cohort as separate function
  // register user = create user + add to cohort
  // available input from controller: user + cohort
  // cohort validation in controller for now

  async createUser(userData: Partial<IUser>): Promise<IUser> {
    return await User.create(userData);
  }

  async isExistingEmail(email: string): Promise<boolean> {
    const user = await User.findOne({ email });
    return !!user;
  }

  // isRegisteredInCohort - ? do we need to provide the feedback?
  // or just make sure the user is added to the cohort
  async addUserToCohort(
    userId: string,
    cohortId: string
  ): Promise<IUser | null> {
    const user = await User.findByIdAndUpdate(
      userId,
      {
        $addToSet: { cohorts: cohortId },
      },
      { new: true, runValidators: true }
    );
    console.log('addtoCohort', user);
    return user;
  }

  async registerUser(
    userData: Partial<IUser>,
    cohort: string
  ): Promise<IUser | null> {
    const user = await User.create(userData);
    const registerUser = await this.addUserToCohort(user._id, cohort);
    return registerUser;
  }
  ////
  ////
  ////

  async registerDirectUser(
    userData: Partial<IUser>
  ): Promise<IUserProfile | null> {
    const user = await User.create({
      ...userData,
      isActivated: true,
      confirmationCode: '111111',
      cohorts: [],
    });

    return this.generateUserProfile(user);
  }

  ///
  ////

  async getUser(userId: string): Promise<IUserProfile | null> {
    const user = await User.findById(userId).populate('cohorts', '_id name');
    if (!user) {
      throw new NotFoundError(`User with id ${userId} not found`);
    }

    return this.generateUserProfile(user);
  }

  // TODO: User should only update certain fields
  // TODO: Admin can update user's cohorts and roles
  async updateUser(
    userId: string,
    updatedData: Partial<IUser>
  ): Promise<IUserProfile | null> {
    const updatedUser = await User.findByIdAndUpdate(userId, updatedData, {
      new: true,
      runValidators: true,
    }).populate('cohorts', '_id name');
    if (!updatedUser) {
      throw new NotFoundError(`User with id ${userId} not found`);
    }
    return this.generateUserProfile(updatedUser);
  }

  async deleteUser(userId: string): Promise<void> {
    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) {
      throw new NotFoundError(`User with id ${userId} not found`);
    }
  }
}

export default new UserService();
