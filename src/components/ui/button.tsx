import * as React from "react"
import { cn } from "@/lib/utils"

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "secondary" | "ghost" | "link"
  size?: "default" | "sm" | "lg"
  fullWidth?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", fullWidth = false, ...props }, ref) => {
    return (
      <button
        className={cn(
          "inline-flex items-center justify-center font-medium transition-all duration-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] transform",
          {
            "bg-primary text-white hover:bg-primary/90 focus:ring-primary shadow-sm hover:shadow-md hover:-translate-y-0.5": variant === "default",
            "bg-secondary text-white hover:bg-secondary/90 focus:ring-secondary shadow-sm hover:shadow-md hover:-translate-y-0.5": variant === "secondary",
            "hover:bg-neutral-100 hover:text-neutral-900 focus:ring-neutral-500": variant === "ghost",
            "text-primary underline-offset-4 hover:underline focus:ring-primary": variant === "link",
            "h-11 px-6 text-base": size === "default",
            "h-9 px-4 text-sm": size === "sm",
            "h-12 px-8 text-lg": size === "lg",
            "w-full": fullWidth,
          },
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }