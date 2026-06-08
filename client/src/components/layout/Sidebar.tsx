import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/utils/format';
import { useUIStore } from '@/state/ui.store';
import { Button } from '@/components/ui/button';
import  NavMenuController from '@/controllers/admin/navMenuController';
import { icons } from 'lucide-react';
import { pluginNavigation } from '@/plugins/plugin-loader';
import PluginManagementService from '@/services/pluginManagementService';

function LucideIcon({ name, className }: { name: string; className?: string }) {
  const normalizedName = name
    .toLowerCase()
    .split(/[-_\s]/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');
    
  const IconComponent = icons[normalizedName as keyof typeof icons];
  
  return IconComponent ? 
    <IconComponent size={22} strokeWidth={1.75} className={className} /> : 
    <icons.Share2 size={22} strokeWidth={1.75} className={className} />;
}

export const Sidebar: React.FC = () => {
  const location = useLocation();
  const { sidebarOpen, toggleSidebar } = useUIStore();
  const [expandedPlugins, setExpandedPlugins] = React.useState<Record<string, boolean>>({});
  const pluginManagementNavigation = {
    menuId: 'plugin-management',
    menuText: 'Plugin Management',
    url: '/admin/plugins',
    icon: 'Package',
    parentId: null,
    orderIndex: 899,
  };

  const [navigation, setNavigation] = React.useState<any[]>([
    pluginManagementNavigation,
    ...pluginNavigation,
  ]);

  const togglePlugin = (pluginName: string) => {
    setExpandedPlugins((currentState) => ({
      ...currentState,
      [pluginName]: !currentState[pluginName],
    }));
  };

  React.useEffect(() => {
    const activePluginName = location.pathname.startsWith('/admin/plugins/')
      ? location.pathname.split('/')[3]
      : null;

    if (activePluginName) {
      setExpandedPlugins((currentState) => ({
        ...currentState,
        [activePluginName]: true,
      }));
    }
  }, [location.pathname]);

  React.useEffect(() => {
    const fetchNavigation = async () => {
      try {
        const [authorisedNavigation, plugins] = await Promise.all([
          NavMenuController.getAuthorised(),
          PluginManagementService.getAll(),
        ]);
        const installedPlugins = plugins
          .filter((plugin) => plugin.installed)
          .map((plugin) => plugin.name);
        const activePluginNavigation = pluginNavigation.filter((item) => {
          const pluginName = item.pluginName || item.url.split('/')[3];
          return installedPlugins.includes(pluginName);
        });

        setNavigation(
          [
            ...(Array.isArray(authorisedNavigation) ? authorisedNavigation : []),
            pluginManagementNavigation,
            ...activePluginNavigation,
          ].sort((firstItem, secondItem) => (firstItem.orderIndex || 0) - (secondItem.orderIndex || 0))
        );
      } catch (error) {
        console.error('Failed to fetch navigation:', error);
        setNavigation([
          pluginManagementNavigation,
          ...pluginNavigation,
        ]);
      }
    };

    fetchNavigation();
    window.addEventListener('plugins:changed', fetchNavigation);

    return () => {
      window.removeEventListener('plugins:changed', fetchNavigation);
    };
  }, []);

  return (
    <>
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <div className={cn(
        "fixed left-0 top-0 z-50 h-full bg-card border-r transition-all duration-300",
        sidebarOpen ? "w-64" : "w-16 lg:w-20"
      )}>
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex h-16 items-center justify-between px-4 border-b">
            {sidebarOpen && (
              <div className="flex items-center space-x-2">
                <LucideIcon name={'bar-chart-3'} className="h-8 w-8 text-primary" />
                <span className="text-xl font-bold">AMAST</span>
              </div>
            )}
            {!sidebarOpen && (
              <LucideIcon name={'bar-chart-3'} className="h-8 w-8 text-primary mx-auto" />
            )}
            <Button
              variant="ghost"
              // size="icon"
              onClick={toggleSidebar}
            >
              {sidebarOpen ? <LucideIcon name={'X'} className="h-4 w-4" /> : <LucideIcon name={'Menu'} className="h-4 w-4" />}
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 p-4">
            {navigation.map((item) => {
              if (item.isPluginRoot && item.pluginName) {
                const childItems = navigation.filter((childItem) => {
                  return childItem.pluginName === item.pluginName && !childItem.isPluginRoot;
                });
                const isExpanded = expandedPlugins[item.pluginName];
                const isActive = location.pathname === item.url || location.pathname.startsWith(`${item.url}/`);

                return (
                  <div key={item.menuId}>
                    <button
                      type="button"
                      onClick={() => togglePlugin(item.pluginName)}
                      className={cn(
                        "flex w-full items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                        isActive
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                      )}
                    >
                      { item.icon && <LucideIcon name={item.icon} className={cn("h-5 w-5", sidebarOpen ? "mr-3" : "mx-auto")} /> }
                      { sidebarOpen && (
                        <>
                          <span className="flex-1 text-left">{item.menuText}</span>
                          <LucideIcon name={isExpanded ? 'ChevronDown' : 'ChevronRight'} className="h-4 w-4" />
                        </>
                      ) }
                    </button>

                    {sidebarOpen && isExpanded && (
                      <div className="mt-1 space-y-1 pl-8">
                        {childItems.map((childItem) => {
                          const isChildActive = location.pathname === childItem.url;

                          return (
                            <Link
                              key={childItem.menuId}
                              to={childItem.url}
                              className={cn(
                                "flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                                isChildActive
                                  ? "bg-primary text-primary-foreground"
                                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                              )}
                            >
                              { childItem.icon && <LucideIcon name={childItem.icon} className="h-4 w-4 mr-2" /> }
                              <span>{childItem.menuText}</span>
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              }

              if (item.pluginName && !item.isPluginRoot) {
                return null;
              }

              const isActive = location.pathname === item.url || 
                (item.url !== '/dashboard' && location.pathname.startsWith(item.url));
              
              return (
                <Link
                  key={item.menuId}
                  to={item.url}
                  className={cn(
                    "flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  )}
                >
                  { item.icon && <LucideIcon name={item.icon} className={cn("h-5 w-5", sidebarOpen ? "mr-3" : "mx-auto")} /> }
                  { sidebarOpen && <span>{item.menuText}</span> }
                </Link>
              );
            })}
          </nav>

          {/* Quick Actions */}
          {sidebarOpen && (
            <div className="p-4 border-t">
              <Link to='/admin/user-management/create'>
                <Button className="w-full" size="sm">
                  <LucideIcon name={'UserPlus'} className="h-4 w-4 mr-2" />
                  Add User
                </Button>
              </Link>
            </div>
          )}


        </div>
      </div>
    </>
  );
};
