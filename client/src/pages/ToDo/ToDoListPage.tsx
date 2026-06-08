import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DataTable } from '@/components/tables/DataTable';
import { ConfirmDialog } from '@/components/feedback/ConfirmDialog';
import { Skeleton } from '@/components/ui/skeleton';
import UserController from '@/controllers/userController'; // change controller here...
import { TableColumn, UserModel } from '@/models/userModel';
import { formatDate } from '@/utils/date';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { getEnumLabel, IC_TYPE_OPTIONS, GENDER_OPTIONS, RECORD_STATUS_OPTIONS, EMAIL_VERIFIED_OPTIONS } from '@constants/global';

export const ToDoListPage: React.FC = () => {

  interface iToDo {
    id: number
  }

  const navigate = useNavigate();
  const [listData, setData] = useState<iToDo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [dataToDelete, setDataToDelete] = useState<iToDo | null>(null);
  
  
  useEffect(() => {
    fetchData();
  }, []);

  // Add table fetch controller here...
  const fetchData = async () => {
    try {
      setIsLoading(true);
      const result = await UserController.getAll(); // Change data controller here... 
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
      setData(listData.filter(data => data.id !== dataToDelete.id));
      setDeleteDialogOpen(false);
      setDataToDelete(null);
      navigate('/Todo...');
    } catch (error) {
      console.error('Failed to delete record:', error);
    }
  };

  const openDeleteDialog = (data: iToDo) => {
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

    const columns: TableColumn<iToDo>[] = [
      // {
      //   key: 'firstName',
      //   label: 'Name',
      //   render: (_, user) => (
      //     <div>
      //       <div className="font-medium">{user.firstName} {user.lastName}</div>
      //       <div className="text-sm text-muted-foreground">{user.email}</div>
      //     </div>
      //   ),
      // },
      // {
      //   key: 'icNumber',
      //   label: 'IC Number',
      //   render: (value) => value ? value.toString() : '-',
      // },
      // {
      //   key: 'icTypeId',
      //   label: 'IC Type',
      //   render: (value) => value ? getEnumLabel(IC_TYPE_OPTIONS, value) : '-',
      // },
      // {
      //   key: 'genderId',
      //   label: 'Gender',
      //   render: (value) => value ? getEnumLabel(GENDER_OPTIONS, value) : '-',
      // },
      // {
      //   key: 'isVerified',
      //   label: 'Email Verified?',
      //   render: (value) => (
      //     <Badge variant={value===EMAIL_VERIFIED_OPTIONS.Verified 
      //     ? 'default' 
      //     : value===EMAIL_VERIFIED_OPTIONS.Unverified? 'secondary': 'destructive'}>
      //       { getEnumLabel(EMAIL_VERIFIED_OPTIONS, value) }
      //     </Badge>
      //   ),
      // },
      // {
      //   key: 'recordStatusId',
      //   label: 'Record Status',
      //   render: (value) => (
      //     <Badge variant={value===RECORD_STATUS_OPTIONS.Public 
      //     ? 'default' 
      //     : value===RECORD_STATUS_OPTIONS.Draft ? 'secondary': 'destructive'}>
      //       { getEnumLabel(RECORD_STATUS_OPTIONS, value) }
      //     </Badge>
      //   ),
      // },
      // {
      //   key: 'createdDate',
      //   label: 'Created',
      //   render: (value) => formatDate(value),
      // },
    ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">TODO Management (Change This...)</h1>
          <p className="text-muted-foreground">
            Manage and view all registered... (Change This...)
          </p>
        </div>
        <Button onClick={() => navigate('/Todo...')}>
          <Plus className="h-4 w-4 mr-2" />
          Add Record...     
        </Button>
      </div>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>Users (Change This...)</CardTitle>
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
                  onClick={() => navigate(`/edit/${row.id}`)}
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
        title="Delete User"
        description={`Are you sure you want to delete record: ${dataToDelete?.id}? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleDeleteUser}
        variant="destructive"
      />
    </div>
  );

}
