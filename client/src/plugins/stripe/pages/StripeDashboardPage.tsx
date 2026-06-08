import React, { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { DataTable } from '@/components/tables/DataTable';
import { TableColumn } from '@/models/common';
import { formatCurrency } from '@/utils/format';
import { Activity, AlertTriangle, CreditCard, DollarSign, Link, RefreshCcw, Users } from 'lucide-react';
import StripeController from '../controllers/stripeController';
import { StripeDashboardModel, StripeResourceItem } from '../models/stripeModel';

const formatStripeDate = (value?: number) => {
  if (!value) {
    return '-';
  }

  return new Date(value * 1000).toLocaleDateString();
};

export const StripeDashboardPage: React.FC = () => {
  const [dashboard, setDashboard] = useState<StripeDashboardModel | null>(null);
  const [connection, setConnection] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setErrorMessage(null);
      const [connectionResult, dashboardResult] = await Promise.all([
        StripeController.connection(),
        StripeController.dashboard(),
      ]);
      setConnection(connectionResult);
      setDashboard(dashboardResult);
    } catch (error: any) {
      console.error('Failed to fetch Stripe dashboard:', error);
      setErrorMessage(error.message || 'Unable to load Stripe dashboard');
    } finally {
      setIsLoading(false);
    }
  };

  const paymentColumns: TableColumn<StripeResourceItem>[] = [
    {
      key: 'id',
      label: 'Payment',
      render: (value, row) => (
        <div>
          <div className="font-medium">{value}</div>
          <div className="text-sm text-muted-foreground">{formatStripeDate(row.created)}</div>
        </div>
      ),
    },
    {
      key: 'amount',
      label: 'Amount',
      render: (value, row) => formatCurrency((Number(value) || 0) / 100, row.currency || 'usd'),
    },
    {
      key: 'status',
      label: 'Status',
      render: (value) => <Badge variant={value === 'succeeded' ? 'default' : 'destructive'}>{value || '-'}</Badge>,
    },
  ];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-72" />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          {[1, 2, 3, 4].map((item) => (
            <Skeleton key={item} className="h-28 w-full" />
          ))}
        </div>
        <Skeleton className="h-80 w-full" />
      </div>
    );
  }

  if (errorMessage || !dashboard) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Stripe Dashboard</h1>
            <p className="text-muted-foreground">
              Monitor memberships, revenue, payments, and billing health.
            </p>
          </div>
          <Button variant="outline" onClick={fetchData}>
            <RefreshCcw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Stripe Connection Failed</CardTitle>
            <CardDescription>
              Check the Stripe keys in Settings Management and try again.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Badge variant="destructive">{errorMessage || 'Unable to load Stripe dashboard'}</Badge>
          </CardContent>
        </Card>
      </div>
    );
  }

  const cards = [
    {
      label: 'Total Revenue',
      value: formatCurrency(dashboard.summary.totalRevenue / 100, dashboard.summary.currency || 'usd'),
      icon: DollarSign,
    },
    {
      label: 'Active Subscribers',
      value: dashboard.summary.activeSubscriptions,
      icon: Users,
    },
    {
      label: 'Failed Payments',
      value: dashboard.summary.failedPayments,
      icon: AlertTriangle,
    },
    {
      label: 'Payment Links',
      value: dashboard.summary.paymentLinks,
      icon: Link,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Stripe Dashboard</h1>
          <p className="text-muted-foreground">
            Monitor memberships, revenue, payments, and billing health.
          </p>
        </div>
        <Button variant="outline" onClick={fetchData}>
          <RefreshCcw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Connection</CardTitle>
          <CardDescription>Current Stripe account and settings status.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <div>
            <div className="text-sm text-muted-foreground">Mode</div>
            <Badge>{connection?.mode || '-'}</Badge>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Account</div>
            <div className="font-medium">{connection?.account?.id || '-'}</div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Charges</div>
            <Badge variant={connection?.account?.chargesEnabled ? 'default' : 'destructive'}>
              {connection?.account?.chargesEnabled ? 'Enabled' : 'Disabled'}
            </Badge>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Payouts</div>
            <Badge variant={connection?.account?.payoutsEnabled ? 'default' : 'secondary'}>
              {connection?.account?.payoutsEnabled ? 'Enabled' : 'Disabled'}
            </Badge>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Card key={card.label}>
              <CardContent className="flex items-center justify-between p-6">
                <div>
                  <p className="text-sm text-muted-foreground">{card.label}</p>
                  <p className="text-2xl font-bold">{card.value}</p>
                </div>
                <Icon className="h-8 w-8 text-muted-foreground" />
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <CreditCard className="h-5 w-5 mr-2" />
              Recent Payments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable
              data={dashboard.recentPayments || []}
              columns={paymentColumns}
              filterable={false}
              pageSize={5}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="h-5 w-5 mr-2" />
              Needs Attention
            </CardTitle>
            <CardDescription>Past due or unpaid subscriptions.</CardDescription>
          </CardHeader>
          <CardContent>
            <DataTable
              data={dashboard.subscriptionsNeedingAttention || []}
              columns={[
                { key: 'id', label: 'Subscription' },
                {
                  key: 'status',
                  label: 'Status',
                  render: (value) => <Badge variant="destructive">{value || '-'}</Badge>,
                },
                {
                  key: 'created',
                  label: 'Created',
                  render: (value) => formatStripeDate(value),
                },
              ]}
              filterable={false}
              pageSize={5}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
