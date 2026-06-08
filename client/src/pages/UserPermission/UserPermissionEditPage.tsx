import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { UserPermissionForm } from '@/components/forms/UserPermissionForm';
import UserPermissionController from '@/controllers/admin/userPermissionController';
import { UserPermissionFormModel } from '@/models/userPermissionModel';
import { RECORD_STATUS_OPTIONS } from '@constants/global';
import { Skeleton } from '@/components/ui/skeleton';

export const UserPermissionEditPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<UserPermissionFormModel | null>(null);

  useEffect(() => {
    if (id) {
      fetchData(parseInt(id, 10));
    }
  }, [id]);

  const fetchData = async (assignmentId: number) => {
    try {
      setIsLoading(true);
      const result = await UserPermissionController.getById(assignmentId);
      setFormData({
        userId: result.userId,
        roleId: result.roleId,
        recordStatusId: result.recordStatusId ?? RECORD_STATUS_OPTIONS.Public,
      });
    } catch (error) {
      console.error('Failed to fetch user role assignment:', error);
      navigate('/user-roles-assigned');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (data: UserPermissionFormModel) => {
    if (!id) return;
    try {
      setIsLoading(true);
      await UserPermissionController.update(parseInt(id, 10), data);
      navigate('/user-roles-assigned');
    } catch (error) {
      console.error('Failed to update user role assignment:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && !formData) {
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
        <p className="text-muted-foreground">User role assignment not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Edit User Role Assignment</h1>
        <p className="text-muted-foreground">
          Update the user-role association and its status.
        </p>
      </div>

      <UserPermissionForm
        initialData={formData}
        onSubmit={handleSubmit}
        isLoading={isLoading}
        title="Edit User Role Assignment"
        description="Modify the user, role, or status for this assignment."
        submitLabel="Update"
      />
    </div>
  );
};

