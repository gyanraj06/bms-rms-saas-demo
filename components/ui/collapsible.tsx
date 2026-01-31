"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

const CollapsibleContext = React.createContext<{
    open: boolean
    setOpen: (open: boolean) => void
} | null>(null)

const Collapsible = ({
    open,
    onOpenChange,
    children,
    className,
    defaultOpen = false,
    ...props
}: {
    open?: boolean
    onOpenChange?: (open: boolean) => void
    children: React.ReactNode
    className?: string
    defaultOpen?: boolean
}) => {
    const [isOpen, setIsOpen] = React.useState(defaultOpen)

    const isControlled = open !== undefined
    const currentOpen = isControlled ? open : isOpen

    const handleOpenChange = (value: boolean) => {
        if (!isControlled) {
            setIsOpen(value)
        }
        onOpenChange?.(value)
    }

    return (
        <CollapsibleContext.Provider value={{ open: currentOpen!, setOpen: handleOpenChange }}>
            <div className={cn("", className)} {...props}>
                {children}
            </div>
        </CollapsibleContext.Provider>
    )
}

const CollapsibleTrigger = React.forwardRef<
    HTMLButtonElement,
    React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, children, onClick, ...props }, ref) => {
    const context = React.useContext(CollapsibleContext)

    return (
        <button
            ref={ref}
            onClick={(e) => {
                onClick?.(e)
                context?.setOpen(!context.open)
            }}
            className={cn("", className)}
            {...props}
        >
            {children}
        </button>
    )
})
CollapsibleTrigger.displayName = "CollapsibleTrigger"

const CollapsibleContent = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
    const context = React.useContext(CollapsibleContext)

    if (!context?.open) return null

    return (
        <div
            ref={ref}
            className={cn("overflow-hidden", className)}
            {...props}
        >
            {children}
        </div>
    )
})
CollapsibleContent.displayName = "CollapsibleContent"

export { Collapsible, CollapsibleTrigger, CollapsibleContent }
