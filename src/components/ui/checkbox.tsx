import * as React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "checked"> {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, checked, onCheckedChange, onChange, disabled, ...props }, ref) => {
    const isChecked = Boolean(checked);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (onChange) onChange(e);
      if (onCheckedChange) onCheckedChange(e.target.checked);
    };

    return (
      <label
        className={cn(
          "relative inline-flex items-center justify-center cursor-pointer select-none",
          disabled && "cursor-not-allowed opacity-50",
        )}
      >
        <input
          type="checkbox"
          ref={ref}
          checked={isChecked}
          disabled={disabled}
          onChange={handleChange}
          className="sr-only peer"
          {...props}
        />
        <div
          className={cn(
            "h-4 w-4 rounded border border-primary ring-offset-background transition-colors flex items-center justify-center peer-focus-visible:ring-2 peer-focus-visible:ring-ring peer-focus-visible:ring-offset-2",
            isChecked
              ? "bg-primary text-primary-foreground"
              : "bg-background border-input hover:border-primary/50",
            className,
          )}
        >
          {isChecked && <Check className="h-3 w-3 stroke-[3]" />}
        </div>
      </label>
    );
  },
);

Checkbox.displayName = "Checkbox";
