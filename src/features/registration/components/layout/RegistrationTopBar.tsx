"use client";

import { useState } from "react";
import { Calendar, Home, Menu, CheckCircle2 } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Badge } from "@/src/components/ui/badge";
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

export function RegistrationTopBar() {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const { stepsWithState, stepsLength, currentStepIndex, navigateToStep } =
    useRegistrationSteps();

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
      <div className="px-6 py-4 flex items-center justify-between gap-4">
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
                {stepsWithState.map((step) => {
                  const Icon = step.icon;
                  const handleClick = () => {
                    if (!step.isAccessible) return;
                    navigateToStep(step.param);
                    setIsMobileSidebarOpen(false);
                  };

                  return (
                    <button
                      key={step.param}
                      onClick={handleClick}
                      disabled={!step.isAccessible}
                      className={
                        "w-full flex items-center gap-3 px-4 py-3 text-left transition-colors " +
                        (step.isActive
                          ? "bg-indigo-50 text-indigo-700"
                          : step.isCompleted
                            ? "bg-green-50 text-green-700 hover:bg-green-100"
                            : step.isAccessible
                              ? "text-slate-700 hover:bg-slate-50"
                              : "text-slate-300 cursor-not-allowed opacity-60")
                      }
                    >
                      <div
                        className={
                          "shrink-0 w-8 h-8 rounded-full flex items-center justify-center " +
                          (step.isActive
                            ? "bg-indigo-600 text-white"
                            : step.isCompleted
                              ? "bg-green-600 text-white"
                              : "bg-slate-200 text-slate-600")
                        }
                      >
                        {step.isCompleted && !step.isActive ? (
                          <CheckCircle2 className="h-4 w-4" />
                        ) : (
                          <Icon className="h-4 w-4" />
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium truncate">
                          {step.displayLabel}
                        </div>
                        <div className="text-xs text-slate-500">
                          ជំហាន {step.index + 1} នៃ {stepsLength}
                        </div>
                      </div>
                    </button>
                  );
                })}
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
