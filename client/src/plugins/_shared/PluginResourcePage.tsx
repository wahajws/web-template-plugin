import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { DataTable } from '@/components/tables/DataTable';
import { TableColumn } from '@/models/common';
import { ExternalLink, LucideIcon, Plus } from 'lucide-react';
import { BasePluginController } from './basePluginController';

export interface PluginResourcePageConfig<T extends Record<string, any>> {
  title: string;
  description: string;
  resource: string;
  icon: LucideIcon;
  columns: TableColumn<T>[];
  createPath?: string;
  actions?: (row: T) => React.ReactNode;
}

interface PluginResourcePageProps<T extends Record<string, any>> {
  controller: BasePluginController;
  config: PluginResourcePageConfig<T>;
}

export function PluginResourcePage<T extends Record<string, any>>({
  controller,
  config,
}: PluginResourcePageProps<T>) {
  const Icon = config.icon;
  const navigate = useNavigate();
  const [data, setData] = useState<T[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [config.resource]);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const result = await controller.list<T>(config.resource);
      setData(result);
    } catch (error) {
      console.error(`Failed to fetch plugin resource ${config.resource}:`, error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-72" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="flex items-center text-3xl font-bold tracking-tight">
            <Icon className="h-7 w-7 mr-3" />
            {config.title}
          </h1>
          <p className="text-muted-foreground">{config.description}</p>
        </div>
        {config.createPath && (
          <Button onClick={() => navigate(config.createPath || '')}>
            <Plus className="h-4 w-4 mr-2" />
            Create
          </Button>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{config.title}</CardTitle>
          <CardDescription>{data.length} record(s)</CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            data={data}
            columns={config.columns}
            actions={(row) => {
              if (config.actions) {
                return config.actions(row);
              }

              const externalUrl = row.url || row.hostedInvoiceUrl || row.invoicePdf;

              return externalUrl ? (
                <Button variant="outline" size="sm" asChild>
                  <a href={externalUrl} target="_blank" rel="noreferrer">
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </Button>
              ) : null;
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}
