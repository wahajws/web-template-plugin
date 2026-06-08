export interface PluginManagementModel {
  name: string;
  label: string;
  description: string;
  installed: boolean;
  canDelete: boolean;
  path: string;
  updatedDate?: string | null;
}
