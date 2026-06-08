import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { UserForm } from '@/components/forms/UserForm';
import { Skeleton } from '@/components/ui/skeleton';
import UserService from '@/services/userService';
import { UserFormData } from '@/models/userModel';
import StaticDataService from '@/services/staticDataService';
import { STATIC_DATA } from '@constants/global';
import UserPermissionService from '@/services/userPermissionService';
import { UserPermissionFormModel } from '@/models/userPermissionModel';

export const UserEditPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setData] = useState<Partial<UserFormData> | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;

      try {
        setIsLoading(true);
        const user = await UserService.getById(parseInt(id));
        const roleIds = await UserPermissionService.getByUserId(parseInt(id));

        setData({
          userId: parseInt(id),
          firstName: user.firstName || "",
          lastName: user.lastName  || "",
          email: user.email  || "",
          phone: user.phone  || "",
          dateOfBirth: user.dateOfBirth || "",
          icNumber: user.icNumber || "",
          icTypeId: user.icTypeId || await StaticDataService.getDefaultByKey(STATIC_DATA.IC_TYPE),
          genderId: user.genderId || await StaticDataService.getDefaultByKey(STATIC_DATA.GENDER),
          isEmailVerified: user.isEmailVerified  || false,
          isLockedOut: user.isLockedOut || false,
          recordStatusId: user.recordStatusId || await StaticDataService.getDefaultByKey(STATIC_DATA.RECORD_STATUS),
          roleId: roleIds ? roleIds.map((r: UserPermissionFormModel) => r.roleId) : []
        });
      } catch (error) {
        console.error('Failed to fetch user:', error);
        exitPage();
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [navigate, id]);

  const handleSubmit = async (data: UserFormData) => {
    if (!id) return;

    console.log("User data: ", data);

    try {
      setIsLoading(true);
      await UserService.update(parseInt(id), data);
      exitPage();
    } catch (error) {
      console.error('Failed to update user:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    exitPage();
  };

  const exitPage = () => {
    navigate('/admin/user-management');
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-64" />
        </div>
        <div className="max-w-2xl mx-auto">
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    );
  }

  if (!formData) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">User not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Edit User</h1>
        <p className="text-muted-foreground">
          Update user information
        </p>
      </div>

      {/* Form */}
      <UserForm
        mode="update"
        initialData={formData}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isLoading={isLoading}
      />
    </div>
  );
};
