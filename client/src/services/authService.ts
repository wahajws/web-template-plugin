import { httpService } from './helpers/http';
import { AuthResponse, LoginRequest } from '@/models/auth';

export class AuthService {
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    return await httpService.post<AuthResponse>('/auth/login', credentials);
  }

  async register(data: { firstName: string; lastName: string; email: string; password: string; roleId: number }): Promise<{ success: boolean; message: string }> {
    return await httpService.post('/auth/register', data);
  }

  async verifyEmail(email: string, otp: string): Promise<{ success: boolean; message: string }> {
    return await httpService.post('/auth/verify-email', { email, otp });
  }

  async forgotPassword(email: string): Promise<{ success: boolean; message: string }> {
    return await httpService.post('/auth/forgot-password', { email });
  }

  async resetPassword(email: string, otp: string, newPassword: string): Promise<{ success: boolean; message: string }> {
    return await httpService.post('/auth/reset-password', { email, otp, newPassword });
  }

  async sendResetLink(email: string): Promise<{ success: boolean; message: string }> {
    return await httpService.post('/auth/send-reset-link', { email });
  }

  async logout(): Promise<void> {
    // Just clear storage — do NOT dispatch any event here.
    // The store clears its own state directly; dispatching auth:logout
    // caused an infinite loop (store → authService.logout → event → store → ...).
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_data');
  }

  // Utility methods for localStorage management
  storeData(key: string, userData: any): void {
    localStorage.setItem(key, userData);
  }

  getStoredData(key: string): any | null {
    return localStorage.getItem(key);
  }

  // Specific getters for token and user data
  getStoredToken(): string | null {
    return localStorage.getItem('access_token');
  }

  getStoredUserData(): any | null {
    return this.getStoredData('user_data');
  }

  storeAuthData(token: string, userData: any): void {
    localStorage.setItem('access_token', token);
    localStorage.setItem('user_data', JSON.stringify(userData));
  }

  // Check if the user is authenticated based on the presence of a token
  isAuthenticated(): boolean {
    return !!this.getStoredToken();
  }
}
export const authService = new AuthService();