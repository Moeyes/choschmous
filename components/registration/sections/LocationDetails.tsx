import { useEffect, useState } from "react";
import type { OrganizationInfo } from "@/types/participation";

import type { FormErrors } from "@/types/registration";
import { SelectableCard } from '@/components/ui/selectTableCard';

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
  const [tempOrg, setTempOrg] = useState<OrganizationInfo | undefined>(
    selectedOrganization
  );

  const [selectedId, setSelectedId] = useState<string | undefined>(selectedOrganization?.id ?? undefined);
  const [organizations, setOrganizations] = useState<{
    id: string;
    type: 'province' | 'ministry' | string;
    name: string;
    khmerName?: string;
  }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setTempOrg(selectedOrganization);
    if (selectedOrganization?.id) setSelectedId(selectedOrganization.id);
  }, [selectedOrganization]);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    fetch('/api/organizations')
      .then((r) => r.json())
      .then((data) => {
        if (!mounted) return;
        const arr = Array.isArray(data) ? data : [];
        setOrganizations(arr);
        setError(null);

        // If parent provided organization info, try to resolve an id
        if (selectedOrganization) {
          const match = arr.find((o: any) => {
            if (String(selectedOrganization.type).toLowerCase() === 'ministry') return o.type === 'ministry' && (o.name === selectedOrganization.department || o.id === selectedOrganization.id);
            return o.type === 'province' && (o.name === selectedOrganization.province || o.id === selectedOrganization.id);
          });
          if (match) setSelectedId(match.id);
        }
      })
      .catch((err) => {
        console.error("Failed to load provinces", err);
        if (mounted) setError("មិនអាចផ្ទុកខេត្ដបាន");
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, [selectedOrganization]);

  const handleChange = (id: string) => {
    if (id === '__loading' || id === '__error') return;
    setSelectedId(id);
    const sel = organizations.find((o) => o.id === id);
    if (!sel) return;

    if (String(sel.type).toLowerCase() === 'ministry') {
      setTempOrg({ type: 'ministry', department: sel.name, id: sel.id, name: sel.name } as any);
    } else {
      setTempOrg({ type: 'province', province: sel.name, id: sel.id, name: sel.name } as any);
    }
  };

  const handleSelect = (id: string) => {
    // select locally
    handleChange(id);
    // then advance by notifying parent
    const sel = organizations.find((o) => o.id === id);
    if (!sel) return;

    if (String(sel.type).toLowerCase() === 'province') {
      onSelect({ type: 'province', province: sel.name, id: sel.id, name: sel.name } as any);
    } else {
      onSelect({ type: 'ministry', department: sel.name, id: sel.id, name: sel.name } as any);
    }
  };

  const ministries = organizations.filter((o) => String(o.type).toLowerCase() === 'ministry');
  const orgs = organizations.filter((o) => String(o.type).toLowerCase() === 'province');

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-center">តំណាង</h2>
      <div className="space-y-4">
        <div>
          <div className="text-center text-xl text-muted-foreground">សូមជ្រើសរើសក្រសួង ឬ ខេត្តរបស់អ្នក</div>
          {loading ? (
            <div className="text-sm text-muted-foreground">កំពុងផ្ទុកទិន្នន័យ...</div>
          ) : error ? (
            <div className="text-sm text-red-600">{error}</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-2">
              {[...ministries, ...orgs].map((p) => (
                <SelectableCard
                  key={p.id}
                  title={p.khmerName ?? p.name}
                  subtitle={<span className="text-xs text-muted-foreground">{p.name}</span>}
                  selected={selectedId === p.id}
                  onSelect={() => handleSelect(p.id)}
                  className="items-center justify-center p-6 text-center"
                />
              ))}
            </div>
          )}
        </div>
      </div>
      {(errors?.province || (errors as any)?.organization) && (
        <p className="text-sm text-red-600 mt-1">{errors?.province ?? (errors as any)?.organization}</p>
      )}
    </div>
  );
}
