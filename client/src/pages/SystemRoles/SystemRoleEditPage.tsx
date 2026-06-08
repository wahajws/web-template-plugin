import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { SystemRoleForm } from '@/components/forms/SystemRoleForm';
import SystemRoleController from '@/controllers/admin/systemRoleController';
import { SystemRoleFormModel } from '@/models/systemRoleModel';
import { RECORD_STATUS_OPTIONS } from '@constants/global';
import { Skeleton } from '@/components/ui/skeleton';

export const SystemRoleEditPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<SystemRoleFormModel | null>(null);

  useEffect(() => {
    if (id) {
      fetchData(parseInt(id, 10));
    }
  }, [id]);

  const fetchData = async (roleId: number) => {
    try {
      setIsLoading(true);
      const result = await SystemRoleController.getById(roleId);
      setFormData({
        roleName: result.roleName,
        canCreate: result.canCreate ?? false,
        canRead: result.canRead ?? false,
        canUpdate: result.canUpdate ?? false,
        canDelete: result.canDelete ?? false,
        canApprove: result.canApprove ?? false,
        canReport: result.canReport ?? false,
        recordStatusId: result.recordStatusId ?? RECORD_STATUS_OPTIONS.Public,
      });
    } catch (error) {
      console.error('Failed to fetch system role:', error);
      navigate('/system-roles');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (data: SystemRoleFormModel) => {
    if (!id) return;
    try {
      setIsLoading(true);
      await SystemRoleController.update(parseInt(id, 10), data);
      navigate('/system-roles');
    } catch (error) {
      console.error('Failed to update system role:', error);
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
        <p className="text-muted-foreground">System role not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Edit System Role</h1>
        <p className="text-muted-foreground">
          Update the system role information and permissions.
        </p>
      </div>

      <SystemRoleForm
        initialData={formData}
        onSubmit={handleSubmit}
        isLoading={isLoading}
        title="Edit System Role"
        description="Modify the details for this system role."
        submitLabel="Update"
      />
    </div>
  );
};

