import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { CompanyForm } from '@/components/forms/CompanyForm';
import { Skeleton } from '@/components/ui/skeleton';
import CompanyController from '@/controllers/admin/companyController';
import { CompanyFormModel } from '@/models/companyModel';
import { RECORD_STATUS_OPTIONS  } from '@constants/global';

export const CompanyEditPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setData] = useState<Partial<CompanyFormModel> | null>(null);

  useEffect(() => {
    fetchData();
  }, [navigate, id]);

  const fetchData = async () => {
    if (!id) return;

    try {
      setIsLoading(true);
      const result = await CompanyController.getById(parseInt(id));
      setData({
        name: result.name,
        phone: result.phone,
        companyTypeId: result.companyTypeId,
        address: result.address,
        latitude: result.latitude,
        longitude: result.longitude,
        email: result.email,
        recordStatusId: result.recordStatusId || RECORD_STATUS_OPTIONS.Public,
      });
    } catch (error) {
      console.error('Failed to fetch data:', error);
      navigate('/admin/company');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSubmit = async (data: CompanyFormModel) => {
    if (!id) return;

    try {
      setIsLoading(true);
      await CompanyController.update(parseInt(id), data);
      navigate('/admin/company');
    } catch (error) {
      console.error('Failed to update data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
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
        <p className="text-muted-foreground">Company not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Edit Company</h1>
        <p className="text-muted-foreground">
          Update Company information
        </p>
      </div>

      {/* Form */}
      <CompanyForm
        initialData={formData}
        onSubmit={handleSubmit}
        isLoading={isLoading}
      />
    </div>
  );
};
