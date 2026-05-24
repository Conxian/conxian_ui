import * as React from "react";
import { cn } from "@/lib/utils";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-sm border border-accent/20 bg-neutral-light px-3 py-2 text-sm text-ink tabular-nums file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-ink/30 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent/40 transition-all disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
