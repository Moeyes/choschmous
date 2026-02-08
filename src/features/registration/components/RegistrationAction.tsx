/**
 * RegistrationAction - Step 7
 * Shows success message, displays all user's registrations, and allows adding more participants
 */

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  CheckCircle2,
  UserPlus,
  Home,
  Users,
  Loader2,
  Edit2,
  Medal,
  Building2,
  CalendarRange,
  Trophy,
  Hash,
} from "lucide-react";
import { Button } from "@/src/components/ui/button";
import {
  API_ENDPOINTS,
  REGISTRATION_STEP_PARAMS,
} from "@/src/config/constants";
import { SectionTitle } from "@/src/components/ui/formElements";
import { StyledCard } from "@/src/shared/utils/patterns";
import { useUserSession } from "@/src/hooks/useUserSession";
import { useMounted } from "@/src/lib/hooks";
import { toKhmerDigits, formatDateToKhmerLabeled } from "@/src/lib/khmer";
import type { FormData as RegistrationFormData } from "@/src/types/registration";

interface RegisteredParticipant {
  id: string;
  name?: string;
  eventId?: string;
  eventName?: string;
  sport?: string;
  sportId?: string;
  category?: string;
  sportCategory?: string;
  organization?:
    | {
        id?: string;
        name?: string;
        province?: string;
        type?: string;
      }
    | string
    | null;
  registeredAt?: string;
}

interface ApiRegistration {
  id: string;
  fullNameKhmer?: string;
  fullNameEnglish?: string;
  sport?: string;
  sportId?: string;
  sportCategory?: string;
  category?: string;
  position?: {
    role?: string;
    athleteCategory?: string;
    leaderRole?: string;
  };
  organization?: {
    id?: string;
    name?: string;
    province?: string;
    type?: string;
  } | null;
  eventId?: string;
  registeredAt?: string;
}

interface EventRecord {
  id: string;
  name?: string;
  sports?: {
    id?: string;
    name?: string;
    categories?: string[];
  }[];
}

interface DisplayRegistration {
  id: string;
  name: string;
  event: string;
  sport: string;
  category: string;
  organization: string;
  registeredAt?: string;
}

interface RegistrationActionProps {
  formData: Partial<RegistrationFormData>;
  eventId?: string;
  registrationId?: string;
  registeredParticipants?: RegisteredParticipant[];
  onAddMore?: () => void;
  onEditParticipant?: (participantId: string) => void;
}

// Simple in-memory caches to avoid repeated network calls (e.g., React 18 strict mode double-mount)
const eventsCache: {
  data?: EventRecord[];
  promise?: Promise<EventRecord[]>;
} = {};

const registrationCache = new Map<
  number,
  { data?: DisplayRegistration[]; promise?: Promise<DisplayRegistration[]> }
>();

async function loadEvents(): Promise<EventRecord[]> {
  if (eventsCache.data) return eventsCache.data;
  if (eventsCache.promise) return eventsCache.promise;

  eventsCache.promise = fetch(API_ENDPOINTS.events)
    .then((res) => (res.ok ? res.json() : []))
    .then((data: EventRecord[]) => {
      eventsCache.data = data;
      eventsCache.promise = undefined;
      return data;
    })
    .catch(() => {
      eventsCache.promise = undefined;
      return [] as EventRecord[];
    });

  return eventsCache.promise;
}

const toEventLookup = (events: EventRecord[]) =>
  new Map(events.map((event) => [event.id, event]));

const getOrganizationDisplay = (
  reg: Partial<ApiRegistration & RegisteredParticipant>,
) => {
  const orgField = reg.organization;
  if (typeof orgField === "string") return orgField || "—";
  const org = orgField ?? undefined;

  return org?.name || org?.province || (reg as any).province || "—";
};

const getSportName = (
  reg: Partial<ApiRegistration & RegisteredParticipant>,
  event: EventRecord | undefined,
) => {
  const direct = reg.sport || (reg as RegisteredParticipant).sport;
  if (direct) return direct;
  const sportId = reg.sportId || (reg as RegisteredParticipant).sportId;
  if (!event || !sportId) return sportId || "—";
  const found = event.sports?.find((s) => s.id === sportId);
  return found?.name || sportId || "—";
};

const formatRegistration = (
  reg: ApiRegistration | RegisteredParticipant,
  eventLookup: Map<string, EventRecord>,
): DisplayRegistration => {
  const eventId = (reg as ApiRegistration).eventId || reg.eventId || "";
  const event = eventLookup.get(eventId);
  const apiReg = reg as ApiRegistration;
  const participantReg = reg as RegisteredParticipant;
  const name =
    apiReg.fullNameKhmer ||
    apiReg.fullNameEnglish ||
    participantReg.name ||
    "អ្នកចូលរួម";

  const category =
    apiReg.category ||
    apiReg.sportCategory ||
    participantReg.category ||
    participantReg.sportCategory ||
    "—";

  return {
    id: reg.id,
    name,
    event: event?.name || participantReg.eventName || "—",
    sport: getSportName(reg, event),
    category,
    organization: getOrganizationDisplay(reg),
    registeredAt: reg.registeredAt,
  };
};

export function RegistrationAction({
  formData,
  registrationId: propRegistrationId,
  registeredParticipants = [],
  onAddMore,
  onEditParticipant,
}: RegistrationActionProps) {
  const router = useRouter();
  const { session } = useUserSession();
  const mounted = useMounted();

  // Get registrationId from props or session storage
  const registrationId =
    propRegistrationId || sessionStorage.getItem("registrationId") || undefined;

  const [allRegistrations, setAllRegistrations] = useState<
    DisplayRegistration[]
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const fallbackToLocal = () => {
      if (!mounted.current) return;
      setAllRegistrations(
        registeredParticipants.map((reg) => formatRegistration(reg, new Map())),
      );
      setLoading(false);
    };

    const load = async () => {
      // No session: show locally submitted participants only
      if (!session?.userId) {
        fallbackToLocal();
        return;
      }

      const userId = session.userId;
      const cached = registrationCache.get(userId);

      if (cached?.data) {
        setAllRegistrations(cached.data);
        setLoading(false);
        return;
      }

      setLoading(true);

      const registrationsPromise =
        cached?.promise ??
        Promise.all([
          loadEvents(),
          fetch(`${API_ENDPOINTS.registrations}?userId=${userId}`).then(
            (res) => {
              if (!res.ok) throw new Error("registrations failed");
              return res.json();
            },
          ),
        ])
          .then(([eventsData, registrationsData]) => {
            const eventLookup = toEventLookup(eventsData as EventRecord[]);
            const registrations: ApiRegistration[] =
              registrationsData.registrations || [];
            return registrations.map((reg) =>
              formatRegistration(reg, eventLookup),
            );
          })
          .then((formatted) => {
            registrationCache.set(userId, { data: formatted });
            return formatted;
          })
          .catch((err) => {
            registrationCache.delete(userId);
            throw err;
          });

      if (!cached?.promise) {
        registrationCache.set(userId, { promise: registrationsPromise });
      }

      try {
        const formatted = await registrationsPromise;
        if (!cancelled && mounted.current) {
          setAllRegistrations(formatted);
        }
      } catch {
        if (!cancelled) fallbackToLocal();
        return;
      } finally {
        if (!cancelled && mounted.current) setLoading(false);
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [session?.userId, registeredParticipants, mounted]);

  const currentName =
    formData.fullNameKhmer || formData.fullNameEnglish || "អ្នកចូលរួម";

  const highlight = allRegistrations[0];

  const handleAddMore = () => {
    if (onAddMore) {
      onAddMore();
    } else {
      // Clear form data and restart from event selection
      sessionStorage.removeItem("selectedEventId");
      sessionStorage.removeItem("selectedSport");
      sessionStorage.removeItem("selectedCategory");
      sessionStorage.removeItem("selectedOrganization");
      sessionStorage.removeItem("registrationId");
      router.push(`/register?step=${REGISTRATION_STEP_PARAMS.event}`);
    }
  };

  const handleGoHome = () => {
    router.push("/");
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto px-2 sm:px-4">
      <div className="text-center space-y-4 py-6">
        <CheckCircle2 className="h-20 w-20 text-green-500 mx-auto" />
        <h2 className="text-3xl font-bold text-green-700">
          បានចុះឈ្មោះដោយជោគជ័យ!
        </h2>
        <p className="text-muted-foreground">
          <span className="font-semibold">{currentName}</span>{" "}
          បានចុះឈ្មោះរួចរាល់សម្រាប់ {formData.sport}។
        </p>
        {registrationId && (
          <p className="text-sm text-muted-foreground">
            លេខសម្គាល់ការចុះឈ្មោះ:{" "}
            <span className="font-mono">{toKhmerDigits(registrationId)}</span>
          </p>
        )}
      </div>

      <StyledCard>
        <div className="flex items-center gap-2 mb-4">
          <Users className="h-5 w-5 text-muted-foreground" />
          <span className="font-semibold text-slate-800">
            អ្នកចូលរួមដែលបានចុះឈ្មោះ (
            {loading ? "..." : toKhmerDigits(allRegistrations.length)})
          </span>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-6">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            <span className="ml-2 text-sm text-muted-foreground">
              កំពុងផ្ទុក...
            </span>
          </div>
        ) : allRegistrations.length === 0 ? (
          <p className="text-center text-muted-foreground py-4">
            មិនមានអ្នកចូលរួមដែលបានចុះឈ្មោះទេ។
          </p>
        ) : (
          <div className="space-y-4">
            {highlight && (
              <div className="rounded-2xl border border-emerald-100 bg-emerald-50/60 p-4 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                    <Trophy className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wide text-emerald-700 font-semibold">
                      ការចុះឈ្មោះថ្មីបំផុត
                    </p>
                    <p className="text-lg font-semibold text-slate-900">
                      {highlight.name}
                    </p>
                    <p className="text-sm text-slate-600 flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center gap-1 rounded-full bg-white/80 px-2 py-1 text-[11px] font-medium text-slate-700 border border-emerald-100">
                        <CalendarRange className="h-3.5 w-3.5" />
                        {highlight.registeredAt
                          ? formatDateToKhmerLabeled(highlight.registeredAt)
                          : "ថ្មី"}
                      </span>
                      <span className="inline-flex items-center gap-1 rounded-full bg-white/80 px-2 py-1 text-[11px] font-medium text-slate-700 border border-emerald-100">
                        <Medal className="h-3.5 w-3.5" />
                        {highlight.sport}
                      </span>
                      <span className="inline-flex items-center gap-1 rounded-full bg-white/80 px-2 py-1 text-[11px] font-medium text-slate-700 border border-emerald-100">
                        <Hash className="h-3.5 w-3.5" />
                        {highlight.category}
                      </span>
                      <span className="inline-flex items-center gap-1 rounded-full bg-white/80 px-2 py-1 text-[11px] font-medium text-slate-700 border border-emerald-100">
                        <Building2 className="h-3.5 w-3.5" />
                        {highlight.organization}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-linear-to-b from-white to-slate-50 shadow-sm">
              <div
                className={`grid items-center gap-4 px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500 ${onEditParticipant ? "grid-cols-[1.8fr_1.2fr_1.2fr_1.2fr_1.3fr_auto]" : "grid-cols-[1.8fr_1.2fr_1.2fr_1.2fr_1.3fr]"}`}
              >
                <span>ឈ្មោះ</span>
                <span>ព្រឹត្តិការណ៍</span>
                <span>កីឡា</span>
                <span>ប្រភេទ</span>
                <span>អង្គភាព/ខេត្ត</span>
                {onEditParticipant && (
                  <span className="text-right">សកម្មភាព</span>
                )}
              </div>

              <div className="divide-y divide-slate-200 bg-white/60">
                {allRegistrations.map((participant, idx) => (
                  <div
                    key={participant.id}
                    className={`grid items-center gap-4 px-5 py-4 text-sm ${onEditParticipant ? "grid-cols-[1.8fr_1.2fr_1.2fr_1.2fr_1.3fr_auto]" : "grid-cols-[1.8fr_1.2fr_1.2fr_1.2fr_1.3fr]"}`}
                  >
                    <div className="flex items-start gap-3">
                      <span className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-[11px] font-semibold text-primary shadow-inner">
                        {toKhmerDigits(idx + 1)}
                      </span>
                      <div className="space-y-0.5">
                        <div className="font-semibold text-slate-900">
                          {participant.name}
                        </div>
                        <div className="text-[11px] text-muted-foreground flex items-center gap-2">
                          <CalendarRange className="h-3.5 w-3.5" />
                          {participant.registeredAt
                            ? formatDateToKhmerLabeled(participant.registeredAt)
                            : "—"}
                        </div>
                      </div>
                    </div>

                    <div className="text-slate-900">{participant.event}</div>
                    <div className="text-slate-900">{participant.sport}</div>
                    <div className="text-slate-900">{participant.category}</div>
                    <div className="text-slate-900">
                      {participant.organization}
                    </div>

                    {onEditParticipant && (
                      <div className="flex justify-end">
                        <button
                          type="button"
                          onClick={() => onEditParticipant(participant.id)}
                          className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-blue-600 hover:bg-blue-50"
                          aria-label={`កែសម្រួល ${participant.name}`}
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                          កែសម្រួល
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </StyledCard>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 text-center space-y-4">
        <SectionTitle subtitle="បន្ថែមអ្នកចូលរួមបន្ថែមទៀតក្រោមគណនីរបស់អ្នក">
          ចង់ចុះឈ្មោះអ្នកផ្សេងទៀតទេ?
        </SectionTitle>
        <p className="text-sm text-muted-foreground">
          អ្នកអាចចុះឈ្មោះអ្នកចូលរួមបន្ថែមសម្រាប់ព្រឹត្តិការណ៍តែមួយ ឬ កីឡាផ្សេងៗ។
        </p>
        <Button
          onClick={handleAddMore}
          className="bg-blue-600 hover:bg-blue-700 text-white"
          size="lg"
        >
          <UserPlus className="h-5 w-5 mr-2" />
          ចុះឈ្មោះអ្នកចូលរួមបន្ថែម
        </Button>
      </div>

      <div className="flex justify-center pt-4">
        <Button
          variant="outline"
          size="lg"
          onClick={handleGoHome}
          className="min-w-50"
        >
          <Home className="h-4 w-4 mr-2" />
          បញ្ចប់ និង ទៅទំព័រដើម
        </Button>
      </div>
    </div>
  );
}
