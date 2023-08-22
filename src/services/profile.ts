import { NotFoundError } from '../errors';
import User, { IUser } from '../models/User';
import { IUserProfile } from '../models/User';

export interface IProfileService {}

class ProfileService {
  async getUser(userId: string): Promise<IUserProfile | null> {
    const user = await User.findById(userId).populate('cohorts', '_id name');
    if (!user) {
      throw new NotFoundError(`User with id ${userId} not found`);
    }
    return user.generateProfile();
  }

  // TODO: User should only update certain fields
  // TODO: Admin can update user's cohorts and roles
  async updateUser(
    userId: string,
    userData: Partial<IUser>
  ): Promise<IUserProfile | null> {
    const updatedUser = await User.findByIdAndUpdate(userId, userData, {
      new: true,
      runValidators: true,
    }).populate('cohorts', '_id name');
    if (!updatedUser) {
      throw new NotFoundError(`User with id ${userId} not found`);
    }
    return updatedUser.generateProfile();
  }

  async deleteUser(userId: string): Promise<void> {
    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) {
      throw new NotFoundError(`User with id ${userId} not found`);
    }
  }
}

export default new ProfileService();
