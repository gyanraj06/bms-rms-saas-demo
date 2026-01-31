import * as React from "react"
import { cn } from "@/lib/utils"
// import { ChevronDown } from "lucide-react" // Simplified without icons to avoid icon dep if not needed, but can add if requested.

const SelectContext = React.createContext<{
    value: string
    onValueChange: (value: string) => void
    open: boolean
    setOpen: (open: boolean) => void
} | null>(null)

const Select = ({ children, value, onValueChange }: { children: React.ReactNode, value?: string, onValueChange?: (val: string) => void }) => {
    const [open, setOpen] = React.useState(false)
    const [selectedValue, setSelectedValue] = React.useState(value || "")

    React.useEffect(() => {
        if (value !== undefined) setSelectedValue(value)
    }, [value])

    const handleValueChange = (val: string) => {
        setSelectedValue(val)
        onValueChange?.(val)
        setOpen(false)
    }

    return (
        <SelectContext.Provider value={{ value: selectedValue, onValueChange: handleValueChange, open, setOpen }}>
            <div className="relative">
                {children}
            </div>
        </SelectContext.Provider>
    )
}

const SelectTrigger = React.forwardRef<
    HTMLButtonElement,
    React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, children, ...props }, ref) => {
    const context = React.useContext(SelectContext)
    return (
        <button
            ref={ref}
            type="button"
            onClick={() => context?.setOpen(!context.open)}
            className={cn(
                "flex h-10 w-full items-center justify-between rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-950 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-800 dark:bg-zinc-950 dark:ring-offset-zinc-950 dark:placeholder:text-zinc-400 dark:focus:ring-zinc-300",
                className
            )}
            {...props}
        >
            {children}
            {/* Chevron down could go here */}
        </button>
    )
})
SelectTrigger.displayName = "SelectTrigger"

const SelectValue = React.forwardRef<
    HTMLSpanElement,
    React.HTMLAttributes<HTMLSpanElement> & { placeholder?: string }
>(({ className, children, placeholder, ...props }, ref) => {
    const context = React.useContext(SelectContext)
    const childText = context?.value || placeholder
    // If children are provided (custom display), use them. 
    // Note: This relies on the parent passing the label if they want to override the ID display.
    const content = children || childText

    return (
        <span
            ref={ref}
            className={cn("block truncate", className)}
            {...props}
        >
            {content}
        </span>
    )
})
SelectValue.displayName = "SelectValue"

const SelectContent = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
    const context = React.useContext(SelectContext)
    if (!context?.open) return null

    return (
        <div
            ref={ref}
            className={cn(
                "absolute z-50 min-w-[8rem] overflow-hidden rounded-md border border-zinc-200 bg-white text-zinc-950 shadow-md animate-in fade-in-80 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50",
                "mt-1 w-full",
                className
            )}
            {...props}
        >
            <div className="w-full p-1">
                {children}
            </div>
        </div>
    )
})
SelectContent.displayName = "SelectContent"

const SelectItem = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement> & { value: string }
>(({ className, children, value, ...props }, ref) => {
    const context = React.useContext(SelectContext)
    return (
        <div
            ref={ref}
            onClick={() => context?.onValueChange(value)}
            className={cn(
                "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-zinc-100 focus:text-zinc-900 data-[disabled]:pointer-events-none data-[disabled]:opacity-50 dark:focus:bg-zinc-800 dark:focus:text-zinc-50 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer",
                context?.value === value && "bg-zinc-100 dark:bg-zinc-800 font-medium",
                className
            )}
            {...props}
        >
            {/* Checkmark could go here */}
            <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                {/* <CheckIcon /> */}
            </span>
            <span className="truncate">{children}</span>
        </div>
    )
})
SelectItem.displayName = "SelectItem"

export { Select, SelectTrigger, SelectValue, SelectContent, SelectItem }
