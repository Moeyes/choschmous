"use client";

import { RegistrationTopBar } from "@/src/features/registration/components/layout/RegistrationTopBar";
import { RegistrationSidebar } from "@/src/features/registration/components/layout/RegistrationSidebar";
import { RegistrationProgress } from "@/src/features/registration/components/layout/RegistrationProgress";

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100">
      {/* Top Bar */}
      <RegistrationTopBar />

      <div className="flex">
        {/* Sidebar Navigation */}
        <RegistrationSidebar />

        {/* Main Content Area */}
        <main className="flex-1 p-6 lg:p-8">
          <div className="max-w-4xl mx-auto">
            {/* Progress Indicator */}
            <RegistrationProgress />

            {/* Dynamic Step Content */}
            <div className="mt-6">{children}</div>
          </div>
        </main>
      </div>
    </div>
  );
}
