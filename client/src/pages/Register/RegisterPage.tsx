import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader } from '@/components/feedback/Loader';
import { showSuccessToast, showErrorToast } from '@/utils/toast';
import { authService } from '@/services/authService';
import { BarChart3 } from 'lucide-react';
import SystemRoleService from '@/services/systemRoleService';
import { SystemRoleFormModel } from '@/models/systemRoleModel';

const registerSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName:  z.string().min(2, 'Last name must be at least 2 characters'),
  email:     z.string().email('Invalid email address'),
  password:  z.string().min(6, 'Password must be at least 6 characters'),
  roleId:    z.coerce.number().gt(1, { message: "Please select a registration type" }), // Role selection
});
type RegisterFormData = z.infer<typeof registerSchema>;

const otpSchema = z.object({
  otp: z.string().length(6, 'OTP must be exactly 6 digits').regex(/^\d+$/, 'OTP must be numbers only'),
});
type OtpFormData = z.infer<typeof otpSchema>;

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<'register' | 'verify'>('register');
  const [registeredEmail, setRegisteredEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const isSubmitting = useRef(false);
  const [systemRoles, setSystemRoles] = useState<SystemRoleFormModel[]>([]); 

  useEffect(() => {
    const fetchSystemRoles = async () => {
      const options = await SystemRoleService.getAll().then(roles => roles.filter((role: SystemRoleFormModel) => role.id !== 1)); // Exclude Admin role
      setSystemRoles(options);
    };
    fetchSystemRoles();
  }, []);

  const registerForm = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: { firstName: '', lastName: '', email: '', password: '', roleId: 0 },
  });

  const otpForm = useForm<OtpFormData>({
    resolver: zodResolver(otpSchema),
    defaultValues: { otp: '' },
  });

  const onRegister = async (data: RegisterFormData) => {
    if (isSubmitting.current) return;
    isSubmitting.current = true;
    setIsLoading(true);

    try {
      await authService.register(data);
      setRegisteredEmail(data.email);
      showSuccessToast('OTP Sent', 'Check your email for the 6-digit code.');
      setStep('verify');
    } catch (err: any) {
      // ✅ FIX: interceptor already extracts the real message into err.message
      const msg = err?.message || 'Something went wrong';
      showErrorToast('Registration Failed', msg);
    } finally {
      setIsLoading(false);
      isSubmitting.current = false;
    }
  };

  const onVerify = async (data: OtpFormData) => {
    if (isSubmitting.current) return;
    isSubmitting.current = true;
    setIsLoading(true);

    try {
      await authService.verifyEmail(registeredEmail, data.otp);
      showSuccessToast('Email Verified', 'Your account is active. Please login.');
      // ✅ FIX: reset flags before navigating so state is clean
      isSubmitting.current = false;
      setIsLoading(false);
      navigate('/login', { replace: true });
    } catch (err: any) {
      // ✅ FIX: read err.message directly, same as onRegister
      const msg = err?.message || 'Invalid or expired OTP';
      showErrorToast('Verification Failed', msg);
      isSubmitting.current = false;
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
            {step === 'register' ? 'Create Account' : 'Verify Your Email'}
          </CardTitle>
          <CardDescription>
            {step === 'register'
              ? 'Fill in your details to get started'
              : `Enter the 6-digit code sent to ${registeredEmail}`}
          </CardDescription>
        </CardHeader>

        <CardContent>
          {step === 'register' ? (
            <form
              onSubmit={registerForm.handleSubmit(onRegister)}
              className="space-y-4"
              noValidate
            >
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>First Name*</Label>
                  <Input
                    placeholder="John"
                    {...registerForm.register('firstName')}
                    disabled={isLoading}
                  />
                  {registerForm.formState.errors.firstName && (
                    <p className="text-sm text-destructive">
                      {registerForm.formState.errors.firstName.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label>Last Name*</Label>
                  <Input
                    placeholder="Doe"
                    {...registerForm.register('lastName')}
                    disabled={isLoading}
                  />
                  {registerForm.formState.errors.lastName && (
                    <p className="text-sm text-destructive">
                      {registerForm.formState.errors.lastName.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Email*</Label>
                <Input
                  type="email"
                  placeholder="john@example.com"
                  {...registerForm.register('email')}
                  disabled={isLoading}
                />
                {registerForm.formState.errors.email && (
                  <p className="text-sm text-destructive">
                    {registerForm.formState.errors.email.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="roleId">Registration Type*</Label>
                <Select
                  onValueChange={(value) => registerForm.setValue('roleId', parseInt(value), { shouldValidate: true })}
                  {...registerForm.register('roleId')}  
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select registration type" />
                  </SelectTrigger>
                  <SelectContent>
                    {systemRoles.map((option) => (
                        <SelectItem key={option.id} value={option.id.toString()}>
                          {option.roleName}
                        </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {registerForm.formState.errors.roleId && (
                  <p className="text-sm text-destructive">
                    {registerForm.formState.errors.roleId.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Password*</Label>
                <Input
                  type="password"
                  placeholder="Min. 6 characters"
                  {...registerForm.register('password')}
                  disabled={isLoading}
                />
                {registerForm.formState.errors.password && (
                  <p className="text-sm text-destructive">
                    {registerForm.formState.errors.password.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? <Loader size="sm" /> : 'Create Account'}
              </Button>

              <p className="text-center text-sm text-muted-foreground">
                Already have an account?{' '}
                <Link to="/login" className="text-primary font-medium hover:underline">
                  Sign in
                </Link>
              </p>
            </form>
          ) : (
            <form
              onSubmit={otpForm.handleSubmit(onVerify)}
              className="space-y-4"
              noValidate
            >
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
                <p className="text-sm text-blue-700 text-center">
                  A 6-digit code was sent to <strong>{registeredEmail}</strong>
                </p>
              </div>

              <div className="space-y-2">
                <Label>6-Digit OTP Code</Label>
                <Input
                  placeholder="1 2 3 4 5 6"
                  maxLength={6}
                  className="text-center text-2xl tracking-widest font-mono"
                  {...otpForm.register('otp')}
                  disabled={isLoading}
                  autoFocus
                  onKeyPress={(e) => {
                    if (!/[0-9]/.test(e.key)) e.preventDefault();
                  }}
                />
                {otpForm.formState.errors.otp && (
                  <p className="text-sm text-destructive">
                    {otpForm.formState.errors.otp.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? <Loader size="sm" /> : 'Verify & Activate Account'}
              </Button>

              <div className="flex justify-between text-sm">
                <button
                  type="button"
                  className="text-muted-foreground hover:underline"
                  onClick={() => {
                    if (!isLoading) {
                      setStep('register');
                      otpForm.reset();
                    }
                  }}
                  disabled={isLoading}
                >
                  ← Go back
                </button>
                <button
                  type="button"
                  className="text-primary font-medium hover:underline"
                  disabled={isLoading}
                  onClick={async () => {
                    if (isSubmitting.current || !registeredEmail) return;
                    isSubmitting.current = true;
                    setIsLoading(true);
                    try {
                      await authService.register({
                        firstName: registerForm.getValues('firstName'),
                        lastName: registerForm.getValues('lastName'),
                        email: registeredEmail,
                        password: registerForm.getValues('password'),
                      });
                      showSuccessToast('OTP Resent', 'Check your email for the new code.');
                    } catch (err: any) {
                      // ✅ FIX: read err.message directly
                      const msg = err?.message || 'Could not resend OTP. Try again.';
                      showErrorToast('Resend Failed', msg);
                    } finally {
                      setIsLoading(false);
                      isSubmitting.current = false;
                    }
                  }}
                >
                  Resend code
                </button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
};