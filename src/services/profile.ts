import { NotFoundError } from '../errors';
import User, { IUser } from '../models/User';
import getConfirmationCode from '../utils/getConfirmationCode';

interface IUserProfile {
  id: string;
  name: string;
  email: string;
  role: string[];
  cohorts: string[];
  slackId?: string;
  avatarUrl?: string;
  isActivated?: boolean;
  confirmationCode?: string;
}

class ProfileService {
  private generateUserProfile(user: IUser): IUserProfile {
    return {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      cohorts: user.cohorts,
      avatarUrl: user.avatarUrl,
      slackId: user.slackId,
      isActivated: user.isActivated,
    };
  }

  async createUser(userData: Partial<IUser>): Promise<IUser> {
    return await User.create(userData);
  }

  async isExistingEmail(email: string): Promise<boolean> {
    const user = await User.findOne({ email });
    return !!user;
  }

  async registerDirectUser(
    userData: Partial<IUser>
  ): Promise<IUserProfile | null> {
    const user = await User.create({
      ...userData,
      isActivated: true,
      confirmationCode: getConfirmationCode(),
    });

    return this.generateUserProfile(user);
  }

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

export default new ProfileService();
