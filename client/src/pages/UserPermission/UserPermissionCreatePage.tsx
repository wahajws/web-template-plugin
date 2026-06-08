import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserPermissionForm } from '@/components/forms/UserPermissionForm';
import UserPermissionController from '@/controllers/admin/userPermissionController';
import { UserPermissionFormModel } from '@/models/userPermissionModel';
import { RECORD_STATUS_OPTIONS } from '@constants/global';

export const UserPermissionCreatePage: React.FC = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: UserPermissionFormModel) => {
    try {
      setIsSubmitting(true);
      await UserPermissionController.create({
        ...data,
        recordStatusId: data.recordStatusId ?? RECORD_STATUS_OPTIONS.Public,
      });
      navigate('/admin/user-permission');
    } catch (error) {
      console.error('Failed to create user role assignment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Assign Role to User</h1>
        <p className="text-muted-foreground">
          Create a new user-role assignment and set its status.
        </p>
      </div>

      <UserPermissionForm
        onSubmit={handleSubmit}
        isLoading={isSubmitting}
        title="New User Role Assignment"
        description="Select the user, role, and status for this assignment."
        submitLabel="Create"
        initialData={{
          userId: 0,
          roleId: 0,
          recordStatusId: RECORD_STATUS_OPTIONS.Public,
        }}
      />
    </div>
  );
};

