"use client";

import AdminLayout from '@/components/AdminLayout';
import { SearchProvider } from "@/context/SearchContext"; 

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SearchProvider>
      <AdminLayout>
        {children}
      </AdminLayout>
    </SearchProvider>
  );
}