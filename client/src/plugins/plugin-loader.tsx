import { RouteObject } from 'react-router-dom';

export interface PluginNavigationItem {
  menuId: string;
  menuText: string;
  url: string;
  icon?: string;
  parentId?: number | null;
  orderIndex?: number;
  pluginName?: string;
  isPluginRoot?: boolean;
}

export interface ClientPlugin {
  name: string;
  label: string;
  routes: RouteObject[];
  navigation: PluginNavigationItem[];
}

const pluginModules = (import.meta as any).glob('./*/plugin.tsx', { eager: true });

export const getClientPlugins = (): ClientPlugin[] => {
  const trackPlugin = String((import.meta as any).env?.VITE_TRACK_PLUGIN || '').toLowerCase() === 'true';

  if (!trackPlugin) {
    return [];
  }

  return Object.values(pluginModules)
    .map((module) => (module as { default?: ClientPlugin }).default)
    .filter((plugin): plugin is ClientPlugin => Boolean(plugin));
};

export const pluginRoutes = getClientPlugins().flatMap((plugin) => plugin.routes);
export const pluginNavigation = getClientPlugins().flatMap((plugin) => plugin.navigation);
