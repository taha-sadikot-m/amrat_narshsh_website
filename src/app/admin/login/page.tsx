'use client';

import { Suspense } from 'react';
import AdminLoginPage from './LoginForm';

export default function Page() {
  return (
    <Suspense fallback={null}>
      <AdminLoginPage />
    </Suspense>
  );
}
