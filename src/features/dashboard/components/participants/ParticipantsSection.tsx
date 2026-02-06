"use client";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Search,
  Eye,
  Pencil,
  Trash2,
  Users,
  Plus,
  X,
  Mail,
  Phone,
  Calendar,
  MapPin,
} from "lucide-react";
import type { DashboardAthlete } from "../types";
import { useMemo, useState, useEffect } from "react";
import SectionHeader from "../overview/SectionHeader";
import StatsGrid from "../overview/StatsGrid";
import {
  API_ENDPOINTS,
  STATUS_LABELS,
  STATUS_COLORS,
  PARTICIPANT_STATUS,
} from "@/src/config/constants";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ParticipantEditDialog } from "./ParticipantEditDialog";
import { formatDateToDDMMYYYYKhmer, toKhmerDigits } from "@/src/lib/khmer";

type ParticipantsSectionProps = {
  athletes: DashboardAthlete[];
  onViewAthlete?: (athlete: DashboardAthlete) => void;
  onEditAthlete?: (athlete: DashboardAthlete) => void;
  onDeleteAthlete?: (id: string) => void;
  onCreateAthlete?: () => void;
};

export function ParticipantsSection({
  athletes,
  onViewAthlete,
  onEditAthlete,
  onDeleteAthlete,
  onCreateAthlete,
}: ParticipantsSectionProps) {
  const [list, setList] = useState<DashboardAthlete[]>(athletes);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [positionFilter, setPositionFilter] = useState<string>("all");
  const [selectedParticipant, setSelectedParticipant] =
    useState<DashboardAthlete | null>(null);
  const [editingParticipant, setEditingParticipant] =
    useState<DashboardAthlete | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  useEffect(() => {
    setList(athletes);
  }, [athletes]);

  const stats = useMemo(() => {
    const total = list.length;
    const approved = list.filter(
      (a) => a.status?.toLowerCase() === "approved",
    ).length;
    const pending = list.filter(
      (a) => a.status?.toLowerCase() === "pending",
    ).length;
    const rejected = list.filter(
      (a) => a.status?.toLowerCase() === "rejected",
    ).length;
    return { total, approved, pending, rejected };
  }, [list]);

  const positions = useMemo(() => {
    return ["Athlete", "Coach", "Leader", "Official"];
  }, []);

  // Helper function to get display name (Khmer preferred)
  const getDisplayName = (participant: DashboardAthlete) => {
    return participant.fullNameKhmer || participant.name || "";
  };

  // Helper function to get organization display name (Khmer preferred)
  const getOrganizationDisplay = (participant: DashboardAthlete) => {
    return participant.organization?.name || participant.province || "";
  };

  // Helper function to get gender in Khmer
  const getGenderDisplay = (gender?: string) => {
    if (gender === "Male") return "ប្រុស";
    if (gender === "Female") return "ស្រី";
    return gender || "";
  };

  // Helper function to get status in Khmer
  const getStatusDisplay = (status?: string) => {
    if (status === PARTICIPANT_STATUS.approved) return STATUS_LABELS.approved;
    if (status === PARTICIPANT_STATUS.pending) return STATUS_LABELS.pending;
    if (status === PARTICIPANT_STATUS.rejected) return STATUS_LABELS.rejected;
    return status || "";
  };

  const filteredList = useMemo(() => {
    return list.filter((participant) => {
      const matchesSearch =
        !searchQuery ||
        participant.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        participant.fullNameKhmer
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        participant.province
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        participant.organization?.name?.includes(searchQuery) ||
        participant.sport?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        participant.sport?.includes(searchQuery);
      const matchesStatus =
        statusFilter === "all" ||
        participant.status?.toLowerCase() === statusFilter.toLowerCase();
      // For now, assume all are athletes - you can extend this with actual position data
      const matchesPosition =
        positionFilter === "all" || positionFilter.toLowerCase() === "athlete";
      return matchesSearch && matchesStatus && matchesPosition;
    });
  }, [list, searchQuery, statusFilter, positionFilter]);

  const getStatusBadgeColor = (status?: string) => {
    switch (status?.toLowerCase()) {
      case PARTICIPANT_STATUS.approved:
        return STATUS_COLORS.approved;
      case PARTICIPANT_STATUS.pending:
        return STATUS_COLORS.pending;
      case PARTICIPANT_STATUS.rejected:
        return STATUS_COLORS.rejected;
      default:
        return "bg-slate-500 hover:bg-slate-600 text-white";
    }
  };

  const getPositionBadgeColor = (position?: string) => {
    switch (position?.toLowerCase()) {
      case "athlete":
        return "bg-blue-100 text-blue-700";
      case "coach":
        return "bg-purple-100 text-purple-700";
      case "leader":
        return "bg-indigo-100 text-indigo-700";
      case "official":
        return "bg-teal-100 text-teal-700";
      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleEditClick = (participant: DashboardAthlete) => {
    setEditingParticipant(participant);
    setIsEditDialogOpen(true);
  };

  const handleSaveEdit = async (updatedParticipant: DashboardAthlete) => {
    // Update local state immediately
    setList((prev) =>
      prev.map((p) =>
        p.id === updatedParticipant.id ? updatedParticipant : p,
      ),
    );
    setIsEditDialogOpen(false);
    setEditingParticipant(null);

    // Save to backend/JSON
    try {
      // Check if photoUrl is a data URL (base64), indicating a new upload
      const isNewPhoto = updatedParticipant.photoUrl?.startsWith("data:");

      let response;
      if (isNewPhoto) {
        // Create FormData for multipart upload
        const formData = new FormData();

        // Convert base64 to blob
        const base64Data = updatedParticipant.photoUrl!;
        const blob = await fetch(base64Data).then((r) => r.blob());
        formData.append("photo", blob, "photo.jpg");

        // Add participant data as JSON payload
        const participantData = { ...updatedParticipant };
        delete (participantData as any).photoUrl; // Remove base64 data, will be replaced with uploaded file path
        formData.append("payload", JSON.stringify(participantData));

        response = await fetch(API_ENDPOINTS.registrations, {
          method: "PUT",
          body: formData,
        });
      } else {
        // No new photo, just send JSON
        response = await fetch(API_ENDPOINTS.registrations, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedParticipant),
        });
      }

      if (!response.ok) {
        console.error("Failed to save participant data");
      } else {
        const result = await response.json();
        // Update local state with the server response (which includes the new photo URL if uploaded)
        if (result.registration) {
          setList((prev) =>
            prev.map((p) =>
              p.id === result.registration.id ? result.registration : p,
            ),
          );
        }
      }
    } catch (error) {
      console.error("Error saving participant:", error);
    }

    // Call parent handler if provided
    onEditAthlete?.(updatedParticipant);
  };

  const handleDelete = (id: string) => {
    if (confirm("តើអ្នកប្រាកដថាចង់លុបអ្នកចូលរួមនេះម៉េនទេ?")) {
      onDeleteAthlete?.(id);
      setList((prev) => prev.filter((p) => p.id !== id));
      if (selectedParticipant?.id === id) {
        setSelectedParticipant(null);
      }
    }
  };

  return (
    <div className="space-y-6">
      <SectionHeader
        icon={<Users className="h-6 w-6 text-indigo-600" />}
        title="ការគ្រប់គ្រងអ្នកចូលរួម"
        subtitle="គ្រប់គ្រងការចុះឈ្មោះ និងគូលមេរីនៃអ្នកចូលរួម"
        actions={
          <Button
            onClick={onCreateAthlete}
            className="bg-linear-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 rounded-xl gap-2 h-11 shadow-lg shadow-indigo-500/30"
          >
            <Plus className="h-4 w-4" />
            ចុះឈ្បោះអ្នកចូលរួម
          </Button>
        }
      />

      <StatsGrid
        items={[
          {
            label: "អ្នកចូលរួមសរុប",
            value: String(stats.total),
            color: "bg-gradient-to-br from-blue-100 to-indigo-100",
          },
          {
            label: STATUS_LABELS.approved,
            value: String(stats.approved),
            color: "bg-gradient-to-br from-emerald-100 to-green-100",
          },
          {
            label: "កំពុងរង់ចាំ",
            value: String(stats.pending),
            color: "bg-gradient-to-br from-amber-100 to-yellow-100",
          },
          {
            label: STATUS_LABELS.rejected,
            value: String(stats.rejected),
            color: "bg-gradient-to-br from-rose-100 to-red-100",
          },
        ]}
      />

      <Card className="border-none shadow-lg rounded-2xl p-6 space-y-6 bg-white">
        {/* Filters */}
        <div className="flex flex-wrap gap-4">
          <div className="relative flex-1 min-w-50">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="ស្វែងរកអ្នកចូលរួម..."
              className="pl-10 h-11 bg-slate-50 border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <select
            className="h-11 px-4 rounded-xl border border-slate-200 bg-slate-50 text-sm font-medium hover:bg-slate-100 transition-colors focus:ring-2 focus:ring-indigo-500"
            value={positionFilter}
            onChange={(e) => setPositionFilter(e.target.value)}
          >
            <option value="all">តួនាទីទាំងអស់</option>
            {positions.map((position) => (
              <option key={position} value={position}>
                {position === "Athlete"
                  ? "កីឡាករ"
                  : position === "Coach"
                    ? "គ្រូបង្វឹក"
                    : position === "Leader"
                      ? "អ្នកដឹកនាំ"
                      : position === "Official"
                        ? "មន្ត្រី"
                        : position}
              </option>
            ))}
          </select>
          <select
            className="h-11 px-4 rounded-xl border border-slate-200 bg-slate-50 text-sm font-medium hover:bg-slate-100 transition-colors focus:ring-2 focus:ring-indigo-500"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">ស្ថានភាពទាំងអស់</option>
            <option value="approved">អនុម័ត</option>
            <option value="pending">កំពុងរង់ចាំ</option>
            <option value="rejected">បដិសេធ</option>
          </select>
        </div>

        {/* Participants Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-800 text-lg">
              បញ្ជីអ្នកចូលរួម ({filteredList.length})
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredList.map((participant) => (
              <Card
                key={participant.id}
                className="border border-slate-200 hover:border-indigo-300 rounded-xl p-4 space-y-3 cursor-pointer transition-all hover:shadow-lg group bg-linear-to-br from-white to-slate-50"
                onClick={() => setSelectedParticipant(participant)}
              >
                {/* Header with photo and status */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative w-12 h-16 shrink-0">
                      <img
                        src={
                          participant.photoUrl ||
                          `https://ui-avatars.com/api/?name=${encodeURIComponent(participant.name)}&background=6366f1&color=fff&size=128`
                        }
                        alt={participant.name}
                        className="w-full h-full object-cover rounded-lg border-2 border-indigo-100"
                      />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">
                        {getDisplayName(participant)}
                      </h4>
                      <p className="text-xs text-slate-500">
                        {getOrganizationDisplay(participant)}
                      </p>
                    </div>
                  </div>
                  <Badge
                    className={`${getStatusBadgeColor(participant.status)} text-white border-none rounded-lg px-2 py-1 text-xs`}
                  >
                    {getStatusDisplay(participant.status)}
                  </Badge>
                </div>

                {/* Info */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Badge
                      className={`${getPositionBadgeColor("athlete")} border-none rounded-md px-2 py-0.5 text-xs font-medium`}
                    >
                      កីឡាករ
                    </Badge>
                    <span className="text-slate-400">•</span>
                    <span className="font-medium">{participant.sport}</span>
                  </div>
                  {participant.gender && (
                    <p className="text-xs text-slate-500">
                      {getGenderDisplay(participant.gender)} •{" "}
                      {formatDateToDDMMYYYYKhmer(participant.dateOfBirth) ||
                        participant.dateOfBirth}
                    </p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2 border-t border-slate-100">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex-1 h-8 rounded-lg bg-slate-50 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedParticipant(participant);
                    }}
                  >
                    <Eye className="h-3.5 w-3.5 mr-1" />
                    មើល
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex-1 h-8 rounded-lg bg-slate-50 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditClick(participant);
                    }}
                  >
                    <Pencil className="h-3.5 w-3.5 mr-1" />
                    កែប្រែ
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 rounded-lg bg-slate-50 hover:bg-rose-50 hover:text-rose-600 transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(participant.id);
                    }}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </Card>
            ))}
            {filteredList.length === 0 && (
              <div className="col-span-full text-center py-12 text-muted-foreground">
                <Users className="h-12 w-12 mx-auto mb-3 text-slate-300" />
                <p className="font-medium">មិនមានអ្នកចូលរួមទេ</p>
                <p className="text-sm">សូមសាកល្បងកែសម្រួលតម្រង</p>
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Profile Dialog */}
      {selectedParticipant && (
        <Dialog
          open={!!selectedParticipant}
          onOpenChange={() => setSelectedParticipant(null)}
        >
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold">
                ព័ត៌មានអ្នកចូលរួម
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-6">
              {/* Profile Header */}
              <div className="flex items-start gap-6 p-6 bg-linear-to-br from-indigo-50 to-blue-50 rounded-xl">
                <div className="relative w-24 h-32 shrink-0">
                  <img
                    src={
                      selectedParticipant.photoUrl ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedParticipant.name)}&background=6366f1&color=fff&size=256`
                    }
                    alt={selectedParticipant.name}
                    className="w-full h-full object-cover rounded-xl border-4 border-white shadow-lg"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-slate-800 mb-3">
                    {getDisplayName(selectedParticipant)}
                  </h3>
                  <div className="flex items-center gap-2 mb-3">
                    <Badge
                      className={`${getPositionBadgeColor("athlete")} border-none rounded-lg px-3 py-1`}
                    >
                      កីឡាករ
                    </Badge>
                    <Badge
                      className={`${getStatusBadgeColor(selectedParticipant.status)} text-white border-none rounded-lg px-3 py-1`}
                    >
                      {getStatusDisplay(selectedParticipant.status)}
                    </Badge>
                  </div>
                  <p className="text-slate-600">{selectedParticipant.sport}</p>
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded-xl">
                  <div className="flex items-center gap-2 text-slate-500 mb-1">
                    <MapPin className="h-4 w-4" />
                    <span className="text-xs font-medium uppercase">
                      ខេត្ត/ក្រសួង
                    </span>
                  </div>
                  <p className="font-bold text-slate-800">
                    {getOrganizationDisplay(selectedParticipant)}
                  </p>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl">
                  <div className="flex items-center gap-2 text-slate-500 mb-1">
                    <Calendar className="h-4 w-4" />
                    <span className="text-xs font-medium uppercase">
                      ថ្ងៃខែឆ្នាំកំណើត
                    </span>
                  </div>
                  <p className="font-bold text-slate-800">
                    {formatDateToDDMMYYYYKhmer(
                      selectedParticipant.dateOfBirth,
                    ) || "មិនមាន"}
                  </p>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl">
                  <div className="flex items-center gap-2 text-slate-500 mb-1">
                    <Phone className="h-4 w-4" />
                    <span className="text-xs font-medium uppercase">
                      ទូរស័ព្ទ
                    </span>
                  </div>
                  <p className="font-bold text-slate-800">
                    {toKhmerDigits(selectedParticipant.phone) || "មិនមាន"}
                  </p>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl">
                  <div className="flex items-center gap-2 text-slate-500 mb-1">
                    <span className="text-xs font-medium uppercase">
                      លេខអត្តសញ្ញាណ
                    </span>
                  </div>
                  <p className="font-bold text-slate-800 text-sm">
                    {selectedParticipant.nationalID || "មិនមាន"}
                  </p>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl">
                  <div className="flex items-center gap-2 text-slate-500 mb-1">
                    <Users className="h-4 w-4" />
                    <span className="text-xs font-medium uppercase">ភេទ</span>
                  </div>
                  <p className="font-bold text-slate-800">
                    {getGenderDisplay(selectedParticipant.gender) || "មិនមាន"}
                  </p>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl">
                  <div className="flex items-center gap-2 text-slate-500 mb-1">
                    <Calendar className="h-4 w-4" />
                    <span className="text-xs font-medium uppercase">
                      កាលបរិច្ឆេទចុះឈ្មោះ
                    </span>
                  </div>
                  <p className="font-bold text-slate-800 text-sm">
                    {formatDateToDDMMYYYYKhmer(
                      selectedParticipant.registeredAt,
                    ) || "មិនមាន"}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t">
                <Button
                  className="flex-1 bg-linear-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700"
                  onClick={() => {
                    handleEditClick(selectedParticipant);
                    setSelectedParticipant(null);
                  }}
                >
                  <Pencil className="h-4 w-4 mr-2" />
                  កែប្រែគូលមេរី
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => {
                    handleDelete(selectedParticipant.id);
                  }}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  លុប
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Edit Dialog */}
      <ParticipantEditDialog
        participant={editingParticipant}
        open={isEditDialogOpen}
        onClose={() => {
          setIsEditDialogOpen(false);
          setEditingParticipant(null);
        }}
        onSave={handleSaveEdit}
      />
    </div>
  );
}

export default ParticipantsSection;
