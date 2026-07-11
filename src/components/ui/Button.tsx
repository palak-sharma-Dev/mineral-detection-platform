import { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary";
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", ...props }, ref) => {
    const baseStyles =
      "inline-flex items-center justify-center rounded-[0.5rem] border px-5 py-2.5 text-sm font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[color:var(--primary)]/20";
    const variantStyles =
      variant === "secondary"
        ? "border-[color:var(--foreground-muted)]/20 bg-[color:var(--card)] text-[color:var(--foreground)] hover:bg-[color:var(--surface-muted)]"
        : "border-[color:var(--primary)] bg-[color:var(--primary)] text-white hover:bg-[color:var(--primary)]/90";

    return <button ref={ref} className={cn(baseStyles, variantStyles, className)} {...props} />;
  }
);

Button.displayName = "Button";
