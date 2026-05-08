import React from "react";
import { cn } from "../../lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "utility";
  size?: "default" | "large";
  children: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "default", className, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center font-body transition-transform duration-100 active:scale-95 disabled:pointer-events-none disabled:opacity-50",
          // Variantes
          variant === "primary" && "bg-[#0066cc] text-white rounded-full hover:bg-[#0071e3]",
          variant === "secondary" && "bg-transparent text-[#0066cc] border border-[#0066cc] rounded-full",
          variant === "utility" && "bg-[#1d1d1f] text-white rounded-lg",
          // Tamaños
          size === "default" && variant !== "utility" && "px-6 py-2.5 text-[17px] tracking-[-0.374px] leading-none",
          size === "large" && "px-8 py-3.5 text-[18px] font-light tracking-normal leading-none",
          size === "default" && variant === "utility" && "px-4 py-2 text-[14px] tracking-[-0.224px]",
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";
