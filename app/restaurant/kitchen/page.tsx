"use client";

import React, { useState, useEffect } from "react";
import {
    Clock,
    CheckCircle2,
    ChefHat,
    AlertCircle,
    Flame,
    Timer,
    UtensilsCrossed,
    ArrowRight,
    History,
    LayoutDashboard,
    Utensils,
    ShoppingBag,
    Home
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

// Types matching existing order structure
interface OrderItem {
    name: string;
    quantity: number;
    notes?: string;
}

interface Order {
    id: string;
    customer: string;
    items: string | string[]; // Handling legacy string format too
    total: number;
    status: "Pending" | "Cooking" | "Ready" | "Delivered" | "Unpaid" | "Paid";
    time: string;
    type: string;
    table: string;
    timestamp: number;
    notes?: string;
}

// Modern aesthetic configuration
const KITCHEN_STAGES = [
    {
        id: "Pending",
        label: "Incoming",
        icon: AlertCircle,
        color: "text-zinc-600 dark:text-zinc-400",
        headerClass: "bg-white dark:bg-zinc-900/50 border-b-2 border-zinc-100 dark:border-zinc-800",
        bg: "bg-zinc-50/50 dark:bg-zinc-950/20"
    },
    {
        id: "Cooking",
        label: "In Progress",
        icon: Flame,
        color: "text-orange-500",
        headerClass: "bg-white dark:bg-zinc-900/50 border-b-2 border-orange-100 dark:border-orange-900/20",
        bg: "bg-orange-50/10 dark:bg-orange-950/5"
    },
    {
        id: "Ready",
        label: "Ready to Serve",
        icon: CheckCircle2,
        color: "text-emerald-600",
        headerClass: "bg-white dark:bg-zinc-900/50 border-b-2 border-emerald-100 dark:border-emerald-900/20",
        bg: "bg-emerald-50/10 dark:bg-emerald-950/5"
    }
];

export default function KitchenView() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [historyOrders, setHistoryOrders] = useState<Order[]>([]);
    const [viewMode, setViewMode] = useState<"active" | "history">("active");
    const [currentTime, setCurrentTime] = useState(Date.now());

    // Load orders and sync
    useEffect(() => {
        const loadOrders = () => {
            try {
                const stored = localStorage.getItem('restaurant_orders') || '[]';
                const parsed: Order[] = JSON.parse(stored);

                // Active Orders
                const kitchenOrders = parsed.filter(o =>
                    ["Pending", "Cooking", "Ready", "Unpaid"].includes(o.status)
                ).sort((a, b) => a.timestamp - b.timestamp); // Oldest first
                setOrders(kitchenOrders);

                // History Orders
                const pastOrders = parsed.filter(o =>
                    !["Pending", "Cooking", "Ready", "Unpaid"].includes(o.status)
                ).sort((a, b) => b.timestamp - a.timestamp); // Newest first
                setHistoryOrders(pastOrders);

            } catch (e) {
                console.error("Failed to load orders", e);
            }
        };

        loadOrders();
        window.addEventListener('storage', loadOrders);
        const interval = setInterval(() => {
            loadOrders();
            setCurrentTime(Date.now());
        }, 5000);

        return () => {
            window.removeEventListener('storage', loadOrders);
            clearInterval(interval);
        };
    }, []);

    const updateOrderStatus = (orderId: string, newStatus: string) => {
        const allOrders = JSON.parse(localStorage.getItem('restaurant_orders') || '[]');
        const updatedOrders = allOrders.map((o: Order) => {
            if (o.id === orderId) {
                return { ...o, status: newStatus };
            }
            return o;
        });

        localStorage.setItem('restaurant_orders', JSON.stringify(updatedOrders));
        window.dispatchEvent(new Event("storage"));
    };

    const getElapsedTime = (timestamp: number) => {
        const diff = Math.floor((currentTime - timestamp) / 60000);
        if (diff < 1) return "Just now";
        return `${diff}m`;
    };

    const getTimerStatus = (timestamp: number) => {
        const diff = (currentTime - timestamp) / 60000;
        if (diff > 20) return "critical";
        if (diff > 10) return "warning";
        return "normal";
    };

    const parseItems = (items: string | string[]) => {
        if (Array.isArray(items)) return items;
        return items.split(',').map(i => i.trim());
    };

    return (
        <div className="h-[calc(100vh-4rem)] flex flex-col gap-6 p-4 md:p-6 max-w-[1600px] mx-auto w-full font-sans">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 tracking-tight flex items-center gap-2.5">
                        Kitchen Display
                        <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse mt-1" />
                    </h1>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">
                        {orders.length} active orders • {historyOrders.length} completed today
                    </p>
                </div>

                <div className="bg-zinc-100/80 dark:bg-zinc-900/80 p-1 rounded-full border border-zinc-200/50 dark:border-zinc-800 backdrop-blur-sm flex items-center shadow-inner">
                    <button
                        onClick={() => setViewMode("active")}
                        className={cn(
                            "flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ease-out",
                            viewMode === "active"
                                ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-sm ring-1 ring-zinc-200/50 dark:ring-zinc-700"
                                : "text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
                        )}
                    >
                        <LayoutDashboard className="h-3.5 w-3.5" />
                        Live Board
                    </button>
                    <button
                        onClick={() => setViewMode("history")}
                        className={cn(
                            "flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ease-out",
                            viewMode === "history"
                                ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-sm ring-1 ring-zinc-200/50 dark:ring-zinc-700"
                                : "text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
                        )}
                    >
                        <History className="h-3.5 w-3.5" />
                        History
                    </button>
                </div>
            </header>

            {viewMode === "active" ? (
                <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6 overflow-hidden">
                    {KITCHEN_STAGES.map((stage) => {
                        const stageOrders = orders.filter(o => {
                            if (stage.id === 'Pending') return o.status === 'Pending' || o.status === 'Unpaid';
                            return o.status === stage.id;
                        });
                        return (
                            <div key={stage.id} className={cn(
                                "flex flex-col h-full min-h-0 rounded-2xl border border-zinc-200/60 dark:border-zinc-800/60 overflow-hidden transition-colors",
                                stage.bg
                            )}>
                                {/* Column Header */}
                                <div className={cn("p-4 flex justify-between items-center backdrop-blur-md", stage.headerClass)}>
                                    <div className="flex items-center gap-2.5">
                                        <div className={cn("p-1.5 rounded-md bg-zinc-100 dark:bg-zinc-800", stage.color)}>
                                            <stage.icon className="h-4 w-4" />
                                        </div>
                                        <h2 className="font-semibold text-zinc-900 dark:text-zinc-100 tracking-tight">{stage.label}</h2>
                                    </div>
                                    <span className="text-xs font-mono font-medium text-zinc-400 bg-zinc-100 dark:bg-zinc-900 px-2 py-0.5 rounded-full">
                                        {stageOrders.length}
                                    </span>
                                </div>

                                {/* Cards Container */}
                                <div className="flex-1 overflow-y-auto p-3 space-y-3 scrollbar-thin scrollbar-thumb-zinc-300 dark:scrollbar-thumb-zinc-700">
                                    <AnimatePresence mode="popLayout">
                                        {stageOrders.length === 0 ? (
                                            <motion.div
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                className="h-48 flex flex-col items-center justify-center text-zinc-400/50 italic text-sm"
                                            >
                                                No orders
                                            </motion.div>
                                        ) : (
                                            stageOrders.map((order) => {
                                                const timerStatus = getTimerStatus(order.timestamp);

                                                return (
                                                    <motion.div
                                                        key={order.id}
                                                        layoutId={order.id}
                                                        initial={{ opacity: 0, scale: 0.98, y: 10 }}
                                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                                        exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                                                        className="group bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-md hover:border-zinc-300 dark:hover:border-zinc-700 transition-all duration-200 flex flex-col overflow-hidden"
                                                    >
                                                        <div className="p-4 flex flex-col gap-4">
                                                            {/* Header */}
                                                            <div className="flex justify-between items-start">
                                                                <div className="flex flex-col">
                                                                    <div className="flex items-center gap-2">
                                                                        <span className="text-lg font-bold text-zinc-900 dark:text-zinc-50 tracking-tight">
                                                                            #{order.id.split('-')[1] || order.id}
                                                                        </span>
                                                                        {(() => {
                                                                            const type = (order.type || "").toLowerCase();
                                                                            let Icon = Utensils;
                                                                            // Check if "Table" is already in the name to avoid double labeling
                                                                            let label = order.table.toLowerCase().includes('table')
                                                                                ? order.table
                                                                                : `Table ${order.table}`;

                                                                            let colorClass = "text-orange-600 border-orange-200 bg-orange-50 dark:text-orange-400 dark:border-orange-900/30 dark:bg-orange-900/20";

                                                                            if (type.includes('takeaway')) {
                                                                                Icon = ShoppingBag;
                                                                                label = `Takeaway ${order.table !== '-' ? order.table : ''}`;
                                                                                colorClass = "text-blue-600 border-blue-200 bg-blue-50 dark:text-blue-400 dark:border-blue-900/30 dark:bg-blue-900/20";
                                                                            } else if (type.includes('room')) {
                                                                                Icon = Home;
                                                                                label = order.table.toLowerCase().includes('room')
                                                                                    ? order.table
                                                                                    : `Room ${order.table}`;
                                                                                colorClass = "text-purple-600 border-purple-200 bg-purple-50 dark:text-purple-400 dark:border-purple-900/30 dark:bg-purple-900/20";
                                                                            }

                                                                            return (
                                                                                <div className={cn("flex items-center gap-1.5 px-2 py-0.5 rounded-md border text-[10px] font-bold uppercase tracking-wider", colorClass)}>
                                                                                    <Icon className="h-3 w-3" />
                                                                                    {label}
                                                                                </div>
                                                                            );
                                                                        })()}
                                                                    </div>
                                                                    <span className="text-xs text-zinc-400 font-medium truncate max-w-[120px]">
                                                                        {order.customer}
                                                                    </span>
                                                                </div>

                                                                <div className={cn(
                                                                    "flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-bold tabular-nums transition-colors",
                                                                    timerStatus === 'critical' ? "bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400" :
                                                                        timerStatus === 'warning' ? "bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400" :
                                                                            "bg-zinc-50 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400"
                                                                )}>
                                                                    <Timer className="h-3 w-3" />
                                                                    {getElapsedTime(order.timestamp)}
                                                                </div>
                                                            </div>

                                                            {/* Cooking Notes Alert */}
                                                            {order.notes && (
                                                                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-900/30 rounded-md p-2 text-xs text-yellow-800 dark:text-yellow-200 flex gap-2">
                                                                    <AlertCircle className="h-4 w-4 shrink-0" />
                                                                    <p className="font-medium italic">"{order.notes}"</p>
                                                                </div>
                                                            )}

                                                            {/* Items */}
                                                            <div className="space-y-1 my-1">
                                                                {parseItems(order.items).map((item, idx) => {
                                                                    const match = item.match(/^(\d+)x\s+(.+)$/);
                                                                    const qty = match ? match[1] : "1";
                                                                    const name = match ? match[2] : item;

                                                                    return (
                                                                        <div key={idx} className="flex items-start gap-2.5 text-sm group-hover:text-zinc-900 dark:group-hover:text-zinc-50 transition-colors text-zinc-600 dark:text-zinc-400">
                                                                            <span className="font-semibold text-zinc-900 dark:text-zinc-200 min-w-[1.2rem]">{qty}×</span>
                                                                            <span className="leading-snug">{name}</span>
                                                                        </div>
                                                                    );
                                                                })}
                                                            </div>
                                                        </div>

                                                        {/* Actions */}
                                                        <div className="p-3 bg-zinc-50/50 dark:bg-zinc-900/50 border-t border-zinc-100 dark:border-zinc-800 mt-auto">
                                                            {(order.status === "Pending" || order.status === "Unpaid") && (
                                                                <Button
                                                                    className="w-full bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200 shadow-sm h-9 text-sm font-medium tracking-wide"
                                                                    onClick={() => updateOrderStatus(order.id, "Cooking")}
                                                                >
                                                                    Start Cooking
                                                                </Button>
                                                            )}
                                                            {order.status === "Cooking" && (
                                                                <Button
                                                                    className="w-full bg-amber-600 hover:bg-amber-700 text-white shadow-sm h-9 text-sm font-medium tracking-wide border-0"
                                                                    onClick={() => updateOrderStatus(order.id, "Ready")}
                                                                >
                                                                    Mark Ready
                                                                    <CheckCircle2 className="ml-2 h-4 w-4" />
                                                                </Button>
                                                            )}
                                                            {order.status === "Ready" && (
                                                                <Button
                                                                    variant="outline"
                                                                    className="w-full border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 h-9"
                                                                    onClick={() => updateOrderStatus(order.id, "Delivered")}
                                                                >
                                                                    Complete
                                                                    <ArrowRight className="ml-2 h-4 w-4 opacity-50" />
                                                                </Button>
                                                            )}
                                                        </div>
                                                    </motion.div>
                                                );
                                            })
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="flex-1 bg-white dark:bg-zinc-900/50 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden flex flex-col shadow-sm">
                    <div className="p-5 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/30 dark:bg-zinc-900/30">
                        <h2 className="font-bold text-lg text-zinc-900 dark:text-white flex items-center gap-2">
                            <History className="h-5 w-5 text-zinc-400" />
                            Order History
                        </h2>
                    </div>
                    <div className="overflow-y-auto flex-1 p-0">
                        {historyOrders.length === 0 ? (
                            <div className="h-64 flex flex-col items-center justify-center text-zinc-400 gap-3">
                                <div className="p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-full">
                                    <CheckCircle2 className="h-8 w-8 opacity-20" />
                                </div>
                                <p className="font-medium text-sm">No completed orders yet today</p>
                            </div>
                        ) : (
                            <table className="w-full text-sm text-left">
                                <thead className="bg-zinc-50/80 dark:bg-zinc-900/50 text-zinc-500 sticky top-0 z-10 backdrop-blur-sm border-b border-zinc-100 dark:border-zinc-800">
                                    <tr>
                                        <th className="px-6 py-4 font-medium w-32">Time</th>
                                        <th className="px-6 py-4 font-medium w-32">ID</th>
                                        <th className="px-6 py-4 font-medium w-24">Table</th>
                                        <th className="px-6 py-4 font-medium">Items</th>
                                        <th className="px-6 py-4 font-medium w-32 text-right">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                                    {historyOrders.map((order) => (
                                        <tr key={order.id} className="group hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors">
                                            <td className="px-6 py-4 text-zinc-500 font-mono text-xs">
                                                {new Date(order.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </td>
                                            <td className="px-6 py-4 font-bold text-zinc-700 dark:text-zinc-300">
                                                #{order.id.split('-')[1] || order.id}
                                            </td>
                                            <td className="px-6 py-4 text-zinc-500">
                                                <span className="bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded text-xs font-medium">
                                                    {order.table}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-zinc-700 dark:text-zinc-300">
                                                {Array.isArray(order.items) ? (
                                                    <div className="flex flex-wrap gap-1">
                                                        {order.items.map((i, idx) => (
                                                            <span key={idx} className="inline-flex items-center px-1.5 py-0.5 rounded text-xs bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700">
                                                                {i}
                                                            </span>
                                                        ))}
                                                    </div>
                                                ) : order.items}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-900/50">
                                                    {order.status}
                                                </Badge>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
