'use client';

import ProtectedLayout from '@/components/layout/ProtectedLayout';

export default function ReceiptsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ProtectedLayout>{children}</ProtectedLayout>;
}
