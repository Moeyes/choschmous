import { useEffect, useState, useCallback } from "react";
import type { OrganizationInfo } from "@/src/types/participation";

import type { FormErrors } from "@/src/types/registration";
import { SelectableCard } from '@/src/components/ui/selectTableCard';
import { FormError, SectionTitle } from '@/src/components/ui/formElements';

interface OrganizationItem {
  id: string;
  type: 'province' | 'ministry' | string;
  name: string;
  khmerName?: string;
}

interface LocationDetailsProps {
  selectedOrganization?: OrganizationInfo;
  onSelect: (organization: OrganizationInfo) => void;
  errors?: Partial<FormErrors>;
}

export function LocationDetails({
  selectedOrganization,
  onSelect,
  errors,
}: LocationDetailsProps) {
  // Initialize state from props
  const [selectedId, setSelectedId] = useState<string | undefined>(
    () => selectedOrganization?.id ?? undefined
  );
  const [organizations, setOrganizations] = useState<OrganizationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Sync selectedId when selectedOrganization changes (controlled component)
  useEffect(() => {
    if (selectedOrganization?.id && selectedOrganization.id !== selectedId) {
      setSelectedId(selectedOrganization.id);
    }
  }, [selectedOrganization?.id, selectedId]);

  // Fetch organizations on mount
  useEffect(() => {
    let mounted = true;
    
    const fetchOrganizations = async () => {
      try {
        const response = await fetch('/api/organizations');
        const data = await response.json();
        
        if (!mounted) return;
        
        const arr: OrganizationItem[] = Array.isArray(data) ? data : [];
        setOrganizations(arr);
        setError(null);

        // If parent provided organization info, try to resolve an id
        if (selectedOrganization) {
          const match = arr.find((o) => {
            if (String(selectedOrganization.type).toLowerCase() === 'ministry') {
              return o.type === 'ministry' && (o.name === selectedOrganization.department || o.id === selectedOrganization.id);
            }
            return o.type === 'province' && (o.name === selectedOrganization.province || o.id === selectedOrganization.id);
          });
          if (match) setSelectedId(match.id);
        }
      } catch (err) {
        console.error("Failed to load provinces", err);
        if (mounted) setError("មិនអាចផ្ទុកខេត្ដបាន");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchOrganizations();
    
    return () => {
      mounted = false;
    };
  }, [selectedOrganization]);

  const handleSelect = useCallback((id: string) => {
    if (id === '__loading' || id === '__error') return;
    
    const sel = organizations.find((o) => o.id === id);
    if (!sel) return;

    setSelectedId(id);

    // Create properly typed organization info with khmerName for display
    const orgInfo: OrganizationInfo = String(sel.type).toLowerCase() === 'province'
      ? { type: 'province', province: sel.khmerName ?? sel.name, id: sel.id, name: sel.khmerName ?? sel.name }
      : { type: 'ministry', department: sel.khmerName ?? sel.name, id: sel.id, name: sel.khmerName ?? sel.name };
    
    onSelect(orgInfo);
  }, [organizations, onSelect]);

  const ministries = organizations.filter((o) => String(o.type).toLowerCase() === 'ministry');
  const provinces = organizations.filter((o) => String(o.type).toLowerCase() === 'province');

  // Check for organization error in FormErrors
  const organizationError = errors?.province || ('organization' in (errors ?? {}) ? (errors as Record<string, string>).organization : undefined);

  return (
    <div className="space-y-6">
      <SectionTitle subtitle="សូមជ្រើសរើសក្រសួង ឬ ខេត្តរបស់អ្នក">
        តំណាង
      </SectionTitle>
      <div className="space-y-4">
        <div>
          {loading ? (
            <div className="text-sm text-muted-foreground text-center">កំពុងផ្ទុកទិន្នន័យ...</div>
          ) : error ? (
            <FormError message={error} className="text-center" />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-2">
              {[...ministries, ...provinces].map((p) => (
                <SelectableCard
                  key={p.id}
                  title={p.khmerName ?? p.name}
                  selected={selectedId === p.id}
                  onSelect={() => handleSelect(p.id)}
                  className="items-center justify-center p-6 text-center"
                />
              ))}
            </div>
          )}
        </div>
      </div>
      <FormError message={organizationError} />
    </div>
  );
}
