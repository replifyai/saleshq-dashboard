import * as React from "react"

import { cn } from "@/lib/utils"

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentProps<"textarea">
>(({ className, ...props }, ref) => {
  const isValueControlled = Object.prototype.hasOwnProperty.call(props, "value")
  const normalizedProps: React.ComponentProps<"textarea"> = {
    ...props,
    ...(isValueControlled ? { value: (props as any).value ?? "" } : {}),
  }
  return (
    <textarea
      className={cn(
        "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        className
      )}
      ref={ref}
      {...normalizedProps}
    />
  )
})
Textarea.displayName = "Textarea"

export { Textarea }
