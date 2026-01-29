import { Suspense } from "react"
import { DashboardLayoutWrapper } from "./layout-wrapper"

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardLayoutWrapper>
      <Suspense fallback={<div className="p-8">កំពុងផ្ទុកទិន្នន័យ...</div>}>
        {children}
      </Suspense>
    </DashboardLayoutWrapper>
  )
}
