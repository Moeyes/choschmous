"use client";

import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, MapPin } from "lucide-react";
import { useMemo, useState } from "react";
import SectionHeader from "../overview/SectionHeader";
import StatsGrid from "../overview/StatsGrid";
import type { DashboardProvince } from "../types";

type ProvincesSectionProps = {
  provinces: DashboardProvince[];
  onCreateProvince?: () => void;
};

export function ProvincesSection({
  provinces,
  onCreateProvince,
}: ProvincesSectionProps) {
  const [list, setList] = useState<DashboardProvince[]>(provinces);

  const stats = useMemo(() => {
    const totalProvinces = list.length;
    const totalMinistry = 0; // TODO: Calculate from participant data
    const totalOrganizations = totalProvinces + totalMinistry;
    return { totalProvinces, totalOrganizations, totalMinistry };
  }, [list]);

  const topProvince = useMemo(() => {
    if (list.length === 0) return null;
    return [...list].sort((a, b) => b.participants - a.participants)[0];
  }, [list]);

  return (
    <div className="space-y-6">
      <SectionHeader
        icon={<MapPin className="h-6 w-6 text-slate-400" />}
        title="ស្ថិតិខេត្ត/ក្រុង"
        subtitle="មើលចំណាត់ថ្នាក់ និងចំនួនអ្នកចូលរួមតាមខេត្ត"
        actions={
          <>
            <button className="h-11 px-4 rounded-xl border border-blue-600 text-blue-600 font-medium">
              នាំចេញ
            </button>
            <button
              onClick={onCreateProvince}
              className="bg-[#1a4cd8] hover:bg-blue-700 rounded-xl gap-2 h-11 inline-flex items-center px-4 text-white font-medium"
            >
              <Plus className="h-4 w-4" /> <span>បន្ថែមខេត្ត</span>
            </button>
          </>
        }
      />

      <StatsGrid
        items={[
          {
            label: "សរុបអង្គការ",
            value: String(stats.totalOrganizations),
            color: "bg-blue-100",
          },
          {
            label: "សរុបខេត្ត",
            value: String(stats.totalProvinces),
            color: "bg-green-100",
          },
          {
            label: "សរុបក្រសួង",
            value: String(stats.totalMinistry),
            color: "bg-orange-100",
          },
        ]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Province Card */}
        {topProvince && (
          <Card className="border-none shadow-sm rounded-3xl overflow-hidden relative p-8 h-full bg-white">
            <div className="flex flex-col h-full justify-center space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-4xl font-black text-slate-800">#1</span>
                <div className="bg-yellow-100 p-2 rounded-xl">
                  <svg
                    className="h-8 w-8 text-yellow-500"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                  </svg>
                </div>
              </div>
              <div>
                <h3 className="text-3xl font-black text-slate-900">
                  {topProvince.name}
                </h3>
              </div>
              <div className="space-y-3 pt-4 border-t">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 font-bold">
                    ចំនួនអ្នកចូលរួម:
                  </span>
                  <span className="text-4xl font-black text-[#1a4cd8]">
                    {topProvince.participants}
                  </span>
                </div>
              </div>
            </div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-50 rounded-full -mr-12 -mt-12 blur-2xl" />
          </Card>
        )}

        {/* Province Table */}
        <Card className="lg:col-span-2 border-none shadow-sm rounded-2xl p-6">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50/50 hover:bg-slate-50/50">
                <TableHead className="font-bold text-[10px] uppercase text-slate-400">
                  ចំណាត់ថ្នាក់
                </TableHead>
                <TableHead className="font-bold text-[10px] uppercase text-slate-400">
                  ខេត្ត/ក្រុង
                </TableHead>
                <TableHead className="font-bold text-[10px] uppercase text-slate-400">
                  អ្នកចូលរួម
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[...list]
                .sort((a, b) => b.participants - a.participants)
                .map((province, index) => (
                  <TableRow
                    key={province.name}
                    className="group transition-colors"
                  >
                    <TableCell className="font-bold text-slate-700">
                      #{index + 1}
                    </TableCell>
                    <TableCell className="font-bold text-slate-700">
                      {province.name}
                    </TableCell>
                    <TableCell className="font-bold text-[#1a4cd8]">
                      {province.participants}
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </Card>
      </div>
    </div>
  );
}

export default ProvincesSection;
