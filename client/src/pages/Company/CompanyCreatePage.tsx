import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CompanyForm } from '@/components/forms/CompanyForm';
import CompanyController from '@/controllers/admin/companyController';
import { CompanyFormModel } from '@/models/companyModel';
import { RECORD_STATUS_OPTIONS } from '@constants/global';

export const CompanyCreatePage: React.FC = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: CompanyFormModel) => {
    try {
      setIsSubmitting(true);
      await CompanyController.create({
        ...data,
        recordStatusId: data.recordStatusId ?? RECORD_STATUS_OPTIONS.Public,
      });
      navigate('/company');
    } catch (error) {
      console.error('Failed to create company:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Create Company</h1>
        <p className="text-muted-foreground">
          Add a new company to the platform.
        </p>
      </div>

      <CompanyForm
        onSubmit={handleSubmit}
        isLoading={isSubmitting}
        title="New Company"
        description="Fill out the details to create a new company."
        submitLabel="Create"
        initialData={{
          companyTypeId: 0,
          name: '',
          email: '',
          phone: '',
          latitude: '0.000',
          longitude: '0.000',
          recordStatusId: RECORD_STATUS_OPTIONS.Public,
        }}
      />
    </div>
  );
};

