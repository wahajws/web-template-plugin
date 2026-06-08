import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader } from '@/components/feedback/Loader';
import { showSuccessToast, showErrorToast } from '@/utils/toast';
import { authService } from '@/services/authService';
import { BarChart3 } from 'lucide-react';

const emailSchema = z.object({ email: z.string().email('Invalid email address') });
const resetSchema = z.object({
  otp:         z.string().length(6, 'OTP must be 6 digits'),
  newPassword: z.string().min(6, 'Password must be at least 6 characters'),
  confirm:     z.string(),
}).refine(d => d.newPassword === d.confirm, { message: 'Passwords do not match', path: ['confirm'] });

type EmailData = z.infer<typeof emailSchema>;
type ResetData = z.infer<typeof resetSchema>;

export const ForgotPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<'email' | 'reset'>('email');
  const [targetEmail, setTargetEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const emailForm = useForm<EmailData>({ resolver: zodResolver(emailSchema) });
  const resetForm = useForm<ResetData>({ resolver: zodResolver(resetSchema) });

  const onRequestOtp = async (data: EmailData) => {
    setIsLoading(true);
    try {
      await authService.forgotPassword(data.email);
      setTargetEmail(data.email);
      setStep('reset');
      showSuccessToast('OTP Sent', 'Check your email for the reset code.');
    } catch (err: any) {
      showErrorToast('Error', err.message || 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  const onReset = async (data: ResetData) => {
    setIsLoading(true);
    try {
      await authService.resetPassword(targetEmail, data.otp, data.newPassword);
      showSuccessToast('Password Reset', 'Your password has been updated. Please login.');
      navigate('/login');
    } catch (err: any) {
      showErrorToast('Reset Failed', err.message || 'Invalid or expired OTP');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/20 to-secondary/20 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <BarChart3 className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold">
            {step === 'email' ? 'Forgot Password' : 'Reset Password'}
          </CardTitle>
          <CardDescription>
            {step === 'email'
              ? 'Enter your email to receive a reset code'
              : `Enter the code sent to ${targetEmail} and your new password`}
          </CardDescription>
        </CardHeader>

        <CardContent>
          {step === 'email' ? (
            <form onSubmit={emailForm.handleSubmit(onRequestOtp)} className="space-y-4">
              <div className="space-y-2">
                <Label>Email Address</Label>
                <Input type="email" placeholder="your@email.com" {...emailForm.register('email')} disabled={isLoading} />
                {emailForm.formState.errors.email && (
                  <p className="text-sm text-destructive">{emailForm.formState.errors.email.message}</p>
                )}
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? <Loader size="sm" /> : 'Send Reset Code'}
              </Button>

              <p className="text-center text-sm text-muted-foreground">
                Already have an account?{' '}
                <Link to="/login" className="text-primary font-medium hover:underline">Sign in</Link>
              </p>
            </form>
          ) : (
            <form onSubmit={resetForm.handleSubmit(onReset)} className="space-y-4">
              <div className="space-y-2">
                <Label>6-Digit OTP Code</Label>
                <Input
                  placeholder="123456"
                  maxLength={6}
                  className="text-center text-2xl tracking-widest font-mono"
                  {...resetForm.register('otp')}
                  disabled={isLoading}
                />
                {resetForm.formState.errors.otp && (
                  <p className="text-sm text-destructive">{resetForm.formState.errors.otp.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>New Password</Label>
                <Input type="password" placeholder="Min. 6 characters" {...resetForm.register('newPassword')} disabled={isLoading} />
                {resetForm.formState.errors.newPassword && (
                  <p className="text-sm text-destructive">{resetForm.formState.errors.newPassword.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Confirm Password</Label>
                <Input type="password" placeholder="Repeat password" {...resetForm.register('confirm')} disabled={isLoading} />
                {resetForm.formState.errors.confirm && (
                  <p className="text-sm text-destructive">{resetForm.formState.errors.confirm.message}</p>
                )}
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? <Loader size="sm" /> : 'Reset Password'}
              </Button>

              <p className="text-center text-sm text-muted-foreground">
                Wrong email?{' '}
                <button type="button" className="text-primary font-medium hover:underline"
                  onClick={() => { setStep('email'); resetForm.reset(); }}>
                  Go back
                </button>
              </p>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
};