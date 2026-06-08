import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CreateUserFormSchema, CreateUserFormData } from '@/models/userModel';
import { STATIC_DATA, GENDER_OPTIONS, IC_TYPE_OPTIONS, RECORD_STATUS_OPTIONS } from '@constants/global';
import { StaticDataFormModel } from '@/models/staticDataModel';
import StaticDataService from '@/services/staticDataService';

interface CreateUserFormProps {
  mode: 'create' | 'edit';
  initialData?: Partial<CreateUserFormData>;
  onSubmit: (data: any) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export const CreateUserForm: React.FC<CreateUserFormProps> = ({
  mode,
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
}) => {
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<CreateUserFormData>({
    resolver: zodResolver(CreateUserFormSchema),
    defaultValues: initialData || {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      dateOfBirth: '2000-01-01',
      password: '',
      icNumber: '',
      icTypeId: IC_TYPE_OPTIONS.NRIC,
      genderId: GENDER_OPTIONS.Undisclosed,
      isEmailVerified: false,
      isLockedOut: false,
      recordStatusId: RECORD_STATUS_OPTIONS.Public,
      roleId: [],
     },
  });

  const watchedValues = watch();  
  const [genderOptions, setGenderOptions] = useState<StaticDataFormModel[]>([]);
  const [icTypeOptions, setIcTypeOptions] = useState<StaticDataFormModel[]>([]);
  const [recordStatusOptions, setRecordStatusOptions] = useState<StaticDataFormModel[]>([]);

  useEffect(() => {
    const fetchGenderOptions = async () => {
      const options = await StaticDataService.getByKey(STATIC_DATA.GENDER);
      setGenderOptions(options);
    };
    fetchGenderOptions();
  }, []);
  useEffect(() => {
    const fetchIcTypeOptions = async () => {
      const options = await StaticDataService.getByKey(STATIC_DATA.IC_TYPE);
      setIcTypeOptions(options);
    };
    fetchIcTypeOptions();
  }, []);
  useEffect(() => {    
    const fetchRecordStatusOptions = async () => {
      const options = await StaticDataService.getByKey(STATIC_DATA.RECORD_STATUS);
      setRecordStatusOptions(options);
    };
    fetchRecordStatusOptions();
  }, []);

  const handleFormSubmit = (data: CreateUserFormData ) => {
    onSubmit(data);
  };
  
  const handleFormCancel = () => {
    onCancel();
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>
          {'Create New User'}
        </CardTitle>
        <CardDescription>
          {'Fill in the details to create a new user account.'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* First Name */}
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name *</Label>
              <Input
                id="firstName"
                {...register('firstName')}
                placeholder="Enter first name"
              />
              {errors.firstName && (
                <p className="text-sm text-destructive">{errors.firstName.message}</p>
              )}
            </div>

            {/* Last Name */}
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name *</Label>
              <Input
                id="lastName"
                {...register('lastName')}
                placeholder="Enter last name"
              />
              {errors.lastName && (
                <p className="text-sm text-destructive">{errors.lastName.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                readOnly
                {...register('email')}
                placeholder="Enter email address"
              />
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email.message}</p>
              )}
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <Label htmlFor="phone">Phone </Label>
              <Input
                id="phone"
                {...register('phone')}
                placeholder="Enter phone number"
              />
              {errors.phone && (
                <p className="text-sm text-destructive">{errors.phone.message}</p>
              )}
            </div>  
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password">Password *</Label>
              <Input
                id="password"
                type="password"
                {...register('password')}
                placeholder="Enter password"
              />
              {errors.password && (
                <p className="text-sm text-destructive">{errors.password.message}</p>
              )}
            </div>

            {/* Date Of Birth */}
            <div className="space-y-2">
              <Label htmlFor="dateOfBirth">Date Of Birth *</Label>
              <Input
                id="dateOfBirth"
                type="date"
                {...register('dateOfBirth')}
                value={watchedValues.dateOfBirth}
              />
              {errors.dateOfBirth && (
                <p className="text-sm text-destructive">{errors.dateOfBirth.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* IC Number */}
            <div className="space-y-2">
              <Label htmlFor="icNumber">IC Number</Label>
              <Input
                id="icNumber"
                type="text"
                {...register('icNumber')}
                placeholder="Enter IC number"
              />
            </div>

            {/* IC Type */}
            <div className="space-y-2">
              <Label htmlFor="icTypeId">IC Type</Label>
              <Select
                value={watchedValues.icTypeId?.toString()}
                onValueChange={(value) => setValue('icTypeId', parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select IC type" />
                </SelectTrigger>
                <SelectContent>
                  {icTypeOptions.map((option) => (
                      <SelectItem key={option.dataValue} value={option.dataValue}>
                        {option.dataText}
                      </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.icTypeId && (
                <p className="text-sm text-destructive">{errors.icTypeId.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Gender */}
            <div className="space-y-2">
              <Label htmlFor="genderId">Gender *</Label>
              <Select
                value={watchedValues.genderId?.toString()}
                onValueChange={(value) => setValue('genderId', parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  {genderOptions.map((option) => (
                      <SelectItem key={option.dataValue} value={option.dataValue}>
                        {option.dataText}
                      </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.genderId && (
                <p className="text-sm text-destructive">{errors.genderId.message}</p>
              )}
            </div>

            {/* Record Status */}
            <div className="space-y-2">
              <Label htmlFor="recordStatusId">Record Status *</Label>
              <Select
                value={watchedValues.recordStatusId?.toString()}
                onValueChange={(value) => setValue('recordStatusId', parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {recordStatusOptions.map((option) => (
                      <SelectItem key={option.dataValue} value={option.dataValue}>
                        {option.dataText}
                      </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.recordStatusId && (
                <p className="text-sm text-destructive">{errors.recordStatusId.message}</p> 
              )}
            </div>
          </div>

          {/* Email Verified Status  & Lockedout status*/}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Email Verified Status */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <input                       
                  type="checkbox"
                  id="isEmailVerified"
                  checked={watchedValues.isEmailVerified} 
                  onChange={(e) => {
                    const isChecked = e.target.checked;
                    setValue('isEmailVerified', isChecked);
                  }}
                />
                <Label htmlFor="isEmailVerified" className="mb-0">  
                  Is Email Verified? 
                </Label>
              </div>
            </div>

            {/* Locked Out Status */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <input                       
                  type="checkbox"
                  id="isLockedOut"
                  checked={watchedValues.isLockedOut} 
                  onChange={(e) => {
                    const isChecked = e.target.checked;
                    setValue('isLockedOut', isChecked);
                  }}
                />
                <Label htmlFor="isLockedOut" className="mb-0">  
                  Is Locked Out? 
                </Label>
              </div>
            </div>
          </div>

          <div className="flex w-full justify-between items-center bg-gray-50 rounded-lg">
            {/* Submit Button */}
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Saving...' : mode === 'create' ? 'Create User' : 'Update User'}
            </Button>

            {/* Cancel Button */}
            <Button 
              type="button" 
              onClick={handleFormCancel}
              className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white font-medium rounded-md transition-colors"
            >
              Cancel
            </Button>
          </div>

        </form>
      </CardContent>
    </Card>
  );
};
