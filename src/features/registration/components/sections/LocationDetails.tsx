"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import type { OrganizationInfo } from "@/src/types/participation";
import type { FormErrors } from "@/src/types/registration";
import { useMounted } from "@/src/lib/hooks";
import { Skeleton } from "@/src/components/ui/skeleton";
// import { RegistrationSidebar, SelectionPill, ContentHeader } from "../shared";
import { SelectionPill, ContentHeader, SectionCard } from "../shared";
import {
  API_ENDPOINTS,
  REGISTRATION_STEP_PARAMS,
} from "@/src/config/constants";

interface OrganizationItem {
  id: string;
  type: "province" | "ministry" | string;
  name: string;
  khmerName?: string;
}

interface LocationDetailsProps {
  selectedOrganization?: OrganizationInfo;
  onSelect?: (organization: OrganizationInfo) => void;
  errors?: Partial<FormErrors>;
}

// Simple cache to prevent repeated organization fetches (e.g., strict mode double-render)
const organizationsCache: {
  data?: OrganizationItem[];
  promise?: Promise<OrganizationItem[]>;
} = {};

export function LocationDetails({
  selectedOrganization: propOrganization,
  onSelect,
  errors,
}: LocationDetailsProps) {
  const router = useRouter();
  const mounted = useMounted();

  // Get selected organization from props or session storage
  const storedOrg =
    typeof window !== "undefined"
      ? sessionStorage.getItem("selectedOrganization")
      : null;
  const selectedOrganization =
    propOrganization || (storedOrg ? JSON.parse(storedOrg) : undefined);

  const [selectedId, setSelectedId] = useState<string | undefined>(
    () => selectedOrganization?.id,
  );
  const [organizations, setOrganizations] = useState<OrganizationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load context from session storage
  const selectedEvent =
    typeof window !== "undefined"
      ? sessionStorage.getItem("selectedEventId")
      : null;
  const selectedSport =
    typeof window !== "undefined"
      ? sessionStorage.getItem("selectedSport")
      : null;
  const selectedCategory =
    typeof window !== "undefined"
      ? sessionStorage.getItem("selectedCategory")
      : null;

  useEffect(() => {
    if (selectedOrganization?.id && selectedOrganization.id !== selectedId) {
      setSelectedId(selectedOrganization.id);
    }
  }, [selectedOrganization?.id, selectedId]);

  useEffect(() => {
    let cancelled = false;

    const syncSelected = (arr: OrganizationItem[]) => {
      if (!selectedOrganization) return;
      const match = arr.find((o) => {
        if (String(selectedOrganization.type).toLowerCase() === "ministry") {
          return (
            o.type === "ministry" &&
            (o.name === selectedOrganization.name ||
              o.id === selectedOrganization.id)
          );
        }
        return (
          o.type === "province" &&
          (o.name === selectedOrganization.name ||
            o.id === selectedOrganization.id)
        );
      });
      if (match) setSelectedId(match.id);
    };

    const loadOrganizations = async () => {
      setLoading(true);

      if (organizationsCache.data) {
        if (!cancelled && mounted.current) {
          setOrganizations(organizationsCache.data);
          syncSelected(organizationsCache.data);
          setLoading(false);
        }
        return;
      }

      const promise =
        organizationsCache.promise ||
        fetch(API_ENDPOINTS.organizations)
          .then((res) => (res.ok ? res.json() : []))
          .then((data) =>
            Array.isArray(data) ? data : ([] as OrganizationItem[]),
          )
          .then((arr: OrganizationItem[]) => {
            organizationsCache.data = arr;
            organizationsCache.promise = undefined;
            return arr;
          })
          .catch(() => {
            organizationsCache.promise = undefined;
            throw new Error("org fetch failed");
          });

      organizationsCache.promise = promise;

      try {
        const arr = await promise;
        if (!cancelled && mounted.current) {
          setOrganizations(arr);
          syncSelected(arr);
          setError(null);
        }
      } catch {
        if (!cancelled && mounted.current) setError("មិនអាចផ្ទុកខេត្ដបាន");
      } finally {
        if (!cancelled && mounted.current) setLoading(false);
      }
    };

    loadOrganizations();

    return () => {
      cancelled = true;
    };
  }, [selectedOrganization, mounted]);

  const handleSelect = useCallback(
    async (id: string) => {
      const sel = organizations.find((o) => o.id === id);
      if (!sel) return;

      setSelectedId(id);

      const orgInfo: OrganizationInfo = {
        type:
          String(sel.type).toLowerCase() === "province"
            ? "province"
            : "ministry",
        id: sel.id,
        name: sel.khmerName ?? sel.name,
      };

      // Store selected organization
      sessionStorage.setItem("selectedOrganization", JSON.stringify(orgInfo));

      // Call callback if provided
      if (onSelect) {
        onSelect(orgInfo);
      }

      // Small delay for visual feedback
      await new Promise((resolve) => setTimeout(resolve, 300));

      // Navigate to personal info step
      router.push(`/register?step=${REGISTRATION_STEP_PARAMS.personal}`);
    },
    [organizations, onSelect, router],
  );

  const ministries = organizations.filter(
    (o) => String(o.type).toLowerCase() === "ministry",
  );
  const provinces = organizations.filter(
    (o) => String(o.type).toLowerCase() === "province",
  );
  const organizationError = errors?.organization;

  if (loading) {
    return (
      <div className="reg-split-layout">
        <Skeleton className="w-64 rounded-xl" />
        <div className="flex-1 space-y-4">
          <Skeleton className="h-12 w-48" />
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="h-12 rounded-full" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="reg-split-layout">
      {/* <RegistrationSidebar
        sections={[
          { label: "ព្រឹត្តិការណ៍", value: selectedEvent, color: "indigo" },
          { label: "កីឡា", value: selectedSport, color: "purple" },
          { label: "ប្រភេទ", value: selectedCategory, color: "pink" },
        ]}
      /> */}

      <div className="reg-content">
        <ContentHeader
          title="ជ្រើសរើសស្ថាប័ន"
          subtitle="ជ្រើសរើសក្រសួង ឬ ខេត្តរបស់អ្នក"
        />
        <SectionCard
          title="ជ្រើសរើសស្ថាប័ន"
          subtitle="ជ្រើសក្រសួង ឬ ខេត្តពីបញ្ជីខាងក្រោម"
        >
          {error ? (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {error}
            </div>
          ) : organizationError ? (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {organizationError}
            </div>
          ) : null}

          {ministries.length > 0 && (
            <div className="mb-8">
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-700">
                ក្រសួង
              </h3>
              <div className="flex flex-wrap gap-3">
                {ministries.map((org) => (
                  <SelectionPill
                    key={org.id}
                    label={org.khmerName ?? org.name}
                    isSelected={selectedId === org.id}
                    onClick={() => handleSelect(org.id)}
                    variant="emerald"
                    size="sm"
                  />
                ))}
              </div>
            </div>
          )}

          {provinces.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-700">
                ខេត្ត
              </h3>
              <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
                {provinces.map((org) => (
                  <SelectionPill
                    key={org.id}
                    label={org.khmerName ?? org.name}
                    isSelected={selectedId === org.id}
                    onClick={() => handleSelect(org.id)}
                    variant="emerald"
                    size="sm"
                  />
                ))}
              </div>
            </div>
          )}

          {organizations.length === 0 && !error && (
            <div className="py-10 text-center text-slate-500">
              <p>មិនមានស្ថាប័នទេ</p>
            </div>
          )}
        </SectionCard>
      </div>
    </div>
  );
}
