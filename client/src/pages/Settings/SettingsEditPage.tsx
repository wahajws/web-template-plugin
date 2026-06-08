import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { SettingsForm } from '@/components/forms/SettingsForm';
import SettingsController from '@/controllers/admin/settingsController';
import { SettingsFormModel, SettingsModel } from '@/models/settingsModel';
import { RECORD_STATUS_OPTIONS } from '@constants/global';
import { Skeleton } from '@/components/ui/skeleton';

export const SettingsEditPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<SettingsModel | null>(null);

  const exitPage = React.useCallback(() => {
    navigate('/admin/settings');
  }, [navigate]);

  const fetchData = React.useCallback(async (formId: number) => {
    try {
      setIsLoading(true);
      const result = await SettingsController.getById(formId);

      setFormData({
        id: result.id,
        settingKey: result.settingKey ?? '',
        settingValue: result.settingValue ?? null,
        recordStatusId: result.recordStatusId ?? RECORD_STATUS_OPTIONS.Public,
      });
    } catch (error) {
      console.error('Failed to fetch settings data:', error);
      exitPage();
    } finally {
      setIsLoading(false);
    }
  }, [exitPage]);

  useEffect(() => {
    if (id) {
      fetchData(parseInt(id, 10));
    }
  }, [fetchData, id]);

  const handleSubmit = async (data: SettingsFormModel) => {
    if (!id) return;
    try {
      setIsLoading(true);
      await SettingsController.update(parseInt(id, 10), data);
      exitPage();
    } catch (error) {
      console.error('Failed to update settings data:', error);
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
        <p className="text-muted-foreground">Edit settings data not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Edit Settings data</h1>
        <p className="text-muted-foreground">
          Update the settings details.
        </p>
      </div>

      <SettingsForm
        initialData={formData}
        onSubmit={handleSubmit}
        isLoading={isLoading}
        title="Edit Settings Data"
        description="Modify the selected settings values."
        submitLabel="Update"
      />
    </div>
  );
};

