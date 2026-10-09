import * as React from "react"
import { cn } from "@/lib/utils"

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "icon"
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    const variants: Record<string, string> = {
      default: "bg-campus-900 text-white shadow-xs hover:bg-campus-800",
      destructive: "bg-red-600 text-white shadow-xs hover:bg-red-700",
      outline: "border border-slate-200 bg-white text-slate-800 shadow-2xs hover:bg-slate-50",
      secondary: "bg-slate-100 text-slate-900 shadow-2xs hover:bg-slate-200",
      ghost: "hover:bg-slate-100 text-slate-700 hover:text-slate-900",
      link: "text-campus-700 underline-offset-4 hover:underline",
    }

    const sizes: Record<string, string> = {
      default: "h-10 px-4 py-2 text-xs",
      sm: "h-8 rounded-xl px-3 text-[11px]",
      lg: "h-12 rounded-2xl px-6 text-sm",
      icon: "h-9 w-9",
    }

    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-campus-700 disabled:pointer-events-none disabled:opacity-50 cursor-pointer active:scale-[0.98]",
          variants[variant] || variants.default,
          sizes[size] || sizes.default,
          className
        )}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }
