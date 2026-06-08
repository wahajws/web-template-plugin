import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { DonutChart } from '@/components/charts/DonutChart';
import { BarChartComponent } from '@/components/charts/BarChart';
import { DataTable } from '@/components/tables/DataTable';
import UserController from '@/controllers/admin/userController';
import { UserModel, UserAnalytics } from '@/models/userModel';
import { formatNumber } from '@/utils/format';
import { Users, UserCheck, TrendingUp } from 'lucide-react';
import { getEnumLabel, GENDER_OPTIONS } from '@constants/global';
import { TableColumn } from '@/models/common';

export const DashboardPage: React.FC = () => {
  const [analytics, setAnalytics] = useState<UserAnalytics | null>(null);
  const [recentUsers, setRecentUsers] = useState<UserModel[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        const [analyticsData, recentUsersData] = await Promise.all([
          UserController.getUserAnalytics(),
          UserController.getRecentUsers(5),
        ]);
        
        setAnalytics(analyticsData);
        setRecentUsers(recentUsersData);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
        // Set fallback data when API fails
        setAnalytics({
          totalUsers: 0,
          verifiedUsers: 0,
          unverifiedUsers: 0,
          genderDistribution: [],
          newUsersLast7Days: 0,
          newUsersLast30Days: 0,
        });
        setRecentUsers([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const recentUsersColumns: TableColumn<UserModel>[] = [
    {
      key: 'firstName',
      label: 'Name',
      render: (_, user) => `${user.firstName} ${user.lastName}`,
    },
    {
      key: 'email',
      label: 'Email',
    },
    {
      key: 'isVerified',
      label: 'Status',
      render: (value) => (
        <Badge variant={value ? 'default' : 'secondary'}>
          {value ? 'Verified' : 'Unverified'}
        </Badge>
      ),
    },
    {
      key: 'createdDate',
      label: 'Created',
      render: (value) => new Date(value).toLocaleDateString(),
    },
  ];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-96" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16 mb-1" />
                <Skeleton className="h-3 w-32" />
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {Array.from({ length: 2 }).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-64 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Failed to load dashboard data</p>
      </div>
    );
  }

  // Prepare chart data
  const genderChartData = analytics.genderDistribution.map(item => ({
    name: getEnumLabel(GENDER_OPTIONS, item.genderId),
    value: item.count,
  }));

  const verificationChartData = [
    { name: 'Verified', value: analytics.verifiedUsers, color: '#00C49F' },
    { name: 'Unverified', value: analytics.unverifiedUsers, color: '#FF8042' },
  ];

  // Mock time series data for new users - removed for now
  // const timeSeriesData = [
  //   { date: '2024-01-01', value: 5 },
  //   { date: '2024-01-02', value: 8 },
  //   { date: '2024-01-03', value: 12 },
  //   { date: '2024-01-04', value: 15 },
  //   { date: '2024-01-05', value: 18 },
  //   { date: '2024-01-06', value: 22 },
  //   { date: '2024-01-07', value: 25 },
  // ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome to AMAST analytics dashboard
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(analytics.totalUsers)}</div>
            <p className="text-xs text-muted-foreground">
              All registered users
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Verified Users</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(analytics.verifiedUsers)}</div>
            <p className="text-xs text-muted-foreground">
              {((analytics.verifiedUsers / analytics.totalUsers) * 100).toFixed(1)}% of total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New This Week</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(analytics.newUsersLast7Days)}</div>
            <p className="text-xs text-muted-foreground">
              Last 7 days
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New This Month</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(analytics.newUsersLast30Days)}</div>
            <p className="text-xs text-muted-foreground">
              Last 30 days
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>User Verification Status</CardTitle>
            <CardDescription>
              Distribution of verified vs unverified users
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DonutChart data={verificationChartData} height={300} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Gender Distribution</CardTitle>
            <CardDescription>
              User distribution by gender
            </CardDescription>
          </CardHeader>
          <CardContent>
            <BarChartComponent data={genderChartData} height={300} />
          </CardContent>
        </Card>
      </div>

      {/* Recent Users */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Users</CardTitle>
          <CardDescription>
            Latest registered users
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            data={recentUsers || []}
            columns={recentUsersColumns}
            searchable={false}
            filterable={false}
            sortable={false}
            pagination={false}
          />
        </CardContent>
      </Card>
    </div>
  );
};
