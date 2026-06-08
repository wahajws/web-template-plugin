import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DataTable } from '@/components/tables/DataTable';
import { ConfirmDialog } from '@/components/feedback/ConfirmDialog';
import { Skeleton } from '@/components/ui/skeleton';
import NavMenuController from '@/controllers/admin/navMenuController'; // change controller here...
import { TableColumn } from '@/models/common';
import { formatDate } from '@/utils/date';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { getEnumLabel, RECORD_STATUS_OPTIONS } from '@constants/global';

export const NavMenusListPage: React.FC = () => {

  interface iTableRows {
    id: number,
    menuText: string,
    parentId: number,
    parentMenu: number,
    menuDescription: string,
    url: string,
    icon: string,
    orderIndex: number,
    recordStatusId: number,
    createdDate: Date,
  }

  const navigate = useNavigate();
  const [listData, setData] = useState<iTableRows[]>([]);
  const [isLoading, setIsLoading] = useState(true);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [dataToDelete, setDataToDelete] = useState<iTableRows | null>(null);
  
  
  useEffect(() => {
    fetchData();
  }, []);

  // Add table fetch controller here...
  const fetchData = async () => {
    try {
      setIsLoading(true);
      const response = await NavMenuController.getAll();
      const normalizeResponse = (payload: any): iTableRows[] => {
        if (payload && Array.isArray(payload.data)) return payload.data;
        if (Array.isArray(payload)) return payload;
        return [];
      };
      setData(normalizeResponse(response));
    } catch (error) {
      console.error('Failed to fetch record:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!dataToDelete) return;

    try {
      await NavMenuController.delete(dataToDelete.id);
      setData(listData.filter(data => data.id !== dataToDelete.id));
      setDeleteDialogOpen(false);
      setDataToDelete(null);
      navigate('/admin/nav-menus');
    } catch (error) {
      console.error('Failed to delete record:', error);
    }
  };

  const openDeleteDialog = (data: iTableRows) => {
    setDataToDelete(data);
    setDeleteDialogOpen(true);
  };


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

    const columns: TableColumn<iTableRows>[] = [
      {
        key: 'menuText',
        label: 'Name',
        render: (_, tableRow) => (
          <div>
            <div className="font-medium">{tableRow.menuText}</div>
          </div>
        ),
      },
      {
        key: 'menuDescription',
        label: 'Description',
        render: (value) => value ? value : '-',
      },
      {
        key: 'parentMenu',
        label: 'Parent Menu',
        render: (value) => value ? value: '-',
      },
      {
        key: 'url',
        label: 'Url',
        render: (value) => value ? value : '-',
      },
      {
        key: 'orderIndex',
        label: 'Sort Order',
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Navigation Menu Management</h1>
          <p className="text-muted-foreground">
            Manage and view all registered
          </p>
        </div>
        <Button onClick={() => navigate('/admin/navigation-menu/create')}>
          <Plus className="h-4 w-4 mr-2" />
          Add Navigation Menu     
        </Button>
      </div>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>Navigation Menus</CardTitle>
          <CardDescription>
            A list of all available records
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            data={listData || []}
            columns={columns}
            actions={(row) => (
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate(`/admin/navigation-menu/edit/${row.id}`)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openDeleteDialog(row)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            )}
          />
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete Navigation Menu"
        description={`Are you sure you want to delete record: ${dataToDelete?.id}? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleDeleteUser}
        variant="destructive"
      />
    </div>
  );

}
