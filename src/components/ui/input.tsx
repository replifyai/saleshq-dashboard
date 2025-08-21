import * as React from "react"

import { cn } from "@/lib/utils"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    // Normalize controlled props to avoid uncontrolled→controlled warnings
    const isValueControlled = Object.prototype.hasOwnProperty.call(props, "value")
    const isCheckedControlled = Object.prototype.hasOwnProperty.call(props, "checked")

    const normalizedProps: React.ComponentProps<"input"> = {
      ...props,
      ...(isValueControlled ? { value: (props as any).value ?? "" } : {}),
      ...(isCheckedControlled ? { checked: (props as any).checked ?? false } : {}),
    }
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          "dark:bg-input dark:border-subtle-border dark:focus-visible:ring-primary/50",
          "transition-all duration-200 ease-in-out",
          "hover:border-primary/50 dark:hover:border-primary/50",
          "focus-visible:border-primary dark:focus-visible:border-primary",
          className
        )}
        ref={ref}
        {...normalizedProps}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
