"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
    LayoutDashboard,
    BarChart3,
    UtensilsCrossed,
    ChefHat,
    ScrollText,
    LogOut,
    Menu as MenuIcon,
    X,
    Settings,
    Store,
    Users,
    ChevronLeft,
    ChevronRight,
    Package,
    LayoutGrid
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

const sidebarItems = [
    { name: "Dashboard", href: "/restaurant", icon: LayoutDashboard },
    { name: "POS / Billing", href: "/restaurant/pos", icon: Store },
    { name: "Live Orders", href: "/restaurant/orders", icon: UtensilsCrossed },
    { name: "Kitchen View", href: "/restaurant/kitchen", icon: ChefHat },
    { name: "Menu Management", href: "/restaurant/menu", icon: ScrollText },
    { name: "Table Management", href: "/restaurant/tables", icon: LayoutGrid },
    { name: "Inventory", href: "/restaurant/inventory", icon: Package },
    { name: "Reports", href: "/restaurant/reports", icon: BarChart3 },
    { name: "Staffs", href: "/restaurant/staffs", icon: Users },
    { name: "Settings", href: "/restaurant/settings", icon: Settings },
];

export default function RestaurantLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const router = useRouter();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);

    return (
        <div className="flex h-screen w-full bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 font-sans">
            {/* Sidebar (Desktop) - Darker/Different theme */}
            <aside
                className={cn(
                    "hidden flex-col border-r border-zinc-200 dark:border-zinc-800 bg-white dark:bg-black lg:flex transition-all duration-300 ease-in-out",
                    isCollapsed ? "w-20" : "w-64"
                )}
            >
                <div className="flex h-16 items-center px-6 border-b border-zinc-100 dark:border-zinc-900">
                    <div className="flex items-center gap-2 font-serif text-base font-medium text-orange-600 dark:text-orange-500">
                        <UtensilsCrossed className="h-6 w-6" />
                        {!isCollapsed && <span>Restaurant Admin</span>}
                    </div>
                </div>

                <nav className="flex-1 space-y-1 px-3 py-6">
                    {sidebarItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                                    isActive
                                        ? "bg-orange-50 dark:bg-orange-950/20 text-orange-600 dark:text-orange-500"
                                        : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 hover:bg-zinc-50 dark:hover:bg-zinc-900/50",
                                    isCollapsed && "justify-center px-2"
                                )}
                                title={isCollapsed ? item.name : undefined}
                            >
                                <item.icon
                                    className={cn(
                                        "h-5 w-5 flex-shrink-0",
                                        isActive ? "text-orange-600 dark:text-orange-500" : "text-zinc-400 group-hover:text-zinc-900 dark:text-zinc-500 dark:group-hover:text-zinc-100"
                                    )}
                                />
                                {!isCollapsed && <span>{item.name}</span>}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-zinc-100 dark:border-zinc-900 space-y-2">
                    <button
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className={cn(
                            "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors",
                            isCollapsed && "justify-center"
                        )}
                    >
                        {isCollapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
                        {!isCollapsed && <span>Collapse Sidebar</span>}
                    </button>
                    <button
                        onClick={() => router.push("/login?system=restaurant")}
                        className={cn(
                            "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors",
                            isCollapsed && "justify-center"
                        )}
                    >
                        <LogOut className="h-5 w-5 flex-shrink-0" />
                        {!isCollapsed && <span>Sign Out</span>}
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex flex-1 flex-col overflow-hidden">
                {/* Header for Mobile */}
                <header className="flex lg:hidden h-16 items-center justify-between border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-black px-6">
                    <div className="flex items-center gap-2 font-serif text-base font-medium text-orange-600 dark:text-orange-500">
                        <UtensilsCrossed className="h-6 w-6" />
                        <span>Restaurant Admin</span>
                    </div>
                    <button
                        onClick={() => setIsMobileMenuOpen(true)}
                        className="text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                    >
                        <MenuIcon className="h-6 w-6" />
                    </button>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto p-4 lg:p-6 bg-zinc-50/50 dark:bg-zinc-950/50">
                    {children}
                </main>
            </div>

            {/* Mobile Sidebar Overlay */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
                        />
                        <motion.aside
                            initial={{ x: "-100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "-100%" }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            className="fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-black border-r border-zinc-200 dark:border-zinc-800 flex flex-col lg:hidden"
                        >
                            <div className="flex h-16 items-center justify-between px-6 border-b border-zinc-100 dark:border-zinc-900">
                                <div className="flex items-center gap-2 font-serif text-base font-medium text-orange-600 dark:text-orange-500">
                                    <UtensilsCrossed className="h-6 w-6" />
                                    <span>Restaurant Admin</span>
                                </div>
                                <button onClick={() => setIsMobileMenuOpen(false)}>
                                    <X className="h-6 w-6 text-zinc-500" />
                                </button>
                            </div>
                            <nav className="flex-1 space-y-1 px-3 py-6">
                                {sidebarItems.map((item) => (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-900/50 dark:hover:text-zinc-100"
                                    >
                                        <item.icon className="h-5 w-5 text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-zinc-100" />
                                        {item.name}
                                    </Link>
                                ))}
                                <button
                                    onClick={() => {
                                        setIsMobileMenuOpen(false);
                                        router.push("/login?system=restaurant");
                                    }}
                                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
                                >
                                    <LogOut className="h-5 w-5" />
                                    Sign Out
                                </button>
                            </nav>
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
