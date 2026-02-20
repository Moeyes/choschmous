"use client";

import { DashboardLayout } from "@/src/features/dashboard/components";

export function DashboardLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardLayout mode="superadmin">{children}</DashboardLayout>;
}
