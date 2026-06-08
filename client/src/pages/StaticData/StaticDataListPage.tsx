import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DataTable } from '@/components/tables/DataTable';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import  StaticDataController from '@/controllers/admin/staticDataController';
import { TableColumn } from '@/models/common';
import { formatDate } from '@/utils/date';
import { getEnumLabel, RECORD_STATUS_OPTIONS } from '@constants/global';

export const StaticDataListPage: React.FC = () => {
  
  interface iTableRows {
    id: number;
    dataKey: string;
    dataText: string;
    dataValue: string;
    createdDate: string;
    recordStatusId?: number | 0;
  }
  const [tableData, setData] = useState<iTableRows[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch();
  }, []);

  const fetch = async () => {
    try {
      setIsLoading(true);
      const result = await StaticDataController.getAll();
      setData(result);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const columns: TableColumn<iTableRows>[] = [
    {
      key: 'dataKey',
      label: 'Option Key',
      render: (_, dataSet) => (
        <div>
          <div className="font-medium">{dataSet.dataKey}</div>
        </div>
      ),
    },
    {
      key: 'dataText',
      label: 'Option Text',
      render: (value) => value ? value.toString() : '-',
    },
    {
      key: 'dataValue',
      label: 'Option Value',
      render: (value) => value ? value : '-',
    },
    {
      key: 'recordStatusId',
      label: 'Record Status',
      render: (value) => (
        <Badge variant={value===RECORD_STATUS_OPTIONS.Public 
        ? 'default' 
        : value===RECORD_STATUS_OPTIONS.Draft ? 'secondary': 'destructive'}>
          { getEnumLabel(RECORD_STATUS_OPTIONS, value) }
        </Badge>
      ),
    },
    {
      key: 'createdDate',
      label: 'Created',
      render: (value) => formatDate(value),
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
          <h1 className="text-3xl font-bold tracking-tight">Static Data Management</h1>
          <p className="text-muted-foreground">
            Manage and view all static data
          </p>
        </div>
      </div>

      {/* Data Table */}
      <Card>
        <CardHeader>
          <CardTitle>Static Data</CardTitle>
          <CardDescription>
            A list of all static data in the system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            data={tableData || []}
            columns={columns}
          />
        </CardContent>
      </Card>
    </div>
  );
};
