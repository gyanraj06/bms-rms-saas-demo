"use client";

import React, { useState } from "react";
import {
    Bell,
    CheckCircle2,
    AlertTriangle,
    Info,
    X,
    Clock,
    Calendar,
    MessageSquare
} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// Static Data
const NOTIFICATIONS = [
    {
        id: "1",
        title: "New Reservation",
        message: "Table 5 booked for 4 people at 7:00 PM.",
        time: "5 min ago",
        type: "success",
        read: false,
    },
    {
        id: "2",
        title: "Low Stock Alert",
        message: "Inventory for 'Tomato Sauce' is running low.",
        time: "20 min ago",
        type: "warning",
        read: false,
    },
    {
        id: "3",
        title: "System Update",
        message: "New features available! Check out the changelog.",
        time: "1 hour ago",
        type: "info",
        read: true,
    },
    {
        id: "4",
        title: "Shift Reminder",
        message: "Sarah updated her availability for tomorrow.",
        time: "2 hours ago",
        type: "neutral",
        read: true,
    }
];

export function NotificationCenter() {
    const [notifications, setNotifications] = useState(NOTIFICATIONS);

    const unreadCount = notifications.filter(n => !n.read).length;

    const handleMarkAsRead = (id: string) => {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    };

    const handleClearAll = () => {
        setNotifications([]);
    };

    const getIcon = (type: string) => {
        switch (type) {
            case "success": return <Calendar className="h-4 w-4 text-green-500" />;
            case "warning": return <AlertTriangle className="h-4 w-4 text-orange-500" />;
            case "info": return <Info className="h-4 w-4 text-blue-500" />;
            default: return <MessageSquare className="h-4 w-4 text-gray-500" />;
        }
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger className="relative h-10 w-10 shrink-0 inline-flex items-center justify-center rounded-full border border-zinc-200 bg-transparent hover:bg-zinc-100 hover:text-zinc-900 dark:border-zinc-800 dark:hover:bg-zinc-800 dark:hover:text-zinc-50 transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-950 disabled:pointer-events-none disabled:opacity-50">
                <Bell className="h-5 w-5 text-zinc-600 dark:text-zinc-400" />
                {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 h-3 w-3 rounded-full bg-red-500 border-2 border-white dark:border-zinc-950 animate-pulse" />
                )}
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[380px] p-0 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-xl bg-white/95 dark:bg-zinc-950/95 backdrop-blur-sm z-50 mr-4">
                <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-100 dark:border-zinc-800/50">
                    <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm">Notifications</span>
                        {unreadCount > 0 && (
                            <Badge variant="outline" className="bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 text-[10px] h-5 px-1.5 border-none">
                                {unreadCount} New
                            </Badge>
                        )}
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 text-xs text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 px-2"
                        onClick={handleClearAll}
                    >
                        Clear all
                    </Button>
                </div>

                <div className="max-h-[400px] overflow-y-auto py-1">
                    {notifications.length === 0 ? (
                        <div className="py-8 text-center text-zinc-500 text-sm flex flex-col items-center gap-2">
                            <CheckCircle2 className="h-8 w-8 text-zinc-300 dark:text-zinc-700" />
                            <p>All caught up!</p>
                        </div>
                    ) : (
                        notifications.map((notification) => (
                            <div
                                key={notification.id}
                                className={cn(
                                    "relative flex gap-4 px-4 py-3 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors cursor-pointer group",
                                    !notification.read && "bg-orange-50/50 dark:bg-orange-950/10"
                                )}
                                onClick={(e) => {
                                    e.stopPropagation(); // Prevent closing if we want to keep it open, but for now standard behavior is fine
                                    handleMarkAsRead(notification.id);
                                }}
                            >
                                <div className={cn(
                                    "mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700",
                                    notification.type === "success" && "bg-green-100 border-green-200 dark:bg-green-900/20 dark:border-green-900/50",
                                    notification.type === "warning" && "bg-orange-100 border-orange-200 dark:bg-orange-900/20 dark:border-orange-900/50",
                                    notification.type === "info" && "bg-blue-100 border-blue-200 dark:bg-blue-900/20 dark:border-blue-900/50",
                                )}>
                                    {getIcon(notification.type)}
                                </div>
                                <div className="flex-1 space-y-1">
                                    <p className={cn("text-sm font-medium leading-none", !notification.read ? "text-zinc-900 dark:text-zinc-100" : "text-zinc-600 dark:text-zinc-400")}>
                                        {notification.title}
                                    </p>
                                    <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2">
                                        {notification.message}
                                    </p>
                                    <p className="text-[10px] text-zinc-400 flex items-center gap-1 pt-1">
                                        <Clock className="h-3 w-3" />
                                        {notification.time}
                                    </p>
                                </div>
                                {!notification.read && (
                                    <div className="absolute top-4 right-4 h-2 w-2 rounded-full bg-orange-500" />
                                )}
                            </div>
                        ))
                    )}
                </div>

                <div className="p-2 border-t border-zinc-100 dark:border-zinc-800/50 bg-zinc-50/50 dark:bg-zinc-900/30">
                    <Button variant="ghost" className="w-full h-8 text-xs font-medium text-zinc-600 dark:text-zinc-400">
                        View all notifications
                    </Button>
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
