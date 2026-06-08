import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { RECORD_STATUS_OPTIONS } from '@constants/global';
import { SystemRoleFormModel } from '@/models/systemRoleModel';

interface FormProps {
  initialData?: Partial<SystemRoleFormModel>;
  onSubmit: (data: SystemRoleFormModel) => void;
  isLoading?: boolean;
  title?: string;
  description?: string;
  submitLabel?: string;
}

const BOOLEAN_FIELDS: Array<keyof SystemRoleFormModel> = [
  'canCreate',
  'canRead',
  'canUpdate',
  'canDelete',
  'canApprove',
  'canReport',
];

export const SystemRoleForm: React.FC<FormProps> = ({
  initialData,
  onSubmit,
  isLoading = false,
  title = 'System Role Details',
  description = 'Provide the system role information below.',
  submitLabel = 'Save',
}) => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<SystemRoleFormModel>({
    defaultValues: {
      roleName: initialData?.roleName ?? '',
      canCreate: initialData?.canCreate ?? false,
      canRead: initialData?.canRead ?? false,
      canUpdate: initialData?.canUpdate ?? false,
      canDelete: initialData?.canDelete ?? false,
      canApprove: initialData?.canApprove ?? false,
      canReport: initialData?.canReport ?? false,
      recordStatusId: initialData?.recordStatusId ?? RECORD_STATUS_OPTIONS.Public,
    },
  });

  const watchedValues = watch();

  useEffect(() => {
    if (initialData) {
      reset({
        roleName: initialData.roleName ?? '',
        canCreate: initialData.canCreate ?? false,
        canRead: initialData.canRead ?? false,
        canUpdate: initialData.canUpdate ?? false,
        canDelete: initialData.canDelete ?? false,
        canApprove: initialData.canApprove ?? false,
        canReport: initialData.canReport ?? false,
        recordStatusId: initialData.recordStatusId ?? RECORD_STATUS_OPTIONS.Public,
      });
    }
  }, [initialData, reset]);

  const handleFormSubmit = (data: SystemRoleFormModel) => {
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
          <div className="space-y-2">
            <Label htmlFor="roleName">Role Name *</Label>
            <Input
              id="roleName"
              placeholder="Enter role name"
              {...register('roleName', { required: 'Role name is required' })}
            />
            {errors.roleName && (
              <p className="text-sm text-destructive">{errors.roleName.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {BOOLEAN_FIELDS.map((field) => {
              const prettyLabel = field
                .replace('can', '')
                .replace(/([A-Z])/g, ' $1')
                .trim();
              return (
              <div className="flex items-center justify-between space-x-4 border rounded-md p-3" key={field}>
                <div>
                  <Label className="capitalize">
                    {`Can ${prettyLabel}`}
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Toggle permission for {prettyLabel.toLowerCase()}
                  </p>
                </div>
                <Controller
                  name={field}
                  control={control}
                  render={({ field: controllerField }) => (
                    <Switch
                      checked={Boolean(controllerField.value)}
                      onCheckedChange={controllerField.onChange}
                    />
                  )}
                />
              </div>
              );
            })}
          </div>

          <div className="space-y-2">
            <Label htmlFor="recordStatusId">Record Status</Label>
            <Select
              value={watchedValues.recordStatusId?.toString()}
              onValueChange={(value) => setValue('recordStatusId', parseInt(value, 10))}
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

          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="flex space-x-2">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Saving...' : submitLabel}
              </Button>
            </div>
            <div className="flex justify-end space-x-2">
              <Link to="/system-roles">
                <Button variant="secondary">Cancel</Button>
              </Link>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

