import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreateUserForm } from '@/components/forms/CreateUserForm';
import  UserController  from '@/controllers/admin/userController';
import { CreateUserFormData } from '@/models/userModel';

export const UserCreatePage: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: CreateUserFormData) => {
    try {
      setIsLoading(true);
      await UserController.create(data);
      exitPage();
    } catch (error) {
      console.error('Failed to create user:', error);
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Create User</h1>
        <p className="text-muted-foreground">
          Add a new user to the system
        </p>
      </div>

      {/* Form */}
      <CreateUserForm
        mode="create"
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isLoading={isLoading}
      />
    </div>
  );
};
