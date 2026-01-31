"use client";

import React, { useState, useEffect } from "react";
import {
    Search,
    Filter,
    MoreHorizontal,
    CheckCircle2,
    Clock,
    ChefHat,
    Truck,
    RefreshCw
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

// Mock Data
const MOCK_ORDERS = [
    { id: "ORD-001", customer: "John Doe", items: ["2x Burger", "1x Cola"], total: 32.50, status: "Ready", time: "10:30 AM", type: "Dine-in", table: "T-5", timestamp: Date.now() - 3600000 },
    { id: "ORD-002", customer: "Jane Smith", items: ["1x Pizza", "2x Beer"], total: 45.00, status: "Cooking", time: "10:45 AM", type: "Dine-in", table: "T-2", timestamp: Date.now() - 3000000 },
    { id: "ORD-003", customer: "Mike Johnson", items: ["1x Steak", "1x Wine"], total: 89.00, status: "Pending", time: "11:00 AM", type: "Dine-in", table: "T-8", timestamp: Date.now() - 1800000 },
    { id: "ORD-004", customer: "Sarah Williams", items: ["3x Tacos", "3x Mojito"], total: 56.50, status: "Ready", time: "11:15 AM", type: "Takeaway", table: "-", timestamp: Date.now() - 900000 },
];

type OrderStatus = "All" | "Pending" | "Cooking" | "Ready" | "Delivered";

interface Order {
    id: string;
    customer: string;
    items: string[] | string; // Can be array or string from localstorage
    total: number;
    status: string;
    time: string;
    type: string;
    table: string;
    timestamp: number;
}

export default function OrdersPage() {
    const [statusFilter, setStatusFilter] = useState<OrderStatus>("All");
    const [searchQuery, setSearchQuery] = useState("");
    const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS);

    const loadOrders = () => {
        const stored = localStorage.getItem('restaurant_orders');
        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                // Ensure consistency in items filtering if needed, but for now just merge
                // Sort by new first
                const allOrders = [...parsed, ...MOCK_ORDERS].sort((a, b) => b.timestamp - a.timestamp);
                setOrders(allOrders);
            } catch (e) {
                console.error("Failed to parse orders", e);
            }
        }
    };

    useEffect(() => {
        loadOrders();
        // Poll for updates every 5 seconds to simulate "Live" feel without websockets
        const interval = setInterval(loadOrders, 5000);
        return () => clearInterval(interval);
    }, []);

    const filteredOrders = orders.filter(order => {
        // Normalizing status check
        const orderStatus = order.status || "Pending";
        const matchesStatus = statusFilter === "All" || orderStatus === statusFilter;
        const matchesSearch =
            (order.customer || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
            (order.id || "").toLowerCase().includes(searchQuery.toLowerCase());
        return matchesStatus && matchesSearch;
    });

    const getStatusColor = (status: string) => {
        switch (status) {
            case "Pending": return "bg-zinc-100 text-zinc-800 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:border-zinc-700";
            case "Cooking": return "bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-800";
            case "Ready": return "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800";
            case "Delivered": return "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800";
            case "Unpaid": return "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800";
            default: return "bg-zinc-100 text-zinc-800";
        }
    };

    const renderItems = (items: string | string[]) => {
        if (Array.isArray(items)) {
            return (
                <div>
                    <div className="max-w-xs truncate text-zinc-600 dark:text-zinc-300" title={items.join(", ")}>
                        {items.join(", ")}
                    </div>
                    {items.length > 2 && <span className="text-xs text-zinc-400">+{items.length - 2} more</span>}
                </div>
            );
        }
        return (
            <div className="max-w-xs truncate text-zinc-600 dark:text-zinc-300" title={items}>
                {items}
            </div>
        );
    }

    return (
        <div className="space-y-6 h-full flex flex-col">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        Live Orders
                        <span className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                        </span>
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400">Real-time order tracking and management.</p>
                </div>
                <Button variant="outline" size="sm" onClick={loadOrders} className="gap-2">
                    <RefreshCw className="h-4 w-4" />
                    Refresh
                </Button>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 items-center bg-white dark:bg-zinc-900 p-4 rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-800">
                <div className="relative w-full sm:w-72">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                        placeholder="Search order ID or customer..."
                        className="pl-9"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="flex gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0">
                    {(["All", "Pending", "Cooking", "Ready", "Delivered"] as OrderStatus[]).map((status) => (
                        <button
                            key={status}
                            onClick={() => setStatusFilter(status)}
                            className={cn(
                                "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors border",
                                statusFilter === status
                                    ? "bg-orange-600 border-orange-600 text-white"
                                    : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800"
                            )}
                        >
                            {status}
                        </button>
                    ))}
                </div>
            </div>

            {/* Table */}
            <div className="flex-1 bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-800 overflow-hidden flex flex-col">
                <div className="overflow-x-auto flex-1">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-zinc-50 dark:bg-zinc-950/50 text-zinc-500 border-b border-zinc-200 dark:border-zinc-800 sticky top-0">
                            <tr>
                                <th className="px-6 py-4 font-medium">Order Details</th>
                                <th className="px-6 py-4 font-medium hidden sm:table-cell">Items</th>
                                <th className="px-6 py-4 font-medium">Type</th>
                                <th className="px-6 py-4 font-medium">Total</th>
                                <th className="px-6 py-4 font-medium">Status</th>
                                <th className="px-6 py-4 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                            {filteredOrders.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-zinc-500">
                                        No active orders found.
                                    </td>
                                </tr>
                            ) : (
                                filteredOrders.map((order, idx) => (
                                    <tr key={idx} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-gray-900 dark:text-white">{order.id}</div>
                                            <div className="text-zinc-500">{order.customer}</div>
                                            <div className="text-xs text-zinc-400 mt-1 flex items-center gap-1">
                                                <Clock className="h-3 w-3" /> {order.time}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 hidden sm:table-cell">
                                            {renderItems(order.items)}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <span className="capitalize text-zinc-600 dark:text-zinc-300">{order.type}</span>
                                                {order.table !== "-" && <span className="text-xs bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded text-zinc-500">{order.table}</span>}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                                            ${typeof order.total === 'number' ? order.total.toFixed(2) : order.total}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium border", getStatusColor(order.status))}>
                                                {order.status === "Unpaid" ? "Unpaid (Pay Later)" : (order.status || "Pending")}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <Button variant="ghost" size="icon" className="hover:bg-zinc-100 dark:hover:bg-zinc-800">
                                                <MoreHorizontal className="h-4 w-4 text-zinc-500" />
                                            </Button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
