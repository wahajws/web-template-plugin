import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Controller, useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RECORD_STATUS_OPTIONS } from '@constants/global';
import { UserPermissionFormModel } from '@/models/userPermissionModel';
import UserController from '@/controllers/admin/userController';
import SystemRoleController from '@/controllers/admin/userPermissionController';

interface UserOption {
  id: number;
  name: string;
}

interface RoleOption {
  id: number;
  roleName: string;
}

interface FormProps {
  initialData?: Partial<UserPermissionFormModel>;
  onSubmit: (data: UserPermissionFormModel) => void;
  isLoading?: boolean;
  title?: string;
  description?: string;
  submitLabel?: string;
}

export const UserPermissionForm: React.FC<FormProps> = ({
  initialData,
  onSubmit,
  isLoading = false,
  title = 'Assign Role to User',
  description = 'Select a user and role to assign permissions.',
  submitLabel = 'Save',
}) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<UserPermissionFormModel>({
    defaultValues: {
      userId: initialData?.userId ?? 0,
      roleId: initialData?.roleId ?? 0,
      recordStatusId: initialData?.recordStatusId ?? RECORD_STATUS_OPTIONS.Public,
    },
  });

  const [userOptions, setUserOptions] = useState<UserOption[]>([]);
  const [roleOptions, setRoleOptions] = useState<RoleOption[]>([]);

  useEffect(() => {
    if (initialData) {
      reset({
        userId: initialData.userId ?? 0,
        roleId: initialData.roleId ?? 0,
        recordStatusId: initialData.recordStatusId ?? RECORD_STATUS_OPTIONS.Public,
      });
    }
  }, [initialData, reset]);

  useEffect(() => {
    const fetchUsersAndRoles = async () => {
      try {
        const normalizeResponse = (payload: any): any[] => {
          if (payload && Array.isArray(payload.data)) return payload.data;
          if (Array.isArray(payload)) return payload;
          return [];
        };

        const [userResponse, roleResponse] = await Promise.all([
          UserController.getAll(),
          SystemRoleController.getAll(),
        ]);

        const parsedUsers = normalizeResponse(userResponse);
        const parsedRoles = normalizeResponse(roleResponse);

        setUserOptions(
          parsedUsers.map((user: any) => ({
            id: user.id,
            name: `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim() || user.email || `User #${user.id}`,
          }))
        );

        setRoleOptions(
          parsedRoles.map((role: any) => ({
            id: role.id,
            roleName: role.roleName ?? `Role #${role.id}`,
          }))
        );
      } catch (error) {
        console.error('Failed to load users or roles:', error);
      }
    };

    fetchUsersAndRoles();
  }, []);

  const handleFormSubmit = (data: UserPermissionFormModel) => {
    onSubmit(data);
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          <Controller
            name="userId"
            control={control}
            rules={{ required: 'User is required' }}
            render={({ field }) => (
              <div className="space-y-2">
                <Label htmlFor="userId">User *</Label>
                <Select
                  value={field.value ? field.value.toString() : ''}
                  onValueChange={(value) => field.onChange(parseInt(value, 10))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select user" />
                  </SelectTrigger>
                  <SelectContent>
                    {userOptions.map((user) => (
                      <SelectItem key={user.id} value={user.id.toString()}>
                        {user.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.userId && (
                  <p className="text-sm text-destructive">{errors.userId.message}</p>
                )}
              </div>
            )}
          />

          <Controller
            name="roleId"
            control={control}
            rules={{ required: 'Role is required' }}
            render={({ field }) => (
              <div className="space-y-2">
                <Label htmlFor="roleId">Role *</Label>
                <Select
                  value={field.value ? field.value.toString() : ''}
                  onValueChange={(value) => field.onChange(parseInt(value, 10))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    {roleOptions.map((role) => (
                      <SelectItem key={role.id} value={role.id.toString()}>
                        {role.roleName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.roleId && (
                  <p className="text-sm text-destructive">{errors.roleId.message}</p>
                )}
              </div>
            )}
          />

          <Controller
            name="recordStatusId"
            control={control}
            render={({ field }) => (
              <div className="space-y-2">
                <Label htmlFor="recordStatusId">Record Status</Label>
                <Select
                  value={field.value ? field.value.toString() : ''}
                  onValueChange={(value) => field.onChange(parseInt(value, 10))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(RECORD_STATUS_OPTIONS)
                      .filter((entry): entry is [string, number] => typeof entry[1] === 'number')
                      .map(([key, value]) => (
                        <SelectItem key={value} value={value.toString()}>
                          {key}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="flex space-x-2">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Saving...' : submitLabel}
              </Button>
            </div>
            <div className="flex justify-end space-x-2">
              <Link to="/admin/user-permission">
                <Button variant="secondary">Cancel</Button>
              </Link>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

