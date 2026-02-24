"use client";

import { useState, FC } from "react";
import { Home, Menu, CheckCircle2 } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/src/components/ui/sheet";
import Link from "next/link";
import { ROUTES } from "@/src/config/constants";
import { useRegistrationSteps } from "./useRegistrationSteps";

// Reusable component for sidebar or top bar buttons
const StepButton: FC<{
  label: string;
  Icon?: FC<any>;
  isActive?: boolean;
  isCompleted?: boolean;
  isAccessible?: boolean;
  onClick?: () => void;
}> = ({ label, Icon, isActive, isCompleted, isAccessible, onClick }) => (
  <button
    onClick={onClick}
    disabled={!isAccessible}
    className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
      isActive
        ? "bg-indigo-50 text-indigo-700"
        : isCompleted
          ? "bg-green-50 text-green-700 hover:bg-green-100"
          : isAccessible
            ? "text-slate-700 hover:bg-slate-50"
            : "text-slate-300 cursor-not-allowed opacity-60"
    }`}
  >
    {Icon && (
      <div
        className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
          isActive
            ? "bg-indigo-600 text-white"
            : isCompleted
              ? "bg-green-600 text-white"
              : "bg-slate-200 text-slate-600"
        }`}
      >
        {isCompleted && !isActive ? (
          <CheckCircle2 className="h-4 w-4" />
        ) : (
          <Icon className="h-4 w-4" />
        )}
      </div>
    )}
    <div className="flex-1 min-w-0">
      <div className="text-sm font-medium truncate">{label}</div>
    </div>
  </button>
);

export function RegistrationTopBar() {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const { stepsWithState, currentStepIndex, stepsLength, navigateToStep } =
    useRegistrationSteps();

  // Top bar links
  const topBarLinks = [
    { label: "ផ្ទាំងគ្រប់គ្រង", route: ROUTES.dashboard.root },
    { label: "ចុះប្រភេទកីឡា", route: ROUTES.survey },
    { label: "ចុះចំនួនអ្នកចូលរួម", route: ROUTES.category },
    { label: "ចុះឈ្មោះ", route: ROUTES.register },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
      <div className="px-6 py-4 flex items-center justify-between gap-4 relative">
        {/* Left: Mobile Menu + Title */}
        <div className="flex items-center gap-3">
          <Sheet
            open={isMobileSidebarOpen}
            onOpenChange={setIsMobileSidebarOpen}
          >
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                aria-label="បើកជំហានចុះឈ្មោះ"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>

            <SheetContent side="left" className="p-0 lg:hidden">
              <SheetHeader className="border-b">
                <SheetTitle>ជំហានចុះឈ្មោះ</SheetTitle>
                <SheetDescription>
                  ជំហាន {currentStepIndex + 1} នៃ {stepsLength}
                </SheetDescription>
              </SheetHeader>

              <div className="divide-y">
                {stepsWithState.map((step) => (
                  <StepButton
                    key={step.param}
                    label={step.displayLabel}
                    Icon={step.icon}
                    isActive={step.isActive}
                    isCompleted={step.isCompleted}
                    isAccessible={step.isAccessible}
                    onClick={() => {
                      if (!step.isAccessible) return;
                      navigateToStep(step.param);
                      setIsMobileSidebarOpen(false);
                    }}
                  />
                ))}
              </div>
            </SheetContent>
          </Sheet>

          <div>
            <h1 className="text-xl font-bold text-slate-800">
              ចុះឈ្មោះចូលរួមកីឡាជាតិ
            </h1>
            <p className="text-xs text-slate-500">ប្រព័ន្ធចុះឈ្មោះអ្នកចូលរួម</p>
          </div>
        </div>

        {/* Center: Top Bar Links */}
        <div className="absolute inset-x-0 flex justify-center gap-4">
          {topBarLinks.map((link) => (
            <Link key={link.route} href={link.route}>
              <Button
                variant="link"
                size="sm"
                className="text-black font-medium"
              >
                {link.label}
              </Button>
            </Link>
          ))}
        </div>

        {/* Right: Home Button */}
        <div className="flex items-center gap-3">
          <Link href={ROUTES.home}>
            <Button variant="ghost" size="sm">
              <Home className="h-4 w-4 mr-2" />
              ទំព័រដើម
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
