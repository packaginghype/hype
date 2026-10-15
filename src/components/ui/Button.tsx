import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "teal" | "ghost";
  size?: "sm" | "md" | "lg";
  href?: string;
  fullWidth?: boolean;
  children: React.ReactNode;
}

export function Button({
  variant = "primary",
  size = "md",
  href,
  fullWidth = false,
  className,
  children,
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles =
    "inline-flex items-center justify-center font-semibold transition-all duration-200 rounded-[4px] focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none";

  const variants = {
    primary:
      "bg-[#FF5548] text-white hover:bg-[#e04337] focus:ring-[#FF5548] shadow-sm active:scale-[0.98]",
    secondary:
      "bg-[#172455] text-white hover:bg-[#0f1839] focus:ring-[#172455] shadow-sm active:scale-[0.98]",
    outline:
      "border-2 border-[#172455] text-[#172455] hover:bg-[#172455] hover:text-white focus:ring-[#172455]",
    teal:
      "bg-[#21AAA5] text-white hover:bg-[#1b8e8a] focus:ring-[#21AAA5] shadow-sm",
    ghost:
      "text-[#172455] hover:bg-[#F6F8FA] focus:ring-slate-300",
  };

  const sizes = {
    sm: "text-xs px-3.5 py-1.5 gap-1.5",
    md: "text-sm px-5 py-2.5 gap-2",
    lg: "text-base px-6 py-3.5 gap-2.5 font-bold",
  };

  const combinedClasses = cn(
    baseStyles,
    variants[variant],
    sizes[size],
    fullWidth ? "w-full" : "",
    className
  );

  if (href) {
    return (
      <Link href={href} className={combinedClasses}>
        {children}
      </Link>
    );
  }

  return (
    <button className={combinedClasses} disabled={disabled} {...props}>
      {children}
    </button>
  );
}
