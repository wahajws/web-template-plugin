import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/state/auth.store';

export const useAuthGuard = () => {
  const { isAuthenticated, hydrateFromStorage } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [hasHydrated, setHasHydrated] = useState(false);

  useEffect(() => {
    // Hydrate auth state from storage on mount
    hydrateFromStorage();
    setHasHydrated(true);
  }, [hydrateFromStorage]);

  useEffect(() => {
    // Check if user is authenticated
    if (hasHydrated && !isAuthenticated && location.pathname !== '/login') {
      navigate('/login', { replace: true });
    }
  }, [hasHydrated, isAuthenticated, navigate, location.pathname]);

  return { isAuthenticated };
};

export const useRedirectIfAuthenticated = () => {
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  return { isAuthenticated };
};
