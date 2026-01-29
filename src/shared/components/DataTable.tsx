"use client"

import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { StyledCard } from '@/src/shared/utils/patterns'
import { cn } from "@/src/lib/utils"

interface Column<T> {
  key: string
  header: string
  className?: string
  render?: (item: T) => React.ReactNode
}

interface DataTableProps<T> {
  columns: Column<T>[]
  data: T[]
  renderRow: (item: T, index: number) => React.ReactNode
  className?: string
  emptyState?: React.ReactNode
}

export function DataTable<T>({ 
  columns, 
  data, 
  renderRow,
  className,
  emptyState 
}: DataTableProps<T>) {
  if (data.length === 0 && emptyState) return <>{emptyState}</>

  return (
    <StyledCard className={className} noPadding>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50/50 hover:bg-slate-50/50">
              {columns.map((column) => (
                <TableHead 
                  key={column.key} 
                  className={cn(
                    "font-bold text-[10px] uppercase text-slate-400",
                    column.className
                  )}
                >
                  {column.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item, index) => renderRow(item, index))}
          </TableBody>
        </Table>
      </div>
    </StyledCard>
  )
}

export default DataTable
