import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DataTable } from '@/components/tables/DataTable';
import { ConfirmDialog } from '@/components/feedback/ConfirmDialog';
import { Skeleton } from '@/components/ui/skeleton';
import UserController from '@/controllers/admin/userController';
import { formatDate } from '@/utils/date';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { getEnumLabel, IC_TYPE_OPTIONS, GENDER_OPTIONS, RECORD_STATUS_OPTIONS } from '@constants/global';
import { TableColumn } from '@/models/common'; 

interface UserModel {
  id: number;
  firstName: string; 
  lastName: string;
  email: string;
  icNumber: string;
  icTypeId: number;
  genderId: number;
  isEmailVerified: number;
  recordStatusId: number;
  createdDate: Date;   
  isLockedOut: boolean;
}

export const UserListPage: React.FC = () => {
  const navigate = useNavigate();
  const [tableData, setData] = useState<UserModel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [dataToDelete, setDataToDelete] = useState<UserModel | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const result = await UserController.getAll();
      setData(result);
    } catch (error) {
      console.error('Failed to fetch record:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!dataToDelete) return;

    try {
      await UserController.delete(dataToDelete.id);
      setData(tableData.filter(data => data.id !== dataToDelete.id));
      setDeleteDialogOpen(false);
      setDataToDelete(null);
      exitPage();
    } catch (error) {
      console.error('Failed to delete record:', error);
    }
  };

  const openDeleteDialog = (data: UserModel) => {
    setDataToDelete(data);
    setDeleteDialogOpen(true);
  };

  const exitPage = () => {
    navigate('/admin/user-management');
  }

  const columns: TableColumn<UserModel>[] = [
    {
      key: 'firstName',
      label: 'Name',
      render: (_, user) => (
        <div>
          <div className="font-medium">{user.firstName} {user.lastName}</div>
          <div className="text-sm text-muted-foreground">{user.email}</div>
        </div>
      ),
    },
    {
      key: 'icNumber',
      label: 'IC Number',
      render: (_, user) => (
        <div>
          <div className="font-medium">{getEnumLabel(IC_TYPE_OPTIONS, user.icTypeId)}</div>
          <div className="text-sm text-muted-foreground">{user.icNumber}</div>
        </div>
      ),
    },
    {
      key: 'genderId',
      label: 'Gender',
      render: (value) => getEnumLabel(GENDER_OPTIONS, value),
    },
    {
      key: 'isEmailVerified',
      label: 'Email Verified?',
      render: (value) => ( value ? <p className="text-center">{"\u2705"}</p> : '' ),
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
    {
      key: 'isLockedOut',
      label: 'Locked Out?',
      render: (value) => ( value ? <p className="text-center">{"\u2705"}</p> : '' ),
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
          <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
          <p className="text-muted-foreground">
            Manage and view all registered users
          </p>
        </div>
        <Button onClick={() => navigate('/admin/user-management/create')}>
          <Plus className="h-4 w-4 mr-2" />
          Add User
        </Button>
      </div>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>Users</CardTitle>
          <CardDescription>
            A list of all users in the system
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
                  onClick={() => navigate(`/admin/user-management/edit/${row.id}`)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                {/* <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openDeleteDialog(row)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button> */}
              </div>
            )}
          />
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete User"
        description={`Are you sure you want to delete ${dataToDelete?.firstName} ${dataToDelete?.lastName}? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleDeleteUser}
        variant="destructive"
      />
    </div>
  );
};
