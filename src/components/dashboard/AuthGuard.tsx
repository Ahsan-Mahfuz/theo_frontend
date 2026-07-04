'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/store/hooks';

// Client-side gate for the dashboard: sends unauthenticated visitors to /login.
// Auth state is persisted in localStorage and rehydrated by the auth slice, so
// this runs after mount to avoid an SSR/CSR mismatch.
export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { token } = useAuth();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (!token) {
      router.replace('/login');
    } else {
      setChecked(true);
    }
  }, [token, router]);

  if (!token || !checked) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-[14px] text-gray-500">
        Loading…
      </div>
    );
  }

  return <>{children}</>;
}
