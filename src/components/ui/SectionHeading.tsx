import React from "react";
import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  badge?: string;
  title: string;
  description?: string;
  align?: "left" | "center" | "right";
  light?: boolean;
  className?: string;
}

export function SectionHeading({
  badge,
  title,
  description,
  align = "center",
  light = false,
  className,
}: SectionHeadingProps) {
  const alignment = {
    left: "text-left items-start",
    center: "text-center items-center mx-auto",
    right: "text-right items-end ml-auto",
  };

  return (
    <div
      className={cn(
        "flex flex-col mb-10 max-w-3xl",
        alignment[align],
        className
      )}
    >
      {badge && (
        <span
          className={cn(
            "inline-block px-3 py-1 mb-3 text-xs font-bold tracking-widest uppercase rounded-full",
            light
              ? "bg-white/10 text-teal-300"
              : "bg-[#eaf7f6] text-[#21AAA5]"
          )}
        >
          {badge}
        </span>
      )}
      <h2
        className={cn(
          "text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight",
          light ? "text-white" : "text-[#172455]"
        )}
      >
        {title}
      </h2>
      {description && (
        <p
          className={cn(
            "mt-3 text-sm sm:text-base leading-relaxed",
            light ? "text-slate-300" : "text-gray-600"
          )}
        >
          {description}
        </p>
      )}
    </div>
  );
}
