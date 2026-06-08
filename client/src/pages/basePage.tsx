
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DataTable } from '@/components/tables/DataTable';
import { ConfirmDialog } from '@/components/feedback/ConfirmDialog';
import { Skeleton } from '@/components/ui/skeleton';
import CompanyController from '@/controllers/companyController'; // change controller here...
import { TableColumn } from '@/models/common';
import { formatDate } from '@/utils/date';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { getEnumLabel, RECORD_STATUS_OPTIONS} from '@constants/global';

export const BasePage: React.FC = () => {

    interface iTableRows {
        id: number,
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
}
