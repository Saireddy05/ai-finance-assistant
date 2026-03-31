'use client';

import { useAuth as useAuthFromProvider } from '@/components/AuthProvider';

export const useAuth = () => {
  return useAuthFromProvider();
};
