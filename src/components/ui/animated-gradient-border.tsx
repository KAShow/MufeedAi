import React from "react";
import { cn } from "@/lib/utils";

interface AnimatedGradientBorderProps {
  children: React.ReactNode;
  className?: string;
}

export function AnimatedGradientBorder({
  children,
  className,
}: AnimatedGradientBorderProps) {
  return (
    <div
      className={cn(
        "relative p-[1px] overflow-hidden rounded-lg bg-gradient-to-r from-primary via-secondary to-primary bg-[length:200%] animate-gradient",
        className,
      )}
    >
      <div className="relative bg-white dark:bg-gray-950 rounded-lg p-4">
        {children}
      </div>
    </div>
  );
}
