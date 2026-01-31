"use client";

import React, { useState, useEffect } from "react";
import Link from 'next/link';
import {
    Users,
    ShoppingCart,
    DollarSign,
    ArrowUpRight,
    ArrowDownRight,
    UtensilsCrossed,
    Clock,
    ChefHat,
    Store,
    CheckCircle2,
    CalendarCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SettlementModal } from "../dashboard/SettlementModal";
import { NotificationCenter } from "@/components/restaurant/NotificationCenter";

const stats = [
    {
        name: "Total Revenue",
        value: "$12,345.00",
        change: "+12.5%",
        changeType: "positive",
        icon: DollarSign,
    },
    {
        name: "Active Orders",
        value: "8",
        change: "Live Now",
        changeType: "neutral",
        icon: UtensilsCrossed,
    },
    {
        name: "Total Orders",
        value: "156",
        change: "+23.1%",
        changeType: "positive",
        icon: ShoppingCart,
    },
    {
        name: "Total Customers",
        value: "89",
        change: "+4.5%",
        changeType: "positive",
        icon: Users,
    },
];

// Mock Data mirroring orders page
const MOCK_ORDERS = [
    { id: "ORD-001", customer: "John Doe", items: "2x Burger, 1x Cola", total: 32.50, status: "Ready", time: "10:30 AM", type: "Dine-in", table: "T-5", timestamp: Date.now() - 3600000 },
    { id: "ORD-002", customer: "Jane Smith", items: "1x Pizza, 2x Beer", total: 45.00, status: "Cooking", time: "10:45 AM", type: "Dine-in", table: "T-2", timestamp: Date.now() - 3000000 },
    { id: "ORD-003", customer: "Mike Johnson", items: "1x Steak, 1x Wine", total: 89.00, status: "Pending", time: "11:00 AM", type: "Dine-in", table: "T-8", timestamp: Date.now() - 1800000 },
    { id: "ORD-004", customer: "Sarah Williams", items: "3x Tacos, 3x Mojito", total: 56.50, status: "Ready", time: "11:15 AM", type: "Takeaway", table: "-", timestamp: Date.now() - 900000 },
];

export default function RestaurantDashboard() {
    // Settlement State
    const [unpaidOrders, setUnpaidOrders] = useState<any[]>([]);
    const [recentOrders, setRecentOrders] = useState<any[]>(MOCK_ORDERS);

    useEffect(() => {
        console.log("Current Unpaid Orders:", unpaidOrders);
    }, [unpaidOrders]);
    const [isSettlementModalOpen, setIsSettlementModalOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<any>(null);

    useEffect(() => {
        const loadOrders = () => {
            const stored = localStorage.getItem('restaurant_orders') || '[]';
            const allParsed = JSON.parse(stored);

            // 1. Unpaid Orders for Settlements
            const pending = allParsed.filter((o: any) => o.status === "Unpaid");
            setUnpaidOrders(pending);

            // 2. Recent Live Orders (Merge + Sort)
            // Note: MOCK_ORDERS items are strings here to match common format, 
            // but we handle array just in case via helper
            const combined = [...allParsed, ...MOCK_ORDERS].sort((a: any, b: any) => b.timestamp - a.timestamp);
            setRecentOrders(combined.slice(0, 5)); // Show only top 5 recent
        };
        loadOrders();
        window.addEventListener('storage', loadOrders);
        // Poll every 5s to keep "Recent Live Orders" time relative updates sync if we used relative time
        // but mostly to catch local changes if storage event misses (same tab)
        const interval = setInterval(loadOrders, 5000);

        return () => {
            window.removeEventListener('storage', loadOrders);
            clearInterval(interval);
        };
    }, []);

    const handleOpenSettlement = (order: any) => {
        setSelectedOrder(order);
        setIsSettlementModalOpen(true);
    };

    const handleSettle = (orderId: string, method: string) => {
        const allOrders = JSON.parse(localStorage.getItem('restaurant_orders') || '[]');
        const updatedOrders = allOrders.map((o: any) => {
            if (o.id === orderId) {
                // --- Inventory Deduction Logic ---
                if (o.rawItems && Array.isArray(o.rawItems)) {
                    // Load current data
                    const currentIngredients = JSON.parse(localStorage.getItem('restaurant_ingredients') || '[]');
                    const menuItems = JSON.parse(localStorage.getItem('restaurant_menu_items') || '[]');

                    let ingredientsToUpdate = [...currentIngredients];
                    let deducted = false;

                    o.rawItems.forEach((orderItem: any) => {
                        // Find the real menu item to get the latest recipe
                        const menuItem = menuItems.find((m: any) => m.id === orderItem.id);
                        if (menuItem && menuItem.recipe) {
                            menuItem.recipe.forEach((r: any) => {
                                const ingIndex = ingredientsToUpdate.findIndex((i: any) => i.id === r.ingredientId);
                                if (ingIndex > -1) {
                                    ingredientsToUpdate[ingIndex] = {
                                        ...ingredientsToUpdate[ingIndex],
                                        currentStock: Math.max(0, ingredientsToUpdate[ingIndex].currentStock - (r.quantity * orderItem.quantity)),
                                        lastUpdated: Date.now()
                                    };

                                    // Log Transaction
                                    const tx = {
                                        id: `tx-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
                                        ingredientId: r.ingredientId,
                                        type: 'out',
                                        quantity: r.quantity * orderItem.quantity,
                                        itemName: menuItem.name || 'Unknown Item',
                                        orderId: orderId,
                                        timestamp: Date.now(),
                                        reason: 'Sale'
                                    };

                                    const currentTx = JSON.parse(localStorage.getItem('restaurant_inventory_transactions') || '[]');
                                    localStorage.setItem('restaurant_inventory_transactions', JSON.stringify([tx, ...currentTx]));

                                    deducted = true;
                                }
                            });
                        }
                    });

                    if (deducted) {
                        localStorage.setItem('restaurant_ingredients', JSON.stringify(ingredientsToUpdate));
                        console.log("Inventory Updated for Order:", orderId);
                    }
                }
                // ---------------------------------

                return {
                    ...o,
                    status: "Paid",
                    paymentMethod: method,
                    paidAt: Date.now()
                };
            }
            return o;
        });
        localStorage.setItem('restaurant_orders', JSON.stringify(updatedOrders));

        // Trigger storage event for other tabs (like POS) and self
        window.dispatchEvent(new Event("storage"));
        // Re-load will happen via listener/poll
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "Pending": return "bg-zinc-100 text-zinc-800 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:border-zinc-700";
            case "Cooking": return "bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-800";
            case "Ready": return "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800";
            case "Delivered": return "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800";
            case "Unpaid": return "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800";
            case "Paid": return "bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800";
            default: return "bg-zinc-100 text-zinc-800";
        }
    };

    const renderItems = (items: string | string[]) => {
        if (Array.isArray(items)) {
            return (
                <div title={items.join(", ")}>
                    <span className="truncate max-w-xs block">{items.join(", ")}</span>
                    {items.length > 2 && <span className="text-xs text-zinc-400">+{items.length - 2} more</span>}
                </div>
            );
        }
        return <div className="truncate max-w-xs" title={items}>{items}</div>;
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Restaurant Dashboard</h1>
                    <p className="text-gray-500 dark:text-gray-400">Welcome back, here's what's happening today.</p>
                </div>
                <div className="flex gap-2 items-center">
                    <NotificationCenter />
                    <Link href="/restaurant/pos">
                        <Button className="bg-orange-600 hover:bg-orange-700 text-white gap-2">
                            <Store className="h-4 w-4" />
                            Open POS
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Stats Grid */}
            {/* Stats Grid */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat) => (
                    <div
                        key={stat.name}
                        className="flex items-center p-4 sm:p-6 bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-800 transition-all hover:shadow-md"
                    >
                        <div className="flex-shrink-0 p-3 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
                            <stat.icon className="h-5 w-5 sm:h-6 sm:w-6 text-orange-600 dark:text-orange-500" aria-hidden="true" />
                        </div>
                        <div className="ml-4 min-w-0 flex-1">
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">{stat.name}</p>
                            <div className="flex items-baseline gap-2 flex-wrap">
                                <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white truncate">{stat.value}</p>
                                <p
                                    className={`flex items-baseline text-xs font-semibold ${stat.changeType === 'positive' ? 'text-green-600' :
                                        stat.changeType === 'negative' ? 'text-red-600' : 'text-orange-600'
                                        }`}
                                >
                                    {stat.changeType === 'positive' ? <ArrowUpRight className="h-3 w-3 self-center" /> : null}
                                    {stat.changeType === 'negative' ? <ArrowDownRight className="h-3 w-3 self-center" /> : null}
                                    <span className="sr-only"> {stat.changeType === 'positive' ? 'Increased' : 'Decreased'} by </span>
                                    {stat.change}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>



            {/* Recent Live Orders */}
            <div className="rounded-xl bg-white dark:bg-zinc-900 shadow-sm border border-zinc-200 dark:border-zinc-800">
                <div className="p-6 border-b border-zinc-200 dark:border-zinc-800 flex justify-between items-center">
                    <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                        <Clock className="h-5 w-5 text-gray-400" />
                        Recent Live Orders
                    </h3>
                    <Link href="/restaurant/orders">
                        <Button variant="outline" size="sm">
                            View All Orders
                        </Button>
                    </Link>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-zinc-50 dark:bg-zinc-950/50 text-zinc-500 border-b border-zinc-200 dark:border-zinc-800">
                            <tr>
                                <th className="px-6 py-3 font-medium">Order ID</th>
                                <th className="px-6 py-3 font-medium">Customer</th>
                                <th className="px-6 py-3 font-medium">Items</th>
                                <th className="px-6 py-3 font-medium">Total</th>
                                <th className="px-6 py-3 font-medium">Status</th>
                                <th className="px-6 py-3 font-medium">Time</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                            {recentOrders.map((order) => (
                                <tr key={order.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{order.id}</td>
                                    <td className="px-6 py-4">{order.customer}</td>
                                    <td className="px-6 py-4">{renderItems(order.items)}</td>
                                    <td className="px-6 py-4 font-medium">${Number(order.total).toFixed(2)}</td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium border ${getStatusColor(order.status)}`}>
                                            {order.status === "Unpaid" ? "Unpaid (Pay Later)" : (order.status || "Pending")}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-zinc-500">{order.time}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <SettlementModal
                open={isSettlementModalOpen}
                onOpenChange={setIsSettlementModalOpen}
                order={selectedOrder}
                onSettle={handleSettle}
            />
        </div>
    );
}
