"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import type { OrganizationInfo } from "@/src/types/participation";
import type { FormErrors } from "@/src/types/registration";
import { SelectableCard } from "@/src/components/ui/selectTableCard";
import { FormError, SectionTitle } from "@/src/components/ui/formElements";
import { Grid } from "@/src/shared/utils/patterns";
import { useMounted } from "@/src/lib/hooks";
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

  useEffect(() => {
    if (selectedOrganization?.id && selectedOrganization.id !== selectedId) {
      setSelectedId(selectedOrganization.id);
    }
  }, [selectedOrganization?.id, selectedId]);

  useEffect(() => {
    const fetchOrganizations = async () => {
      try {
        const response = await fetch(API_ENDPOINTS.organizations);
        const data = await response.json();

        if (!mounted.current) return;

        const arr: OrganizationItem[] = Array.isArray(data) ? data : [];
        setOrganizations(arr);
        setError(null);

        if (selectedOrganization) {
          const match = arr.find((o) => {
            if (
              String(selectedOrganization.type).toLowerCase() === "ministry"
            ) {
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
        }
      } catch {
        if (mounted.current) setError("មិនអាចផ្ទុកខេត្ដបាន");
      } finally {
        if (mounted.current) setLoading(false);
      }
    };

    fetchOrganizations();
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

      // Small delay to ensure state updates propagate
      await new Promise((resolve) => setTimeout(resolve, 0));

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

  return (
    <div className="space-y-6">
      <SectionTitle subtitle="សូមជ្រើសរើសក្រសួង ឬ ខេត្តរបស់អ្នក">
        តំណាង
      </SectionTitle>
      <div className="space-y-4">
        {loading ? (
          <div className="text-sm text-muted-foreground text-center">
            កំពុងផ្ទុកទិន្នន័យ...
          </div>
        ) : error ? (
          <FormError message={error} className="text-center" />
        ) : (
          <Grid cols={4} className="mt-2">
            {[...ministries, ...provinces].map((p) => (
              <SelectableCard
                key={p.id}
                title={p.khmerName ?? p.name}
                selected={selectedId === p.id}
                onSelect={() => handleSelect(p.id)}
                className="items-center justify-center p-6 text-center"
              />
            ))}
          </Grid>
        )}
      </div>
      <FormError message={organizationError} />
    </div>
  );
}
