import { NotFoundError } from '../errors';
import User, { IUser } from '../models/User';

interface IUserProfile {
  name: string;
  email: string;
  role: string[];
  cohorts: string[];
}

class UserService {
  private generateUserProfile(user: IUser): IUserProfile {
    return {
      name: user.name,
      email: user.email,
      role: user.role,
      cohorts: user.cohorts,
    };
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

export default new UserService();
