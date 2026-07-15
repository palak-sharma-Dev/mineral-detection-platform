import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface PageWrapperProps {
  children: ReactNode;
  /** Optional additional class names */
  className?: string;
  /** Constrain to a max width. Defaults to "7xl". Pass false to disable. */
  maxWidth?: "5xl" | "6xl" | "7xl" | false;
}

const maxWidthMap: Record<string, string> = {
  "5xl": "max-w-5xl",
  "6xl": "max-w-6xl",
  "7xl": "max-w-7xl",
};

/**
 * PageWrapper — applies consistent inner padding for all app-shell pages
 * rendered inside SidebarLayout. Drop in as the outermost wrapper of each
 * page's JSX to get uniform spacing without repeating padding classes everywhere.
 */
export function PageWrapper({ children, className, maxWidth = "7xl" }: PageWrapperProps) {
  return (
    <div
      className={cn(
        "w-full px-5 py-6 sm:px-6 lg:px-8 lg:py-8",
        maxWidth && "mx-auto",
        maxWidth && maxWidthMap[maxWidth],
        className
      )}
    >
      {children}
    </div>
  );
}
