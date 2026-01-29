import { useEffect, useState, useCallback } from "react"
import type { OrganizationInfo } from "@/src/types/participation"
import type { FormErrors } from "@/src/types/registration"
import { SelectableCard } from '@/src/components/ui/selectTableCard'
import { FormError, SectionTitle } from '@/src/components/ui/formElements'
import { Grid } from '@/src/shared/utils/patterns'
import { useMounted } from '@/src/lib/hooks'

interface OrganizationItem {
  id: string
  type: 'province' | 'ministry' | string
  name: string
  khmerName?: string
}

interface LocationDetailsProps {
  selectedOrganization?: OrganizationInfo
  onSelect: (organization: OrganizationInfo) => void
  errors?: Partial<FormErrors>
}

export function LocationDetails({
  selectedOrganization,
  onSelect,
  errors,
}: LocationDetailsProps) {
  const mounted = useMounted()
  const [selectedId, setSelectedId] = useState<string | undefined>(() => selectedOrganization?.id)
  const [organizations, setOrganizations] = useState<OrganizationItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (selectedOrganization?.id && selectedOrganization.id !== selectedId) {
      setSelectedId(selectedOrganization.id)
    }
  }, [selectedOrganization?.id, selectedId])

  useEffect(() => {
    const fetchOrganizations = async () => {
      try {
        const response = await fetch('/api/organizations')
        const data = await response.json()
        
        if (!mounted.current) return
        
        const arr: OrganizationItem[] = Array.isArray(data) ? data : []
        setOrganizations(arr)
        setError(null)

        if (selectedOrganization) {
          const match = arr.find((o) => {
            if (String(selectedOrganization.type).toLowerCase() === 'ministry') {
              return o.type === 'ministry' && (o.name === selectedOrganization.name || o.id === selectedOrganization.id)
            }
            return o.type === 'province' && (o.name === selectedOrganization.name || o.id === selectedOrganization.id)
          })
          if (match) setSelectedId(match.id)
        }
      } catch {
        if (mounted.current) setError("មិនអាចផ្ទុកខេត្ដបាន")
      } finally {
        if (mounted.current) setLoading(false)
      }
    }

    fetchOrganizations()
  }, [selectedOrganization, mounted])

  const handleSelect = useCallback((id: string) => {
    const sel = organizations.find((o) => o.id === id)
    if (!sel) return

    setSelectedId(id)

    const orgInfo: OrganizationInfo = {
      type: String(sel.type).toLowerCase() === 'province' ? 'province' : 'ministry',
      id: sel.id,
      name: sel.khmerName ?? sel.name
    }
    
    onSelect(orgInfo)
  }, [organizations, onSelect])

  const ministries = organizations.filter((o) => String(o.type).toLowerCase() === 'ministry')
  const provinces = organizations.filter((o) => String(o.type).toLowerCase() === 'province')
  const organizationError = errors?.organization

  return (
    <div className="space-y-6">
      <SectionTitle subtitle="សូមជ្រើសរើសក្រសួង ឬ ខេត្តរបស់អ្នក">
        តំណាង
      </SectionTitle>
      <div className="space-y-4">
        {loading ? (
          <div className="text-sm text-muted-foreground text-center">កំពុងផ្ទុកទិន្នន័យ...</div>
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
  )
}
