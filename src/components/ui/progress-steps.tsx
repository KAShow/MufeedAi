import React from "react";
import { cn } from "@/lib/utils";

interface ProgressStepsProps {
  steps: number;
  currentStep: number;
  className?: string;
}

export function ProgressSteps({
  steps,
  currentStep,
  className,
}: ProgressStepsProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      {Array.from({ length: steps }).map((_, index) => (
        <div
          key={index}
          className={cn(
            "h-2 w-2 rounded-full transition-all duration-300 transform",
            index === currentStep
              ? "bg-primary scale-125"
              : "bg-gray-200 hover:scale-110",
          )}
        />
      ))}
    </div>
  );
}
