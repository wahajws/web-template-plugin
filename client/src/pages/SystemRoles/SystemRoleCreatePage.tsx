import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SystemRoleForm } from '@/components/forms/SystemRoleForm';
import SystemRoleController from '@/controllers/admin/systemRoleController';
import { SystemRoleFormModel } from '@/models/systemRoleModel';
import { RECORD_STATUS_OPTIONS } from '@constants/global';

export const SystemRoleCreatePage: React.FC = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: SystemRoleFormModel) => {
    try {
      setIsSubmitting(true);
      await SystemRoleController.create({
        ...data,
        recordStatusId: data.recordStatusId ?? RECORD_STATUS_OPTIONS.Public,
      });
      navigate('/system-roles');
    } catch (error) {
      console.error('Failed to create system role:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Create System Role</h1>
        <p className="text-muted-foreground">
          Add a new system role and configure its permissions.
        </p>
      </div>

      <SystemRoleForm
        onSubmit={handleSubmit}
        isLoading={isSubmitting}
        title="New System Role"
        description="Define the role details and required permissions."
        submitLabel="Create"
        initialData={{
          roleName: '',
          canCreate: false,
          canRead: false,
          canUpdate: false,
          canDelete: false,
          canApprove: false,
          canReport: false,
          recordStatusId: RECORD_STATUS_OPTIONS.Public,
        }}
      />
    </div>
  );
};

