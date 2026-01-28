/**
 * RegistrationAction - Step 7
 * Shows success message, displays all user's registrations, and allows adding more participants
 */

import { useState, useEffect, useCallback } from "react";
import { CheckCircle2, UserPlus, Home, Users, Loader2, Edit2 } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Card, CardContent } from "@/src/components/ui/card";
import { useLocation } from "wouter";
import { SectionTitle } from "@/src/components/ui/formElements";
import { useUserSession } from "@/src/hooks/useUserSession";
import type { FormData as RegistrationFormData } from "@/src/types/registration";
import { toKhmerDigits, formatDateToDDMMYYYYKhmer } from "@/src/lib/khmer";

interface RegisteredParticipant {
  id: string;
  name: string;
  sport: string;
  role: string;
  registeredAt?: string;
}

interface ApiRegistration {
  id: string;
  firstNameKh?: string;
  lastNameKh?: string;
  firstName?: string;
  lastName?: string;
  sport?: string;
  position?: {
    role?: string;
    athleteCategory?: string;
    leaderRole?: string;
  };
  registeredAt?: string;
}

interface RegistrationActionProps {
  formData: RegistrationFormData;
  eventId: string;
  registrationId?: string;
  registeredParticipants?: RegisteredParticipant[];
  onAddMore: () => void;
  onEditParticipant?: (participantId: string) => void;
}

function formatRegistration(reg: ApiRegistration): RegisteredParticipant {
  const name = `${reg.firstNameKh ?? ""} ${reg.lastNameKh ?? ""}`.trim() ||
               `${reg.firstName ?? ""} ${reg.lastName ?? ""}`.trim() ||
               "អ្នកចូលរួម";

  let role = "អ្នកចូលរួម";
  if (reg.position?.role === "Athlete") {
    role = reg.position.athleteCategory === "Male" ? "កីឡាករ" : "កីឡាការិនី";
  } else if (reg.position?.leaderRole) {
    const leaderRoles: Record<string, string> = {
      coach: "ថ្នាក់ដឹកនាំ",
      manager: "គណកម្មការបច្ចេកទេស",
      delegate: "ប្រតិភូ",
      team_lead: "អ្នកដឹកនាំក្រុម",
      coach_trainer: "គ្រូបង្វឹក",
    };
    role = leaderRoles[reg.position.leaderRole] ?? reg.position.leaderRole;
  }

  return {
    id: reg.id,
    name,
    sport: reg.sport || "—",
    role,
    registeredAt: reg.registeredAt,
  };
}

export function RegistrationAction({
  formData,
  registrationId,
  registeredParticipants = [],
  onAddMore,
  onEditParticipant,
}: RegistrationActionProps) {
  const [, setLocation] = useLocation();
  const { session } = useUserSession();
  const [allRegistrations, setAllRegistrations] = useState<RegisteredParticipant[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch all user registrations from the API
  const fetchUserRegistrations = useCallback(async () => {
    if (!session?.userId) {
      setAllRegistrations(registeredParticipants);
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`/api/registrations?userId=${session.userId}`);
      if (res.ok) {
        const data = await res.json();
        const registrations: ApiRegistration[] = data.registrations || [];
        setAllRegistrations(registrations.map(formatRegistration));
      } else {
        // Fallback to passed participants
        setAllRegistrations(registeredParticipants);
      }
    } catch {
      setAllRegistrations(registeredParticipants);
    } finally {
      setLoading(false);
    }
  }, [session?.userId, registeredParticipants]);

  useEffect(() => {
    fetchUserRegistrations();
  }, [fetchUserRegistrations]);

  const currentName = `${formData.firstNameKh ?? ""} ${formData.lastNameKh ?? ""}`.trim() || 
                      `${formData.firstName ?? ""} ${formData.lastName ?? ""}`.trim() || 
                      "អ្នកចូលរួម";

  return (
    <div className="space-y-6 max-w-lg mx-auto">
      {/* Success Message */}
      <div className="text-center space-y-4 py-6">
        <CheckCircle2 className="h-20 w-20 text-green-500 mx-auto" />
        <h2 className="text-3xl font-bold text-green-700">បានចុះឈ្មោះដោយជោគជ័យ!</h2>
        <p className="text-muted-foreground">
          <span className="font-semibold">{currentName}</span> បានចុះឈ្មោះរួចរាល់សម្រាប់ {formData.sport}។
        </p>
        {registrationId && (
          <p className="text-sm text-muted-foreground">
            លេខសម្គាល់ការចុះឈ្មោះ: <span className="font-mono">{toKhmerDigits(registrationId)}</span>
          </p>
        )}
      </div>

      {/* Registered Participants Summary */}
      <Card>
        <CardContent className="pt-4">
          <div className="flex items-center gap-2 mb-3">
            <Users className="h-5 w-5 text-muted-foreground" />
            <span className="font-semibold">
              អ្នកចូលរួមដែលបានចុះឈ្មោះ ({loading ? "..." : toKhmerDigits(allRegistrations.length)})
            </span>
          </div>
          
          {loading ? (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              <span className="ml-2 text-sm text-muted-foreground">កំពុងផ្ទុក...</span>
            </div>
          ) : allRegistrations.length === 0 ? (
            <p className="text-center text-muted-foreground py-4">
              មិនមានអ្នកចូលរួមដែលបានចុះឈ្មោះទេ។
            </p>
          ) : (
            <div className="space-y-2">
              {allRegistrations.map((participant: RegisteredParticipant, idx: number) => (
                <div
                  key={participant.id}
                  className="flex justify-between items-center p-2 bg-slate-50 rounded-lg text-sm"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-medium">
                      {toKhmerDigits(idx + 1)}
                    </span>
                    <span className="font-medium">{participant.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex gap-2 text-muted-foreground text-xs">
                      <span>{participant.sport}</span>
                      <span>•</span>
                      <span>{participant.role}</span>
                    </div>
                    {participant.registeredAt && (
                      <div className="text-xs text-muted-foreground ml-4">
                        {formatDateToDDMMYYYYKhmer(participant.registeredAt)}
                      </div>
                    )}
                    {onEditParticipant && (
                      <button
                        type="button"
                        onClick={() => onEditParticipant(participant.id)}
                        className="text-blue-500 hover:text-blue-700 p-1"
                        aria-label={`កែសម្រួល ${participant.name}`}
                      >
                        <Edit2 className="h-3 w-3" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add More Section */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 text-center space-y-4">
        <SectionTitle subtitle="បន្ថែមអ្នកចូលរួមបន្ថែមទៀតក្រោមគណនីរបស់អ្នក">
          ចង់ចុះឈ្មោះអ្នកផ្សេងទៀតទេ?
        </SectionTitle>
        <p className="text-sm text-muted-foreground">
          អ្នកអាចចុះឈ្មោះអ្នកចូលរួមបន្ថែមសម្រាប់ព្រឹត្តិការណ៍តែមួយ ឬ កីឡាផ្សេងៗ។
        </p>
        <Button
          onClick={onAddMore}
          className="bg-blue-600 hover:bg-blue-700 text-white"
          size="lg"
        >
          <UserPlus className="h-5 w-5 mr-2" />
          ចុះឈ្មោះអ្នកចូលរួមបន្ថែម
        </Button>
      </div>

      {/* Finish Button */}
      <div className="flex justify-center pt-4">
        <Button
          variant="outline"
          size="lg"
          onClick={() => setLocation("/")}
          className="min-w-50"
        >
          <Home className="h-4 w-4 mr-2" />
          បញ្ចប់ និង ទៅទំព័រដើម
        </Button>
      </div>
    </div>
  );
}