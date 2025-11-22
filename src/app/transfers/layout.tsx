'use client';

import ProtectedLayout from '@/components/layout/ProtectedLayout';

export default function TransfersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ProtectedLayout>{children}</ProtectedLayout>;
}
