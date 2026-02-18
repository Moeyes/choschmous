"use client";

import { useState, useEffect } from "react";
import { ProvincesSection } from "@/src/features/dashboard/components";
import type {
  DashboardProvince,
  DashboardParticipant,
} from "@/src/features/dashboard/types/types";

function calcProvinces(
  participants: DashboardParticipant[],
): DashboardProvince[] {
  const provinces: Record<string, DashboardProvince> = {};
  participants.forEach((p) => {
    const key = p.province || "Unknown";
    if (!provinces[key]) {
      provinces[key] = { name: key, participants: 0, total: 0 };
    }
    provinces[key].participants += 1;
    provinces[key].total = provinces[key].participants;
  });
  return Object.values(provinces).sort(
    (a, b) => b.participants - a.participants,
  );
}

export default function ProvincesPage() {
  const [provinces, setProvinces] = useState<DashboardProvince[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadProvinces() {
      try {
        const res = await fetch("/api/superadmin");
        const data = await res.json();
        const calculatedProvinces = calcProvinces(data.participants || []);
        setProvinces(calculatedProvinces);
      } catch (error) {
        console.error("Failed to load provinces:", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadProvinces();
  }, []);

  if (isLoading) {
    return <div className="p-8">កំពុងផ្ទុកទិន្នន័យ...</div>;
  }

  return (
    <div className="p-6">
      <ProvincesSection provinces={provinces} />
    </div>
  );
}
