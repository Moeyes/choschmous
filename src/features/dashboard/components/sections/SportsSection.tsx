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
import { Button } from "@/components/ui/button";
import { Trophy, Users, Plus, Pencil, Trash2 } from "lucide-react";
import type { DashboardSport } from "../types";
import { useMemo, useState } from "react";
import StatsGrid from "../overview/StatsGrid";

type SportsSectionProps = {
  sports: DashboardSport[];
  onCreateSport?: () => void;
  onEditSport?: (sport: DashboardSport) => void;
  onDeleteSport?: (id: string) => void;
  mode?: "admin" | "superadmin";
};

export function SportsSection({
  sports,
  onCreateSport,
  onEditSport,
  onDeleteSport,
  mode = "admin",
}: SportsSectionProps) {
  const [list, setList] = useState<DashboardSport[]>(sports);

  const stats = useMemo(() => {
    const totalSports = list.length;
    const activeSports = list.filter((s) => s.status !== "Completed").length;
    const totalParticipants = list.reduce(
      (acc, cur) => acc + Number(cur.participants || 0),
      0,
    );
    const categories = new Set(list.map((s) => s.category)).size;
    return { totalSports, activeSports, totalParticipants, categories };
  }, [list]);

  const handleDelete = (id: string) => {
    setList((prev) => prev.filter((s) => s.id !== id));
    onDeleteSport?.(id);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="bg-slate-100 p-3 rounded-xl">
            <Trophy className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Sports Management</h2>
            <p className="text-sm text-muted-foreground">
              Manage sports, categories, and participants
            </p>
          </div>
        </div>
        {mode === "superadmin" && (
          <Button
            onClick={onCreateSport}
            className="bg-[#1a4cd8] hover:bg-blue-700 rounded-xl gap-2 h-11"
          >
            <Plus className="h-4 w-4" />
            Add Sport
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          {
            label: "Total Sports",
            value: String(stats.totalSports),
            color: "bg-purple-100",
            icon: <Trophy className="h-6 w-6 text-purple-600" />,
          },
          {
            label: "Active Sports",
            value: String(stats.activeSports),
            color: "bg-green-100",
            icon: <Trophy className="h-6 w-6 text-green-600" />,
          },
          {
            label: "Total Participants",
            value: String(stats.totalParticipants),
            color: "bg-blue-100",
            icon: <Users className="h-6 w-6 text-blue-600" />,
          },
          {
            label: "Categories",
            value: String(stats.categories),
            color: "bg-orange-100",
            icon: <Trophy className="h-6 w-6 text-orange-600" />,
          },
        ].map((s) => (
          <Card
            key={s.label}
            className="border-none shadow-sm overflow-hidden rounded-2xl"
          >
            <div className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-muted-foreground font-medium mb-1">
                    {s.label}
                  </p>
                  <p className="text-3xl font-bold">{s.value}</p>
                </div>
                <div className={`${s.color} p-3 rounded-xl shadow-lg`}>
                  {s.icon}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Card className="border-none shadow-sm rounded-2xl p-6">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50/50 hover:bg-slate-50/50">
              <TableHead className="font-bold text-[10px] uppercase text-slate-400">
                Name
              </TableHead>
              <TableHead className="font-bold text-[10px] uppercase text-slate-400">
                Category
              </TableHead>
              <TableHead className="font-bold text-[10px] uppercase text-slate-400">
                Participants
              </TableHead>
              <TableHead className="font-bold text-[10px] uppercase text-slate-400">
                Status
              </TableHead>
              <TableHead className="font-bold text-[10px] uppercase text-slate-400">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {list.map((sport) => (
              <TableRow key={sport.id} className="group transition-colors">
                <TableCell className="font-bold text-slate-700">
                  {sport.name}
                </TableCell>
                <TableCell className="text-slate-500 font-medium">
                  {sport.category}
                </TableCell>
                <TableCell className="text-slate-500 font-medium">
                  {sport.participants}
                </TableCell>
                <TableCell>
                  <span
                    className={`px-3 py-1 rounded-lg text-xs font-medium ${
                      sport.status === "Ongoing"
                        ? "bg-green-100 text-green-700"
                        : sport.status === "Completed"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {sport.status}
                  </span>
                </TableCell>
                <TableCell>
                  {mode === "superadmin" ? (
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-lg bg-slate-50 hover:bg-slate-100"
                        onClick={() => onEditSport?.(sport)}
                      >
                        <Pencil className="h-4 w-4 text-slate-500" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-lg bg-slate-50 hover:bg-slate-100"
                        onClick={() => handleDelete(sport.id)}
                      >
                        <Trash2 className="h-4 w-4 text-slate-500" />
                      </Button>
                    </div>
                  ) : (
                    <span className="text-sm text-muted-foreground">—</span>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}

export default SportsSection;
