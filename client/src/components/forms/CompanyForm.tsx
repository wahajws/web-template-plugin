import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import StaticDataService from '@/services/staticDataService';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RECORD_STATUS_OPTIONS } from '@constants/global';
import { CompanyFormModel } from '@/models/companyModel';
import { StaticDataFormModel} from '@/models/staticDataModel'; 

interface formProps {
  initialData?: Partial<CompanyFormModel>;
  onSubmit: (data: CompanyFormModel) => void;
  isLoading?: boolean;
  title?: string;
  description?: string;
  submitLabel?: string;
}

export const CompanyForm: React.FC<formProps> = ({
  initialData,
  onSubmit,
  isLoading = false,
  title = 'Company Details',
  description = 'Provide the company information below.',
  submitLabel = 'Save',
}) => {
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
    watch,
  } = useForm<CompanyFormModel>({
    defaultValues: initialData || {
      companyTypeId: 0,
      name: '',
      email: '',
      phone: '',
      latitude: '0.000',
      longitude: '0.000',
      recordStatusId: RECORD_STATUS_OPTIONS.Public,
    },
  });

  const watchedValues = watch();
  const [companyTypeOptions, setCompanyTypeOptions] = useState<StaticDataFormModel[]>([]);

  useEffect(() => {
    if (initialData) {
      reset({
        companyTypeId: initialData.companyTypeId ?? 0,
        name: initialData.name ?? '',
        email: initialData.email ?? '',
        phone: initialData.phone ?? '',
        latitude: initialData.latitude ?? '0.000',
        longitude: initialData.longitude ?? '0.000',
        recordStatusId: initialData.recordStatusId ?? RECORD_STATUS_OPTIONS.Public,
      });
    }
  }, [initialData, reset]);

  useEffect(() => {
    const fetchCompanyTypeOptions = async () => {
      const options = await StaticDataService.getByKey('COMPANY_TYPE');
      setCompanyTypeOptions(options);
    };
    fetchCompanyTypeOptions();
  }, []);

  const handleFormSubmit = (data: CompanyFormModel) => {
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* First Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                {...register('name')}
                placeholder="Enter name"
              />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name.message}</p>
              )}
            </div>

            {/* Last Name */}
            <div className="space-y-2">
              <Label htmlFor="phone">Phone </Label>
              <Input
                id="lastName"
                {...register('phone')}
                placeholder="Enter phone number"
              />
              {errors.phone && (
                <p className="text-sm text-destructive">{errors.phone.message}</p>
              )}
            </div>
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">Email Address *</Label>
            <Input
              id="email"
              type="email"
              {...register('email')}
              placeholder="Enter email address"
            />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email.message}</p>
            )}
          </div>

          {/* Latitude */}  
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="latitude">Latitude</Label>
              <Input
                id="latitude"
                type="text"
                {...register('latitude')}
                placeholder="Enter latitude"
              />
            </div>

            {/* Longitude */}
            <div className="space-y-2">
              <Label htmlFor="latitude">Longitude</Label>
              <Input
                id="longitude"
                type="text"
                {...register('longitude')}
                placeholder="Enter longitude"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Company Type */}
            <div className="space-y-2">
              <Label htmlFor="companyTypeId">Company Type</Label>
              <Select
                value={watchedValues.companyTypeId?.toString()}
                onValueChange={(value) => setValue('companyTypeId', parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select company type" />
                </SelectTrigger>
                <SelectContent>
                  {companyTypeOptions.map((option) => (
                      <SelectItem key={option.dataValue} value={option.dataValue}>
                        {option.dataText}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            {/* Record Status */}
            <div className="space-y-2">
              <Label htmlFor="recordStatusId">Record Status *</Label>
              <Select
                value={watchedValues.recordStatusId?.toString()}
                onValueChange={(value) => setValue('recordStatusId', parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(RECORD_STATUS_OPTIONS)
                    .filter((entry): entry is [string, number] => typeof entry[1] === "number")
                    .map(([key, value]) => (
                      <SelectItem key={key} value={value.toString()}>
                        {key}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Submit Button */}
            <div className="flex space-x-2">       
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Saving...' : submitLabel}
              </Button>
            </div>

            {/* Cancel Button */}
            <div className="flex space-x-2 justify-end ">
              <Link to="/admin/company">
                <Button variant="secondary">
                  Cancel
                </Button>
              </Link>
            </div>            
          </div>

        </form>
      </CardContent>
    </Card>
  );
};
