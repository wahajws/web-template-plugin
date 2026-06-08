import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { NavMenuForm } from '@/components/forms/NavMenuForm';
import NavMenuController from '@/controllers/admin/navMenuController';
import { NavMenuFormModel } from '@/models/navMenuModel';
import { RECORD_STATUS_OPTIONS } from '@constants/global';

export const NavMenuCreatePage: React.FC = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: NavMenuFormModel) => {
    try {
      setIsSubmitting(true);
      await NavMenuController.create({
        ...data,
        recordStatusId: data.recordStatusId ?? RECORD_STATUS_OPTIONS.Public,
      });
      navigate('/admin/navigation-menu');
    } catch (error) {
      console.error('Failed to create navigation menu:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Create Navigation Menu</h1>
        <p className="text-muted-foreground">
          Add a new navigation menu item.
        </p>
      </div>

      <NavMenuForm
        onSubmit={handleSubmit}
        isLoading={isSubmitting}
        title="New Navigation Menu"
        description="Define the menu hierarchy, URL, and display properties."
        submitLabel="Create"
        initialData={{
          parentId: null,
          menuText: '',
          menuDescription: '',
          url: '',
          icon: '',
          orderIndex: 0,
          recordStatusId: RECORD_STATUS_OPTIONS.Public,
        }}
      />
    </div>
  );
};

