import * as React from "react"
import { cn } from "@/lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
  icon?: React.ReactNode
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, hint, icon, id, ...props }, ref) => {
    const inputId = id || props.name
    const hintId = hint ? `${inputId}-hint` : undefined
    const errorId = error ? `${inputId}-error` : undefined
    const describedBy = [hintId, errorId].filter(Boolean).join(' ') || undefined

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="block text-sm font-medium text-neutral-700 mb-1.5">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-500" aria-hidden="true">
              {icon}
            </div>
          )}
          <input
            id={inputId}
            className={cn(
              "w-full rounded-lg border border-neutral-300 bg-white px-4 py-2.5 text-base text-neutral-900 transition-all duration-200",
              "placeholder:text-neutral-400 hover:border-neutral-400",
              "focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20",
              "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-neutral-50",
              {
                "pl-10": icon,
                "border-error focus:border-error focus:ring-error/20": error,
              },
              className
            )}
            ref={ref}
            aria-invalid={!!error}
            aria-describedby={describedBy}
            {...props}
          />
        </div>
        {hint && !error && (
          <p id={hintId} className="mt-1.5 text-sm text-neutral-600">{hint}</p>
        )}
        {error && (
          <p id={errorId} className="mt-1.5 text-sm text-error" role="alert">{error}</p>
        )}
      </div>
    )
  }
)
Input.displayName = "Input"

export { Input }