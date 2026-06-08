import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { LoginPage } from '@/pages/Login/LoginPage';
import { DashboardPage } from '@/pages/admin/dashboard/dashboardPage';
import { UserListPage } from '@/pages/Users/UserListPage';

import { NavMenuRoleListPage } from '@/pages/NavMenuRoles/NavMenuRolesListPage';
import { NavMenusListPage } from '@/pages/NavMenus/NavMenuListPage';
import { NavMenuCreatePage } from '@/pages/NavMenus/NavMenuCreatePage';
import { NavMenuEditPage } from '@/pages/NavMenus/NavMenuEditPage';
import { NavMenuConfigPage } from '@/pages/NavMenuConfig/NavMenuConfigPage'
import { SystemRoleListPage } from '@/pages/SystemRoles/SystemRolesListPage';
import { SystemRoleCreatePage } from '@/pages/SystemRoles/SystemRoleCreatePage';
import { SystemRoleEditPage } from '@/pages/SystemRoles/SystemRoleEditPage';
import { UserPermissionListPage } from '@/pages/UserPermission/UserPermissionListPage';
import { UserPermissionCreatePage } from '@/pages/UserPermission/UserPermissionCreatePage';
import { UserPermissionEditPage } from '@/pages/UserPermission/UserPermissionEditPage';
import { CompanyListPage } from '@/pages/Company/CompanyListPage';
import { CompanyCreatePage } from '@/pages/Company/CompanyCreatePage';
import { CompanyEditPage } from '@/pages/Company/CompanyEditPage';
import { UserCreatePage } from '@/pages/Users/UserCreatePage';
import { UserEditPage } from '@/pages/Users/UserEditPage';
import { useAuthGuard } from '@/hooks/useAuthGuard';
import { useRedirectIfAuthenticated } from '@/hooks/useAuthGuard';
import { StaticDataListPage } from '@/pages/StaticData/StaticDataListPage';
import { RegisterPage } from '@/pages/Register/RegisterPage';
import { ForgotPasswordPage } from '@/pages/ForgotPassword/ForgotPasswordPage';
import { ProfilePage } from '@/pages/Profile/ProfilePage';
import { SettingsListPage } from '@/pages/Settings/SettingsListPage';
import { SettingsEditPage } from '@/pages/Settings/SettingsEditPage';
import { pluginRoutes } from '@/plugins/plugin-loader';
import { PluginManagementPage } from '@/pages/Plugins/PluginManagementPage';

// Protected Route Wrapper
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  useAuthGuard();
  return <>{children}</>;
};

// Public Route Wrapper (redirects if authenticated)
const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  useRedirectIfAuthenticated();
  return <>{children}</>;
};

const router = createBrowserRouter([
  {
    path: '/login',
    element: (
      <PublicRoute>
        <LoginPage />
      </PublicRoute>
    ),
  },
  {
    path: '/register',
    element: (
      <PublicRoute>
        <RegisterPage />
      </PublicRoute>
    ),
  },
  {
    path: '/forgot-password',
    element: (
      <PublicRoute>
        <ForgotPasswordPage />
      </PublicRoute>
    ),
  },
  {
    path: '/admin/',
    element: (
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: 'dashboard',
        element: <DashboardPage />,
      },
      {
        path: 'settings/',
        element: <SettingsListPage />,
      },
      {
        path: 'settings/edit/:id',
        element: <SettingsEditPage />,
      },
      {
        path: 'plugins',
        element: <PluginManagementPage />,
      },
      {
        path: 'company/',
        element: <CompanyListPage />,
      },
      {
        path: 'company/create/',
        element: <CompanyCreatePage />,
      },
      {
        path: 'company/edit/:id',
        element: <CompanyEditPage />,
      },
      {
        path: 'navigation-menu/',
        element: <NavMenusListPage />,
      },
      {
        path: 'navigation-menu/create',
        element: <NavMenuCreatePage />,
      },
      {
        path: 'navigation-menu/edit/:id',
        element: <NavMenuEditPage />,
      },
      {
        path: 'menu-config',
        element: <NavMenuConfigPage />,
      },
      {
        path: 'role-management/',
        element: <SystemRoleListPage />
      },
      {
        path: 'role-management/create',
        element: <SystemRoleCreatePage />,
      },
      {
        path: 'role-management/edit/:id',
        element: <SystemRoleEditPage />,
      },
      {
        path: 'static-data',
        element: <StaticDataListPage />,
      },
      {
        path: 'user-management/',
        element: <UserListPage />,
      },
      {
        path: 'user-management/create',
        element: <UserCreatePage />,
      },
      {
        path: 'user-management/edit/:id',
        element: <UserEditPage />,
      },
      {
        path: 'user-permission/',
        element: <UserPermissionListPage />,
      },
      {
        path: 'user-permission/create',
        element: <UserPermissionCreatePage />,
      },
      {
        path: 'user-permission/edit/:id',
        element: <UserPermissionEditPage />,
      },
      ...pluginRoutes,
    ],
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <DashboardPage />,
      },
      {
        path: 'profile',
        element: <ProfilePage />,
      },
      {
        path: 'nav-menu-roles',
        element: <NavMenuRoleListPage />,
      },
    ],
  },
]);

export const AppRouter: React.FC = () => {
  return <RouterProvider router={router} />;
};
