"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
    Hotel,
    LayoutDashboard,
    CalendarDays,
    CalendarRange,
    Users,
    CreditCard,
    Settings,
    Search,
    Menu,
    X,
    LogOut,
    ChevronLeft,
    ChevronRight,
    UserCog,
    BedDouble,
} from "lucide-react";
import { NotificationCenter } from "@/components/hotel/NotificationCenter";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

const sidebarItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Bookings", href: "/dashboard/bookings", icon: CalendarDays },
    { name: "Rooms", href: "/dashboard/rooms", icon: BedDouble },
    { name: "Calendar", href: "/dashboard/calendar", icon: CalendarRange },
    { name: "Guests", href: "/dashboard/guests", icon: Users },
    { name: "Payments", href: "/dashboard/payments", icon: CreditCard },
    { name: "Staff & Roles", href: "/dashboard/staffs", icon: UserCog },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const router = useRouter();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

    return (
        <div className="flex h-screen w-full bg-gray-50 dark:bg-black text-gray-900 dark:text-gray-100 font-sans">
            {/* Sidebar (Desktop) */}
            <aside
                className={cn(
                    "hidden flex-col border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-black lg:flex transition-all duration-300 ease-in-out",
                    isSidebarCollapsed ? "w-20" : "w-64"
                )}
            >
                <div className="flex h-16 items-center px-6 border-b border-gray-100 dark:border-gray-900">
                    <div className="flex items-center gap-2 font-serif text-base font-medium text-blue-600 dark:text-blue-500">
                        <Hotel className="h-6 w-6" />
                        {!isSidebarCollapsed && <span>Hotel Booking System</span>}
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
                                        ? "bg-gray-100 dark:bg-white/10 text-black dark:text-white"
                                        : "text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-white/5",
                                    isSidebarCollapsed && "justify-center px-2"
                                )}
                                title={isSidebarCollapsed ? item.name : undefined}
                            >
                                <item.icon
                                    className={cn(
                                        "h-5 w-5 flex-shrink-0",
                                        isActive ? "text-black dark:text-white" : "text-gray-400 group-hover:text-black dark:text-gray-500 dark:group-hover:text-white"
                                    )}
                                />
                                {!isSidebarCollapsed && <span>{item.name}</span>}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-gray-100 dark:border-gray-900 space-y-2">
                    <button
                        onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                        className={cn(
                            "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors",
                            isSidebarCollapsed && "justify-center"
                        )}
                    >
                        {isSidebarCollapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
                        {!isSidebarCollapsed && <span>Collapse Sidebar</span>}
                    </button>
                    <button
                        onClick={() => router.push("/login")}
                        className={cn(
                            "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors",
                            isSidebarCollapsed && "justify-center"
                        )}
                    >
                        <LogOut className="h-5 w-5 flex-shrink-0" />
                        {!isSidebarCollapsed && <span>Sign Out</span>}
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex flex-1 flex-col overflow-hidden">
                {/* Header */}
                <header className="flex h-16 items-center justify-between border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-black px-6">
                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsMobileMenuOpen(true)}
                        className="lg:hidden text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white"
                    >
                        <Menu className="h-6 w-6" />
                    </button>

                    {/* Search Bar (Fake) */}
                    <div className="hidden max-w-md flex-1 lg:flex items-center gap-2 rounded-full border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-white/5 px-4 py-2 ml-4">
                        <Search className="h-4 w-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search bookings, guests..."
                            className="w-full bg-transparent text-sm outline-none placeholder:text-gray-400"
                        />
                    </div>

                    <div className="flex items-center gap-4">
                        <NotificationCenter />
                        <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500" />
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto p-6 lg:p-10">
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
                            className="fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-black border-r border-gray-200 dark:border-gray-800 flex flex-col lg:hidden"
                        >
                            <div className="flex h-16 items-center justify-between px-6 border-b border-gray-100 dark:border-gray-900">
                                <div className="flex items-center gap-2 font-serif text-base font-medium text-blue-600 dark:text-blue-500">
                                    <Hotel className="h-6 w-6" />
                                    <span>Hotel Booking System</span>
                                </div>
                                <button onClick={() => setIsMobileMenuOpen(false)}>
                                    <X className="h-6 w-6 text-gray-500" />
                                </button>
                            </div>
                            <nav className="flex-1 space-y-1 px-3 py-6">
                                {sidebarItems.map((item) => (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-black dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-white"
                                    >
                                        <item.icon className="h-5 w-5 text-gray-400 group-hover:text-black dark:group-hover:text-white" />
                                        {item.name}
                                    </Link>
                                ))}
                                <button
                                    onClick={() => {
                                        setIsMobileMenuOpen(false);
                                        router.push("/login");
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
