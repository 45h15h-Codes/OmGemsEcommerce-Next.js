import * as React from "react";
import { cn } from "@/lib/utils";

export interface FormFieldProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: string;
  error?: string;
  required?: boolean;
  hint?: string;
  name?: string;
}

export function FormField({
  label,
  error,
  required,
  hint,
  className,
  children,
  ...props
}: FormFieldProps) {
  return (
    <div className={cn("flex flex-col gap-2", className)} {...props}>
      {label && (
        <label className={cn("text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70", error && "text-destructive")}>
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </label>
      )}
      {children}
      {hint && !error && <p className="text-sm text-muted-foreground">{hint}</p>}
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
