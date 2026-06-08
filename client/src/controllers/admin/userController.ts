import UserService from '@/services/userService';
import { UserModel, UserAnalytics } from '@/models/userModel';
import { BaseController } from '@/controllers/baseController';
import { formatDate } from '@/utils/date';
import { showErrorToast } from '@/utils/toast';

export default new class UserController extends BaseController {

  constructor() {
    super(UserService);
  };
  
  async getUserAnalytics(): Promise<UserAnalytics> {
    try {
      const users = await UserService.getAll();
      // Ensure users is an array
      const safeUsers = Array.isArray(users) ? users : [];
      
      const totalUsers = safeUsers.length;
      const verifiedUsers = safeUsers.filter(user => user.isVerified).length;
      const unverifiedUsers = totalUsers - verifiedUsers;
      
      // Gender distribution
      const genderDistribution = safeUsers.reduce((acc, user) => {
        const existing = acc.find((item: { genderId: number; count: number }) => item.genderId === user.genderId);
        if (existing) {
          existing.count++;
        } else {
          acc.push({ genderId: user.genderId, count: 1 });
        }
        return acc;
      }, [] as { genderId: number; count: number }[]);

      // New users in last 7 days
      const newUsersLast7Days = safeUsers.filter(user => {
        const createdDate = new Date(user.createdDate);
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return createdDate >= weekAgo;
      }).length;

      // New users in last 30 days
      const newUsersLast30Days = safeUsers.filter(user => {
        const createdDate = new Date(user.createdDate);
        const monthAgo = new Date();
        monthAgo.setDate(monthAgo.getDate() - 30);
        return createdDate >= monthAgo;
      }).length;

      return {
        totalUsers,
        verifiedUsers,
        unverifiedUsers,
        genderDistribution,
        newUsersLast7Days,
        newUsersLast30Days,
      };
    } catch (error: any) {
      showErrorToast('Failed to fetch analytics', error.message || 'Unable to load analytics');
      throw error;
    }
  }

  async getRecentUsers(limit: number = 5): Promise<UserModel[] > {
    try {
      const users = await UserService.getAll();
      const safeUsers = Array.isArray(users) ? users : [];
      return safeUsers
        .sort((a, b) => new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime())
        .slice(0, limit);
    } catch (error: any) {
      showErrorToast('Failed to fetch recent users', error.message || 'Unable to load recent users');
      throw error;
    }
  }

  formatUserForDisplay(user: UserModel): UserModel & { 
    formattedCreatedDate: string;
    fullName: string;
  } {
    return {
      ...user,
      formattedCreatedDate: formatDate(user.createdDate),
      fullName: `${user.firstName} ${user.lastName}`,
    };
  }
}

