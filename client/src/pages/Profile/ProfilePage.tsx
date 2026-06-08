import React, { useState, useEffect, useRef } from 'react';
import { useAuthStore } from '@/state/auth.store';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import UserService from '@/services/userService';
import { authService } from '@/services/authService';
import { showErrorToast, showSuccessToast } from '@/utils/toast';
import { User, Mail, Phone, Calendar, Camera, Save, Lock, CreditCard } from 'lucide-react';
import { httpService } from '@/services/helpers/http';

const IC_TYPES = [
  { value: 0, label: 'NRIC' },
  { value: 1, label: 'Passport' },
  { value: 2, label: 'Other' },
];



export const ProfilePage: React.FC = () => {
  const { user: rawUser } = useAuthStore();
  // user may be stored as a JSON string due to double-serialization in authService
  const user = typeof rawUser === 'string' ? JSON.parse(rawUser) : rawUser;
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'security'>('profile');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    avatar: '',
    icNumber: '',
    icTypeId: 0,
  });

  // Security flow state
  const [secEmail, setSecEmail] = useState('');
  const [secLoading, setSecLoading] = useState(false);
  const [secSent, setSecSent] = useState(false);

  useEffect(() => {
    // Pre-fill immediately from auth store — show fields right away, no skeleton wait
    if (user) {
      setForm(f => ({
        ...f,
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        avatar: user.avatar || '',
      }));
      setSecEmail(user.email || '');
    }
    setIsLoading(false); // stop skeleton immediately, fields are usable now

    const load = async () => {
      if (!user?.id || user.id === 0) return;
      try {
        const data = await UserService.getById(user.id);
        // Merge API data — fills in phone, dateOfBirth, icNumber etc.
        setForm({
          firstName: data.firstName || user?.firstName || '',
          lastName: data.lastName || user?.lastName || '',
          email: data.email || user?.email || '',
          phone: data.phone || '',
          dateOfBirth: data.dateOfBirth || '',
          avatar: data.avatar || user?.avatar || '',
          icNumber: data.icNumber || '',
          icTypeId: data.icTypeId ?? 0,
        });
        setSecEmail(data.email || user?.email || '');
      } catch (e: any) {
        console.error('Failed to load full profile:', e.message);
      }
    };
    load();
  }, [user?.id]);

  const handleSaveProfile = async () => {
    if (!user?.id) return;
    try {
      setIsSaving(true);
      await UserService.update(user.id, form as any);
      showSuccessToast('Profile updated successfully');
    } catch (e: any) {
      showErrorToast('Failed to save profile', e.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setForm(f => ({ ...f, avatar: ev.target?.result as string }));
    reader.readAsDataURL(file);
  };

  const handleSendResetLink = async () => {
    if (!secEmail) return;
    try {
      setSecLoading(true);
      await authService.sendResetLink(secEmail);
      showSuccessToast('Reset link sent to your email');
      setSecSent(true);
    } catch (e: any) {
      showErrorToast('Failed to send reset link', e.message);
    } finally {
      setSecLoading(false);
    }
  };

  const initials = `${form.firstName?.[0] || ''}${form.lastName?.[0] || ''}`.toUpperCase();

  const getRoleLabel = () => {
    const roles = user?.roleId ?? [];
    if (roles.includes(1)) return 'Administrator';
    if (roles.includes(2)) return 'Premium';
    return 'Basic';
  };

  const tabs = [
    { key: 'profile', label: 'Profile', icon: User },
    { key: 'security', label: 'Security', icon: Lock },
  ];

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto space-y-6 p-6">
        <Skeleton className="h-32 w-full rounded-xl" />
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 p-6">
      {/* Header */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-5">
            <div className="relative">
              <div
                className="w-20 h-20 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-2xl font-bold overflow-hidden cursor-pointer border-2 border-border"
                onClick={() => fileInputRef.current?.click()}
              >
                {form.avatar
                  ? <img src={form.avatar} alt="avatar" className="w-full h-full object-cover" />
                  : initials || <User size={32} />}
              </div>
              <button
                className="absolute bottom-0 right-0 bg-primary text-primary-foreground rounded-full p-1 border-2 border-background"
                onClick={() => fileInputRef.current?.click()}
              >
                <Camera size={12} />
              </button>
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
            </div>
            <div>
              <h2 className="text-xl font-semibold">{form.firstName} {form.lastName}</h2>
              <p className="text-sm text-muted-foreground">{form.email}</p>
              <Badge variant="outline" className="mt-1 text-xs">{getRoleLabel()}</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <div className="flex gap-2 border-b">
        {tabs.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key as any)}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === key
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            <Icon size={14} /> {label}
          </button>
        ))}
      </div>

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Personal Information</CardTitle>
            <CardDescription>Update your name, contact and basic details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-medium">First Name</label>
                <Input value={form.firstName} onChange={e => setForm(f => ({ ...f, firstName: e.target.value }))} />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">Last Name</label>
                <Input value={form.lastName} onChange={e => setForm(f => ({ ...f, lastName: e.target.value }))} />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium flex items-center gap-2"><Mail size={14} /> Email</label>
              <div className="flex h-9 w-full rounded-md border border-input bg-muted px-3 py-1 text-sm items-center text-muted-foreground">
                {secEmail}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-medium flex items-center gap-2"><Phone size={14} /> Phone</label>
                <Input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="+60 12 345 6789" />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium flex items-center gap-2"><Calendar size={14} /> Date of Birth</label>
                <Input type="date" value={form.dateOfBirth} onChange={e => setForm(f => ({ ...f, dateOfBirth: e.target.value }))} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1 col-span-1">
                  <label className="text-sm font-medium">IC Type</label>
                  <select
                    value={form.icTypeId}
                    onChange={e => setForm(f => ({ ...f, icTypeId: Number(e.target.value) }))}
                    className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm"
                  >
                    {IC_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                  </select>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium flex items-center gap-2"><CreditCard size={14} /> IC Number</label>
                <Input value={form.icNumber} onChange={e => setForm(f => ({ ...f, icNumber: e.target.value }))} placeholder="e.g. 901231-07-1234" />
              </div>
            </div>

            <Button onClick={handleSaveProfile} disabled={isSaving} className="w-full">
              <Save size={14} className="mr-2" />
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Security Tab */}
      {activeTab === 'security' && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Change Password</CardTitle>
            <CardDescription>
              {secSent
                ? 'Check your inbox and click the link to set a new password.'
                : 'We will send a secure reset link to your email address.'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <label className="text-sm font-medium flex items-center gap-2"><Mail size={14} /> Email Address</label>
              <div className="flex h-9 w-full rounded-md border border-input bg-muted px-3 py-1 text-sm items-center text-muted-foreground">
                {secEmail}
              </div>
            </div>

            {secSent ? (
              <div className="rounded-md bg-green-50 border border-green-200 p-3 text-sm text-green-800">
                A reset link was sent to <strong>{secEmail}</strong>. It expires in 15 minutes.
              </div>
            ) : (
              <Button onClick={handleSendResetLink} disabled={secLoading || !secEmail} className="w-full">
                <Mail size={14} className="mr-2" />
                {secLoading ? 'Sending...' : 'Send Reset Link'}
              </Button>
            )}

            {secSent && (
              <button
                onClick={() => { setSecSent(false); }}
                className="text-xs text-primary underline w-full text-center"
              >
                Resend link
              </button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};