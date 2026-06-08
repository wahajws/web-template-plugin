import { authService } from '@/services/authService';
import { useAuthStore } from '@/state/auth.store';
import { showSuccessToast, showErrorToast } from '@/utils/toast';
import { LoginFormData } from '@/models/auth';

export class AuthController {
  private authStore = useAuthStore.getState();

  async login(credentials: LoginFormData): Promise<boolean> {
    try {
      this.authStore.setLoading(true);
      
      await this.authStore.login(credentials.email, credentials.password);
      
      showSuccessToast('Login Successful', 'Welcome back!');
      return true;
    } catch (error: any) {
      showErrorToast('Login Failed', error.message || 'Invalid credentials');
      return false;
    } finally {
      this.authStore.setLoading(false);
    }
  }

  async logout(): Promise<void> {
    try {
      await authService.logout();
      this.authStore.logout();
      showSuccessToast('Logged Out', 'You have been successfully logged out');
    } catch (error: any) {
      showErrorToast('Logout Error', error.message || 'Failed to logout');
    }
  }

  checkAuthStatus(): boolean {
    return this.authStore.isAuthenticated;
  }

  getCurrentUser() {
    return this.authStore.user;
  }

  clearError(): void {
    this.authStore.clearError();
  }
}

export const authController = new AuthController();
