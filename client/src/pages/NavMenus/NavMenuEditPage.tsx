import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { NavMenuForm } from '@/components/forms/NavMenuForm';
import NavMenuController from '@/controllers/admin/navMenuController';
import { NavMenuFormModel } from '@/models/navMenuModel';
import { RECORD_STATUS_OPTIONS } from '@constants/global';
import { Skeleton } from '@/components/ui/skeleton';

export const NavMenuEditPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<NavMenuFormModel | null>(null);

  useEffect(() => {
    if (id) {
      fetchData(parseInt(id, 10));
    }
  }, [id]);

  const fetchData = async (menuId: number) => {
    try {
      setIsLoading(true);
      const result = await NavMenuController.getById(menuId);

      setFormData({
        parentId: result.parentId ?? null,
        menuText: result.menuText,
        menuDescription: result.menuDescription ?? '',
        url: result.url ?? '',
        icon: result.icon ?? '',
        orderIndex: Number(result.orderIndex ?? 0),
        recordStatusId: result.recordStatusId ?? RECORD_STATUS_OPTIONS.Public,
      });
    } catch (error) {
      console.error('Failed to fetch navigation menu:', error);
      exitPage();
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (data: NavMenuFormModel) => {
    if (!id) return;
    try {
      setIsLoading(true);
      await NavMenuController.update(parseInt(id, 10), data);
      exitPage();
    } catch (error) {
      console.error('Failed to update navigation menu:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const exitPage = () => {
    navigate('/admin/navigation-menu');
  }

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
        <p className="text-muted-foreground">Navigation menu not found</p>
      </div>
    );
  }

  const currentId = id ? parseInt(id, 10) : undefined;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Edit Navigation Menu</h1>
        <p className="text-muted-foreground">
          Update the navigation menu details.
        </p>
      </div>

      <NavMenuForm
        initialData={formData}
        onSubmit={handleSubmit}
        isLoading={isLoading}
        title="Edit Navigation Menu"
        description="Modify the menu hierarchy, URL, and display properties."
        submitLabel="Update"
        currentId={currentId}
      />
    </div>
  );
};

