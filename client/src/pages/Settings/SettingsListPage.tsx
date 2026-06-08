import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DataTable } from '@/components/tables/DataTable';
import { Skeleton } from '@/components/ui/skeleton';
import  SettingsController from '@/controllers/admin/settingsController';
import { TableColumn } from '@/models/common';
import { SettingsModel } from '@/models/settingsModel';
import { Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const SettingsListPage: React.FC = () => {
  
  const navigate = useNavigate();
  const [tableData, setData] = useState<SettingsModel[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch();
  }, []);

  const fetch = async () => {
    try {
      setIsLoading(true);
      const result = (await SettingsController.getAll());
      setData(result);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const columns: TableColumn<SettingsModel>[] = [
    {
      key: 'settingKey',
      label: 'Setting Key',
      render: (_, dataSet) => (
        <div>
          <div className="font-medium">{dataSet.settingKey}</div>
        </div>
      ),
    },
    {
      key: 'settingValue',
      label: 'Setting Value',
      render: (value) => value
        ? typeof value === 'string' ? value : JSON.stringify(value)
        : '-',
    },
  ];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <Skeleton className="h-8 w-32 mb-2" />
            <Skeleton className="h-4 w-64" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>
        <Card>
          <CardContent className="p-6">
            <Skeleton className="h-64 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings Management</h1>
          <p className="text-muted-foreground">
            Manage and view all settings data
          </p>
        </div>
      </div>

      {/* Data Table */}
      <Card>
        <CardHeader>
          <CardTitle>Settings Data</CardTitle>
          <CardDescription>
            A list of all settings data in the system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            data={tableData || []}
            columns={columns}
            actions={(row) => (
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate(`/admin/settings/edit/${row.id}`)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
              </div>
            )}
          />
        </CardContent>
      </Card>
    </div>
  );
};
