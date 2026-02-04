"use client"

import { Card } from "@/components/ui/card"
import { Download, Plus, Calendar, Users } from "lucide-react"

type QuickAction = {
  title: string
  description: string
  icon: React.ReactNode
  color: string
  shadowColor: string
  onClick?: () => void
}

const defaultActions: QuickAction[] = [
  {
    title: "Export Data",
    description: "Download reports in CSV format",
    icon: <Download className="h-5 w-5" />,
    color: "bg-[#10b981]",
    shadowColor: "shadow-emerald-100",
  },
]

export function QuickActions({ actions = defaultActions }: { actions?: QuickAction[] }) {
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-slate-800">Quick Actions</h3>
      {actions.map((action, index) => (
        <Card
          key={index}
          onClick={action.onClick}
          className={`${action.color} border-none shadow-lg ${action.shadowColor} rounded-3xl p-6 text-white overflow-hidden relative group cursor-pointer`}
        >
          <div className="relative z-10 flex flex-col gap-1">
            <p className="text-lg font-bold">{action.title}</p>
            <p className="text-white/80 text-xs">{action.description}</p>
          </div>
          <div className="absolute top-1/2 -translate-y-1/2 right-6 bg-white/20 p-3 rounded-xl backdrop-blur-sm group-hover:scale-110 transition-transform">
            {action.icon}
          </div>
        </Card>
      ))}
    </div>
  )
}

export default QuickActions
