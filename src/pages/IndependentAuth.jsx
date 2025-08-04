import React from 'react';
import { AuthProvider } from '@/components/AuthProvider';
import IndependentAuthLogin from '@/components/IndependentAuthLogin';

export default function IndependentAuthPage() {
  return (
    <AuthProvider>
      <IndependentAuthLogin onSuccess={() => window.location.href = '/Dashboard'} />
    </AuthProvider>
  );
}