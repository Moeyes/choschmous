"use client";

import { cn } from "@/src/lib/utils";

interface SurveySidebarProps {
  selectedOrg: string;
  selectedSports: string[];
  sportOptions: any[];
}

export function SurveySidebar({
  selectedOrg,
  selectedSports,
  sportOptions,
}: SurveySidebarProps) {
  const selectedSportObjects = sportOptions.filter((s: any) =>
    selectedSports.includes(s.id),
  );

  return (
    <aside className="hidden lg:flex lg:flex-col w-80 bg-white/95 border-r border-slate-200 p-6 lg:sticky lg:top-18 lg:h-[calc(100vh-72px)] lg:overflow-y-auto lg:pb-8">
      <div className="space-y-6">
        {/* Title */}
        <div>
          <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-4">
            សង្ខេបការជ្រើសរើស
          </h3>
        </div>

        {/* Organization Section */}
        <div className="space-y-2">
          <div className="text-sm font-medium text-slate-700">ស្ថាប័ន</div>

          <div
            className={cn(
              "px-4 py-3 rounded-lg border text-sm",
              selectedOrg
                ? "bg-indigo-50 border-indigo-200 text-indigo-700"
                : "bg-slate-50 border-slate-200 text-slate-400",
            )}
          >
            {selectedOrg || "មិនទាន់ជ្រើសរើស"}
          </div>
        </div>

        {/* Sports Section */}
        <div className="space-y-3">
          <div className="text-sm font-medium text-slate-700">កីឡា</div>

          {selectedSportObjects.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {selectedSportObjects.map((sport: any) => (
                <span
                  key={sport.id}
                  className="px-3 py-1 text-xs rounded-full bg-green-50 text-green-700 border border-green-200"
                >
                  {sport.khmerName || sport.name}
                </span>
              ))}
            </div>
          ) : (
            <div className="text-sm text-slate-400 bg-slate-50 border border-slate-200 px-4 py-3 rounded-lg">
              មិនទាន់ជ្រើសរើសកីឡា
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
