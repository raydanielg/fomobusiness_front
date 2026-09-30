"use client"

import { useState } from "react"
import { Input } from "@workspace/ui/components/input"
import { Eye, EyeSlash } from "@phosphor-icons/react"

/** Large input with a leading Phosphor icon — auth forms. */
export function IconInput({
  icon,
  type = "text",
  className,
  ...props
}: React.ComponentProps<typeof Input> & { icon: React.ReactNode }) {
  const [show, setShow] = useState(false)
  const isPassword = type === "password"
  return (
    <div className="relative">
      <span className="text-muted-foreground pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 [&_svg]:size-[18px]">
        {icon}
      </span>
      <Input
        type={isPassword && show ? "text" : type}
        className={`h-12 pl-11 text-base ${isPassword ? "pr-11" : ""} ${className ?? ""}`}
        {...props}
      />
      {isPassword && (
        <button
          type="button"
          tabIndex={-1}
          onClick={() => setShow((v) => !v)}
          aria-label={show ? "Hide password" : "Show password"}
          className="text-muted-foreground hover:text-foreground absolute right-3.5 top-1/2 -translate-y-1/2"
        >
          {show ? <EyeSlash size={18} /> : <Eye size={18} />}
        </button>
      )}
    </div>
  )
}
