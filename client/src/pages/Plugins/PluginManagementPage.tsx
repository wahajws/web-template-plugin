import { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ConfirmDialog } from '@/components/feedback/ConfirmDialog';
import { DataTable } from '@/components/tables/DataTable';
import PluginManagementController from '@/controllers/admin/pluginManagementController';
import { PluginManagementModel } from '@/models/pluginManagementModel';
import { TableColumn } from '@/models/common';
import { Package, Power, PowerOff, Trash2 } from 'lucide-react';

export const PluginManagementPage: React.FC = () => {
  const [plugins, setPlugins] = useState<PluginManagementModel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPlugin, setSelectedPlugin] = useState<PluginManagementModel | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  useEffect(() => {
    fetchPlugins();
  }, []);

  const fetchPlugins = async () => {
    try {
      setIsLoading(true);
      const result = await PluginManagementController.getAll();
      setPlugins(result);
    } catch (error) {
      console.error('Failed to fetch plugins:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInstall = async (plugin: PluginManagementModel) => {
    const result = await PluginManagementController.install(plugin.name);
    setPlugins((currentPlugins) => currentPlugins.map((item) => item.name === plugin.name ? result : item));
  };

  const handleUninstall = async (plugin: PluginManagementModel) => {
    const result = await PluginManagementController.uninstall(plugin.name);
    setPlugins((currentPlugins) => currentPlugins.map((item) => item.name === plugin.name ? result : item));
  };

  const handleDelete = async () => {
    if (!selectedPlugin) return;

    await PluginManagementController.delete(selectedPlugin.name);
    setPlugins((currentPlugins) => currentPlugins.filter((item) => item.name !== selectedPlugin.name));
    setSelectedPlugin(null);
  };

  const openDeleteDialog = (plugin: PluginManagementModel) => {
    setSelectedPlugin(plugin);
    setDeleteDialogOpen(true);
  };

  const columns: TableColumn<PluginManagementModel>[] = [
    {
      key: 'label',
      label: 'Plugin',
      render: (_, plugin) => (
        <div>
          <div className="font-medium">{plugin.label}</div>
          <div className="text-sm text-muted-foreground">{plugin.name}</div>
        </div>
      ),
    },
    {
      key: 'description',
      label: 'Description',
      render: (value) => value || '-',
    },
    {
      key: 'installed',
      label: 'Status',
      render: (value) => (
        <Badge variant={value ? 'default' : 'secondary'}>
          {value ? 'Installed' : 'Uninstalled'}
        </Badge>
      ),
    },
    {
      key: 'path',
      label: 'Folder',
      render: (value) => <span className="text-xs text-muted-foreground">{value}</span>,
    },
  ];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-72" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  const installedCount = plugins.filter((plugin) => plugin.installed).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="flex items-center text-3xl font-bold tracking-tight">
            <Package className="h-7 w-7 mr-3" />
            Plugin Management
          </h1>
          <p className="text-muted-foreground">
            Manage plugins discovered from the plugins folder.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground">Total Plugins</p>
            <p className="text-2xl font-bold">{plugins.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground">Installed</p>
            <p className="text-2xl font-bold">{installedCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground">Uninstalled</p>
            <p className="text-2xl font-bold">{plugins.length - installedCount}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Plugins</CardTitle>
          <CardDescription>
            Install, uninstall, or delete available plugin folders.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            data={plugins}
            columns={columns}
            actions={(plugin) => (
              <div className="flex items-center space-x-2">
                {plugin.installed ? (
                  <Button variant="outline" size="sm" onClick={() => handleUninstall(plugin)}>
                    <PowerOff className="h-4 w-4 mr-2" />
                    Uninstall
                  </Button>
                ) : (
                  <Button variant="outline" size="sm" onClick={() => handleInstall(plugin)}>
                    <Power className="h-4 w-4 mr-2" />
                    Install
                  </Button>
                )}
                <Button variant="destructive" size="sm" onClick={() => openDeleteDialog(plugin)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            )}
          />
        </CardContent>
      </Card>

      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete Plugin"
        description={`This will permanently delete the ${selectedPlugin?.label} plugin folder from disk. This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleDelete}
        variant="destructive"
      />
    </div>
  );
};
