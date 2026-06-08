import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Controller, useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { NavMenuFormModel } from '@/models/navMenuModel';
import NavMenuController from '@/controllers/admin/navMenuController';
import { RECORD_STATUS_OPTIONS } from '@constants/global';

interface NavMenuOption {
  id: number;
  menuText: string;
}

interface NavMenuFormProps {
  initialData?: Partial<NavMenuFormModel>;
  onSubmit: (data: NavMenuFormModel) => void;
  isLoading?: boolean;
  title?: string;
  description?: string;
  submitLabel?: string;
  currentId?: number;
}

export const NavMenuForm: React.FC<NavMenuFormProps> = ({
  initialData,
  onSubmit,
  isLoading = false,
  title = 'Navigation Menu Details',
  description = 'Provide the menu details below.',
  submitLabel = 'Save',
  currentId,
}) => {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<NavMenuFormModel>({
    defaultValues: {
      parentId: initialData?.parentId ?? null,
      menuText: initialData?.menuText ?? '',
      menuDescription: initialData?.menuDescription ?? '',
      url: initialData?.url ?? '',
      icon: initialData?.icon ?? '',
      orderIndex: initialData?.orderIndex ?? 0,
      recordStatusId: initialData?.recordStatusId ?? RECORD_STATUS_OPTIONS.Public,
    },
  });

  const [parentOptions, setParentOptions] = useState<NavMenuOption[]>([]);

  useEffect(() => {
    if (initialData) {
      reset({
        parentId: initialData.parentId ?? null,
        menuText: initialData.menuText ?? '',
        menuDescription: initialData.menuDescription ?? '',
        url: initialData.url ?? '',
        icon: initialData.icon ?? '',
        orderIndex: initialData.orderIndex ?? 0,
        recordStatusId: initialData.recordStatusId ?? RECORD_STATUS_OPTIONS.Public,
      });
    }
  }, [initialData, reset]);

  useEffect(() => {
    const loadParentMenus = async () => {
      try {
        const response = await NavMenuController.getAll();
        const result = Array.isArray(response)
          ? JSON.parse(JSON.stringify(response))
          : Array.isArray(response)
          ? response
          : [];

        setParentOptions(
          result.map((menuItem: NavMenuOption) => ({
            id: menuItem.id,
            menuText: menuItem.menuText ?? `Menu #${menuItem.id}`,
          }))
        );
      } catch (error) {
        console.error('Failed to load parent menus:', error);
      }
    };

    loadParentMenus();
  }, []);

  const handleFormSubmit = (data: NavMenuFormModel) => {
    onSubmit({
      ...data,
      parentId: data.parentId === null ? null : Number(data.parentId),
      orderIndex: Number.isFinite(Number(data.orderIndex)) ? Number(data.orderIndex) : 0,
    });
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
            name="parentId"
            control={control}
            render={({ field }) => (
              <div className="space-y-2">
                <Label htmlFor="parentId">Parent Menu</Label>
                <Select
                  value={field.value !== null ? field.value.toString() : ''}
                  onValueChange={(value) => field.onChange(value === '' ? null : parseInt(value, 10))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select parent menu (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">None (Top Level)</SelectItem>
                    {parentOptions
                      .filter((menu) => menu.id !== currentId)
                      .map((menu) => (
                      <SelectItem key={menu.id} value={menu.id.toString()}>
                        {menu.menuText}
                      </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          />

          <div className="space-y-2">
            <Label htmlFor="menuText">Menu Text *</Label>
            <Input
              id="menuText"
              placeholder="Enter menu text"
              {...register('menuText', {
                required: 'Menu text is required',
                minLength: {
                  value: 2,
                  message: 'Menu text must be at least 2 characters',
                },
              })}
            />
            {errors.menuText && (
              <p className="text-sm text-destructive">{errors.menuText.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="menuDescription">Description</Label>
            <Input
              id="menuDescription"
              placeholder="Enter description"
              {...register('menuDescription')}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="url">URL</Label>
            <Input
              id="url"
              placeholder="/path/to/page"
              {...register('url')}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="icon">Icon</Label>
            <Input
              id="icon"
              placeholder="Icon class or reference"
              {...register('icon')}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="orderIndex">Sort Order</Label>
            <Input
              id="orderIndex"
              type="number"
              {...register('orderIndex', {
                valueAsNumber: true,
              })}
            />
          </div>

          <Controller
            name="recordStatusId"
            control={control}
            render={({ field }) => (
              <div className="space-y-2">
                <Label htmlFor="recordStatusId">Record Status</Label>
                <Select
                  value={field.value?.toString() ?? ''}
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex space-x-2">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Saving...' : submitLabel}
              </Button>
            </div>
            <div className="flex justify-end space-x-2">
              <Link to="/nav-menus">
                <Button variant="secondary">Cancel</Button>
              </Link>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

