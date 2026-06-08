import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import UserPermissionService from '@/services/userPermissionService';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import StaticDataService from '@/services/staticDataService';
import { UserFormSchema, UserFormData } from '@/models/userModel';
import { StaticDataFormModel } from '@/models/staticDataModel';
import { STATIC_DATA, RECORD_STATUS_OPTIONS, IC_TYPE_OPTIONS, GENDER_OPTIONS } from '@constants/global';
import SystemRoleService from '@/services/systemRoleService';
import { SystemRoleFormModel } from '@/models/systemRoleModel';
import { UserPermissionFormModel } from '@/models/userPermissionModel';

interface UserFormProps {
  mode: 'create' | 'update';
  initialData?: Partial<UserFormData>;
  onSubmit: (data: any) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export const UserForm: React.FC<UserFormProps> = ({
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
  } = useForm<UserFormData>({
    resolver: zodResolver(UserFormSchema),
    defaultValues: initialData || {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      dateOfBirth: '',
      icNumber: '',
      icTypeId: IC_TYPE_OPTIONS.NRIC,
      genderId: GENDER_OPTIONS.Undisclosed,
      isEmailVerified: false,
      isLockedOut: false,
      recordStatusId: RECORD_STATUS_OPTIONS.Public,
      roleId: []
    },
  });

  const watchedValues = watch();
  const [genderOptions, setGenderOptions] = useState<StaticDataFormModel[]>([]);
  const [icTypeOptions, setIcTypeOptions] = useState<StaticDataFormModel[]>([]);
  const [recordStatusOptions, setRecordStatusOptions] = useState<StaticDataFormModel[]>([]);
  const [systemRoles, setSystemRoles] = useState<SystemRoleFormModel[]>([]); 
  const [userPermissions, setUserPermissions] = useState<UserPermissionFormModel[]>([]);

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
  useEffect(() => {
    const fetchSystemRoles = async () => {
      const options = await SystemRoleService.getAll();
      setSystemRoles(options);
    };
    fetchSystemRoles();
  }, []);
  useEffect(() => {
    const fetchUserPermissions = async () => {
      const options = await UserPermissionService.getByUserId(initialData?.userId || 0);
      setUserPermissions(options);
    };
    fetchUserPermissions();
  }, []);

  const handleFormSubmit = (data: UserFormData ) => {
    data.roleId = userPermissions.map((p) => p.roleId);
    onSubmit(data);
  };

  const handleFormCancel = () => {
    onCancel();
  };


  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>
          {'Edit User'}
        </CardTitle>
        <CardDescription>
          {'Update the user information below.'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          {/* First Name & Last Name */}
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

          {/* Email */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                readOnly={mode === 'update'} // Make email read-only in update mode
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
            {/* Date Of Birth */}
            <div className="space-y-2">
              <Label htmlFor="dateOfBirth">Date Of Birth *</Label>
              <Input
                id="dateOfBirth"
                type="date"
                {...register('dateOfBirth')}
              />
              {errors.dateOfBirth && (
                <p className="text-sm text-destructive">{errors.dateOfBirth.message}</p>
              )}
            </div>
          </div>

          {/* IC Number & IC Type*/}
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

          {/* Gender & Record Status*/}          
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

          {/* Roles */}  
          <div className="grid bg-gray-100 rounded-lg">        
            <div className="space-y-2 p-4">
              <h3 className="font-semibold mb-4">System Roles</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {systemRoles.map((role) => (
                  <div key={role.id} className="flex items-center space-x-2">
                    <input                       
                      type="checkbox"
                      id={`role-${role.id}`}
                      checked={userPermissions.some((p) => p.roleId === role.id)} 
                      onChange={(e) => {
                        const isChecked = e.target.checked;
                        const roleId = role.id;
                        const currentPermissions = userPermissions.map((p) => p.roleId);
                        if (isChecked) {
                          setUserPermissions([...userPermissions, { userId: initialData?.userId || 0, roleId: roleId, recordStatusId: RECORD_STATUS_OPTIONS.Public  }]);
                        } else {
                          setUserPermissions(currentPermissions.filter((id) => id !== roleId).map((id) => ({ userId: initialData?.userId || 0, roleId: id, recordStatusId: RECORD_STATUS_OPTIONS.Public })));
                        }   
                      }}
                    />
                    <Label htmlFor={`role-${role.id}`} className="mb-0">  
                      {role.roleName}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Submit & Cancel Button */}
          <div className="flex w-full justify-between items-center">
            {/* Submit Button */}
            <Button 
              type="submit" 
              disabled={isLoading}>
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
