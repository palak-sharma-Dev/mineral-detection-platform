import { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary";
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", ...props }, ref) => {
    const baseStyles =
      "inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-slate-600";
    const variantStyles =
      variant === "secondary"
        ? "bg-white text-slate-900 border border-slate-200 hover:bg-slate-50"
        : "bg-slate-900 text-white hover:bg-slate-800";

    return <button ref={ref} className={cn(baseStyles, variantStyles, className)} {...props} />;
  }
);

Button.displayName = "Button";
