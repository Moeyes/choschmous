"use client";

import { DashboardContent } from "@/src/features/dashboard/components";
import { useDashboardData } from "@/src/features/dashboard/hooks/useDashboardData";

export default function Page() {
  const { participants, events, sports, isLoading } = useDashboardData();

  if (isLoading) {
    return <div className="p-8">កំពុងផ្ទុកទិន្នន័យ...</div>;
  }

  return (
    <div className="p-2">
      <DashboardContent
        events={events}
        athletes={participants}
        sports={sports}
        mode="superadmin"
      />
    </div>
  );
}
