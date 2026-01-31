"use client"

import React, { useState } from "react";
import { ArrowUpRight, ArrowDownRight, Users, BedDouble, DollarSign, CalendarCheck, Plus, ChefHat, CreditCard, CheckCircle2 } from "lucide-react";
import { BookingModal } from "./BookingModal";
import { SettlementModal } from "./SettlementModal";
import { Button } from "@/components/ui/button";

const stats = [
    {
        name: "Total Revenue",
        value: "$45,231",
        change: "+20.1%",
        trend: "up",
        icon: DollarSign,
    },
    {
        name: "Occupancy",
        value: "84%",
        change: "+4.5%",
        trend: "up",
        icon: BedDouble,
    },
    {
        name: "Active Guests",
        value: "128",
        change: "-1.2%",
        trend: "down",
        icon: Users,
    },
    {
        name: "Pending",
        value: "12",
        change: "+8.2%",
        trend: "up",
        icon: CalendarCheck,
    },
];

const recentBookings = [
    { id: "B-1023", guest: "Alice Johnson", room: "Deluxe Suite (304)", dates: "Jan 30 - Feb 4", status: "Confirmed", amount: "$1,240" },
    { id: "B-1022", guest: "Robert Smith", room: "Standard Double (201)", dates: "Jan 31 - Feb 2", status: "Checked In", amount: "$450" },
    { id: "B-1021", guest: "Emily Davis", room: "Ocean View (502)", dates: "Feb 5 - Feb 10", status: "Pending", amount: "$2,100" },
    { id: "B-1020", guest: "Michael Brown", room: "Standard Single (104)", dates: "Jan 29 - Jan 30", status: "Checked Out", amount: "$180" },
];

export default function DashboardPage() {
    const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
    const [unpaidOrders, setUnpaidOrders] = useState<any[]>([]);
    const [isSettlementModalOpen, setIsSettlementModalOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<any>(null);

    React.useEffect(() => {
        const loadOrders = () => {
            const allOrders = JSON.parse(localStorage.getItem('restaurant_orders') || '[]');
            const pending = allOrders.filter((o: any) => o.status === "Unpaid");
            setUnpaidOrders(pending);
        };
        loadOrders();
        window.addEventListener('storage', loadOrders);
        return () => window.removeEventListener('storage', loadOrders);
    }, []);

    const handleOpenSettlement = (order: any) => {
        setSelectedOrder(order);
        setIsSettlementModalOpen(true);
    };

    const handleSettle = (orderId: string, method: string) => {
        const allOrders = JSON.parse(localStorage.getItem('restaurant_orders') || '[]');
        const updatedOrders = allOrders.map((o: any) => {
            if (o.id === orderId) {
                return { ...o, status: "Paid", paymentMethod: method, paidAt: Date.now() };
            }
            return o;
        });
        localStorage.setItem('restaurant_orders', JSON.stringify(updatedOrders));
        setUnpaidOrders(updatedOrders.filter((o: any) => o.status === "Unpaid"));
        window.dispatchEvent(new Event("storage"));
    };

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-lg font-semibold text-slate-900 dark:text-white">Dashboard</h1>
                    <p className="text-xs text-slate-500">Today's overview</p>
                </div>
                <Button onClick={() => setIsBookingModalOpen(true)} size="sm" className="h-8 text-xs gap-1.5">
                    <Plus className="h-3.5 w-3.5" />
                    New Booking
                </Button>
            </div>

            {/* KPI Grid - Compact */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {stats.map((stat) => (
                    <div key={stat.name} className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-3">
                        <div className="flex items-center justify-between">
                            <div className="p-1.5 rounded bg-slate-100 dark:bg-slate-800">
                                <stat.icon className="h-3.5 w-3.5 text-slate-600 dark:text-slate-400" />
                            </div>
                            <span className={`text-[10px] font-medium ${stat.trend === "up" ? "text-green-600" : "text-red-500"}`}>
                                {stat.change}
                            </span>
                        </div>
                        <div className="mt-2">
                            <p className="text-[10px] text-slate-500">{stat.name}</p>
                            <p className="text-lg font-bold text-slate-900 dark:text-white">{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Pending Settlements */}
            <div className="rounded-lg border border-orange-200 bg-orange-50/50 dark:bg-orange-950/20 dark:border-orange-900/50 p-3">
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-orange-100 dark:bg-orange-900/50 rounded text-orange-600 dark:text-orange-400">
                            <ChefHat className="h-4 w-4" />
                        </div>
                        <div>
                            <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Restaurant Settlements</h2>
                            <p className="text-[10px] text-slate-500">Pending payments</p>
                        </div>
                    </div>
                    <span className="bg-orange-200 dark:bg-orange-900 text-orange-800 dark:text-orange-200 px-2 py-0.5 rounded-full text-[10px] font-bold">
                        {unpaidOrders.length} Pending
                    </span>
                </div>

                {unpaidOrders.length === 0 ? (
                    <div className="flex items-center justify-center p-4 text-slate-400 gap-2 border border-dashed border-slate-200 dark:border-slate-800 rounded-lg">
                        <CheckCircle2 className="h-4 w-4 text-green-500/60" />
                        <p className="text-xs">All cleared</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
                        {unpaidOrders.map((order) => (
                            <div
                                key={order.id}
                                onClick={() => handleOpenSettlement(order)}
                                className="bg-white dark:bg-slate-900 rounded-lg p-2.5 border border-slate-200 dark:border-slate-800 hover:border-orange-400 cursor-pointer transition-colors"
                            >
                                <div className="flex justify-between items-center mb-1">
                                    <span className="font-mono text-[10px] text-slate-400">{order.id}</span>
                                    <span className="font-bold text-sm">${order.total.toFixed(2)}</span>
                                </div>
                                <div className="flex items-center gap-1 text-xs">
                                    <span className="bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded text-[10px]">T{order.table}</span>
                                    <span className="truncate text-slate-600 dark:text-slate-400">{order.customer}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Recent Bookings & Room Status */}
            <div className="grid lg:grid-cols-3 gap-3">
                {/* Recent Bookings */}
                <div className="lg:col-span-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 overflow-hidden">
                    <div className="flex items-center justify-between px-3 py-2 border-b border-slate-100 dark:border-slate-900">
                        <h2 className="text-sm font-semibold text-slate-900 dark:text-white">Recent Bookings</h2>
                        <button className="text-[10px] text-blue-600 hover:underline">View All</button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-xs">
                            <thead className="bg-slate-50 dark:bg-slate-900 text-[10px] uppercase text-slate-500">
                                <tr>
                                    <th className="px-3 py-2 text-left font-medium">Guest</th>
                                    <th className="px-3 py-2 text-left font-medium hidden md:table-cell">Room</th>
                                    <th className="px-3 py-2 text-left font-medium hidden sm:table-cell">Dates</th>
                                    <th className="px-3 py-2 text-left font-medium">Status</th>
                                    <th className="px-3 py-2 text-right font-medium">Amount</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                {recentBookings.map((b) => (
                                    <tr key={b.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/50">
                                        <td className="px-3 py-2 font-medium text-slate-900 dark:text-white">
                                            {b.guest}
                                            <span className="text-[10px] text-slate-400 ml-1">{b.id}</span>
                                        </td>
                                        <td className="px-3 py-2 text-slate-500 hidden md:table-cell">{b.room}</td>
                                        <td className="px-3 py-2 text-slate-500 hidden sm:table-cell">{b.dates}</td>
                                        <td className="px-3 py-2">
                                            <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${b.status === "Confirmed" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" :
                                                    b.status === "Checked In" ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" :
                                                        b.status === "Pending" ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" :
                                                            "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                                                }`}>
                                                {b.status}
                                            </span>
                                        </td>
                                        <td className="px-3 py-2 text-right font-semibold text-slate-900 dark:text-white">{b.amount}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Room Status */}
                <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-3">
                    <h2 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">Room Status</h2>
                    <div className="space-y-3">
                        {[
                            { label: "Booked", count: 45, color: "bg-blue-500", pct: 75 },
                            { label: "Available", count: 12, color: "bg-green-500", pct: 20 },
                            { label: "Maintenance", count: 3, color: "bg-red-500", pct: 5 },
                        ].map((item) => (
                            <div key={item.label}>
                                <div className="flex justify-between text-xs mb-1">
                                    <span className="text-slate-600 dark:text-slate-400">{item.label}</span>
                                    <span className="text-slate-500">{item.count}</span>
                                </div>
                                <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5">
                                    <div className={`h-1.5 rounded-full ${item.color}`} style={{ width: `${item.pct}%` }} />
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-4 p-2.5 rounded bg-slate-50 dark:bg-slate-900 border border-dashed border-slate-200 dark:border-slate-800 text-center">
                        <p className="text-xs font-medium text-slate-700 dark:text-slate-300">3 rooms need cleaning</p>
                        <button className="mt-2 w-full text-[10px] font-medium px-2 py-1.5 rounded border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                            Notify Housekeeping
                        </button>
                    </div>
                </div>
            </div>

            <BookingModal open={isBookingModalOpen} onOpenChange={setIsBookingModalOpen} />
            <SettlementModal
                open={isSettlementModalOpen}
                onOpenChange={setIsSettlementModalOpen}
                order={selectedOrder}
                onSettle={handleSettle}
            />
        </div>
    );
}
