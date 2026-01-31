"use client";

import React, { useState, useEffect } from "react";
import {
    Armchair,
    Users,
    Clock,
    ChevronRight,
    Plus,
    DollarSign,
    Utensils,
    AlertCircle,
    Check,
    Calendar,
    X,
    CalendarDays
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { SettlementModal } from "@/app/dashboard/SettlementModal";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Default tables if none in storage - matching user's POS default structure
const DEFAULT_TABLES = [
    { id: "t1", name: "Table 1", seats: 4, shape: "square", zone: "Main Hall" },
    { id: "t2", name: "Table 2", seats: 4, shape: "square", zone: "Main Hall" },
    { id: "t3", name: "Table 3", seats: 6, shape: "rectangle", zone: "Window" },
    { id: "t4", name: "Table 4", seats: 2, shape: "circle", zone: "Patio" },
];

export interface Reservation {
    id: string;
    tableId: string; // Linking by ID is better, but POS uses name often. Let's use ID for storage, but match carefully.
    tableName: string; // redundancy for easier lookup
    customerName: string;
    time: number; // timestamp
    guests: number;
    phone?: string;
    status: 'Confirmed' | 'Seated' | 'Cancelled';
}

export default function TablesPage() {
    const router = useRouter();
    const [orders, setOrders] = useState<any[]>([]);
    const [tables, setTables] = useState<any[]>([]); // Dynamic tables state
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [selectedOrder, setSelectedOrder] = useState<any>(null);
    const [isSettlementModalOpen, setIsSettlementModalOpen] = useState(false);
    const [currentTime, setCurrentTime] = useState(Date.now());

    // Reservation Modal State
    const [isReservationModalOpen, setIsReservationModalOpen] = useState(false);
    const [selectedTableForReservation, setSelectedTableForReservation] = useState<any>(null);

    // Load data
    const loadData = () => {
        const storedOrders = localStorage.getItem('restaurant_orders') || '[]';
        const storedTables = localStorage.getItem('restaurant_tables');
        const storedReservations = localStorage.getItem('restaurant_reservations');

        const allParsedOrders = JSON.parse(storedOrders);
        // Active orders associated with a table (not Takeaway generally, but we can filter)
        // Ensure we catch "Unpaid" as active for tables
        setOrders(allParsedOrders);

        if (storedTables) {
            setTables(JSON.parse(storedTables));
        } else {
            // If no tables, use defaults and save them (optional, but good for consistency)
            setTables(DEFAULT_TABLES);
        }

        if (storedReservations) {
            setReservations(JSON.parse(storedReservations));
        }
    };

    useEffect(() => {
        loadData();
        window.addEventListener('storage', loadData);
        const interval = setInterval(() => {
            loadData();
            setCurrentTime(Date.now());
        }, 5000);
        return () => {
            window.removeEventListener('storage', loadData);
            clearInterval(interval);
        };
    }, []);

    const getTableOrder = (tableName: string) => {
        // Find latest active order for this table NAME (since POS saves table name as standNumber)
        // statuses: Pending, Cooking, ready, Delivered, Unpaid
        return orders.find(o =>
            o.table === tableName &&
            ["Pending", "Cooking", "Ready", "Delivered", "Unpaid"].includes(o.status)
        );
    };

    const getTableReservation = (tableId: string, tableName: string) => {
        // Simple logic: find a confirmed reservation for this table in the future or recent past (e.g. within last 30 mins)
        // For simplicity in this demo, just find the 'Confirmed' one.
        return reservations.find(r =>
            (r.tableId === tableId || r.tableName === tableName) &&
            r.status === 'Confirmed'
        );
    };

    const handleCreateReservation = (reservationData: Omit<Reservation, 'id' | 'status'>) => {
        const newReservation: Reservation = {
            ...reservationData,
            id: `res-${Date.now()}`,
            status: 'Confirmed'
        };
        const updatedReservations = [...reservations, newReservation];
        setReservations(updatedReservations);
        localStorage.setItem('restaurant_reservations', JSON.stringify(updatedReservations));
        window.dispatchEvent(new Event("storage"));
        setIsReservationModalOpen(false);
        setSelectedTableForReservation(null);
    };

    const handleCancelReservation = (reservationId: string) => {
        if (!confirm("Cancel this reservation?")) return;
        const updated = reservations.map(r => r.id === reservationId ? { ...r, status: 'Cancelled' as const } : r);
        setReservations(updated as Reservation[]);
        localStorage.setItem('restaurant_reservations', JSON.stringify(updated));
        window.dispatchEvent(new Event("storage"));
    };

    const handleSeated = (reservationId: string) => {
        const updated = reservations.map(r => r.id === reservationId ? { ...r, status: 'Seated' as const } : r);
        setReservations(updated as Reservation[]);
        localStorage.setItem('restaurant_reservations', JSON.stringify(updated));
        window.dispatchEvent(new Event("storage"));

        // Optionally redirect to POS to start order
        // router.push(...)
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "Pending": return "text-zinc-600 bg-zinc-100 dark:text-zinc-400 dark:bg-zinc-800";
            case "Cooking": return "text-orange-600 bg-orange-100 dark:text-orange-400 dark:bg-orange-900/30";
            case "Ready": return "text-emerald-600 bg-emerald-100 dark:text-emerald-400 dark:bg-emerald-900/30";
            case "Delivered": return "text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/30";
            case "Unpaid": return "text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/30";
            default: return "text-zinc-500 bg-zinc-100";
        }
    };

    const getElapsedTime = (timestamp: number) => {
        const diff = Math.floor((currentTime - timestamp) / 60000);
        if (diff < 1) return "Just now";
        return `${diff}m`;
    };

    // Copied from page.tsx (with slight robust mods if any)
    const handleSettle = (orderId: string, method: string) => {
        const allOrders = JSON.parse(localStorage.getItem('restaurant_orders') || '[]');
        const updatedOrders = allOrders.map((o: any) => {
            if (o.id === orderId) {
                // --- Inventory Deduction Logic (Same as Dashboard) ---
                if (o.rawItems && Array.isArray(o.rawItems)) {
                    const currentIngredients = JSON.parse(localStorage.getItem('restaurant_ingredients') || '[]');
                    const menuItems = JSON.parse(localStorage.getItem('restaurant_menu_items') || '[]');
                    let ingredientsToUpdate = [...currentIngredients];
                    let deducted = false;

                    o.rawItems.forEach((orderItem: any) => {
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
                                    // Log Transaction would go here (simplified for this view or reused)
                                    deducted = true;
                                }
                            });
                        }
                    });

                    if (deducted) {
                        localStorage.setItem('restaurant_ingredients', JSON.stringify(ingredientsToUpdate));
                        window.dispatchEvent(new Event("storage")); // Sync inventory
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
        window.dispatchEvent(new Event("storage"));
    };

    const handleAddItems = (tableName: string) => {
        // Pass table NAME to POS
        router.push(`/restaurant/pos?table=${encodeURIComponent(tableName)}`);
    };

    return (
        <div className="space-y-6 max-w-[1600px] mx-auto">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 tracking-tight flex items-center gap-2">
                        Table Management
                    </h1>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">
                        Overview of hall usage and table status
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2 px-3 py-1 bg-white dark:bg-zinc-900 rounded-full border border-zinc-200 dark:border-zinc-800 text-xs">
                        <div className="h-2 w-2 rounded-full bg-emerald-500" /> Free
                        <div className="h-2 w-2 rounded-full bg-orange-500 ml-2" /> Occupied
                        <div className="h-2 w-2 rounded-full bg-purple-500 ml-2" /> Reserved
                        <div className="h-2 w-2 rounded-full bg-red-500 ml-2" /> Unpaid
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {tables.map((table) => {
                    const activeOrder = getTableOrder(table.name); // Using table.name
                    const activeReservation = getTableReservation(table.id, table.name);

                    const isOccupied = !!activeOrder;
                    const isReserved = !!activeReservation && !isOccupied;

                    return (
                        <div
                            key={table.id}
                            className={cn(
                                "relative flex flex-col p-5 rounded-xl border transition-all duration-200 shadow-sm",
                                isOccupied
                                    ? "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 hover:border-orange-500/50"
                                    : isReserved
                                        ? "bg-purple-50 dark:bg-purple-950/20 border-purple-200 dark:border-purple-800"
                                        : "bg-zinc-50/50 dark:bg-zinc-950/20 border-dashed border-zinc-200 dark:border-zinc-800 opacity-80 hover:opacity-100"
                            )}
                        >
                            {/* Header */}
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex flex-col">
                                    <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">{table.name}</h3>
                                    <span className="text-xs text-zinc-500">
                                        {table.zone || "Main Hall"} • {table.seats} Seats
                                    </span>
                                </div>
                                {isOccupied ? (
                                    <Badge className={cn("capitalize shadow-none", getStatusColor(activeOrder.status))}>
                                        {activeOrder.status}
                                    </Badge>
                                ) : isReserved ? (
                                    <Badge className="bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300 shadow-none border-0">
                                        Reserved
                                    </Badge>
                                ) : (
                                    <Badge variant="outline" className="text-zinc-400 bg-transparent border-zinc-200 dark:border-zinc-800">
                                        Free
                                    </Badge>
                                )}
                            </div>

                            {/* Content */}
                            {isOccupied ? (
                                <div className="flex-1 flex flex-col gap-3">
                                    <div className="flex items-center justify-between p-2 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg border border-zinc-100 dark:border-zinc-800">
                                        <div className="flex items-center gap-2">
                                            <div className="h-8 w-8 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-orange-600 dark:text-orange-400">
                                                <Utensils className="h-4 w-4" />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">Ordered</span>
                                                <span className="text-[10px] text-zinc-500 font-mono">
                                                    {getElapsedTime(activeOrder.timestamp)} ago
                                                </span>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <span className="block text-sm font-bold text-zinc-900 dark:text-zinc-100">
                                                ${Number(activeOrder.total).toFixed(2)}
                                            </span>
                                            <span className="text-[10px] text-zinc-500">Total</span>
                                        </div>
                                    </div>

                                    <div className="mt-auto grid grid-cols-2 gap-2">
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            className="w-full text-xs h-8 border-dashed"
                                            onClick={() => handleAddItems(table.name)}
                                        >
                                            <Plus className="h-3.5 w-3.5 mr-1" />
                                            Add Items
                                        </Button>
                                        <Button
                                            size="sm"
                                            className="w-full text-xs h-8 bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900"
                                            onClick={() => {
                                                setSelectedOrder(activeOrder);
                                                setIsSettlementModalOpen(true);
                                            }}
                                        >
                                            <DollarSign className="h-3.5 w-3.5 mr-1" />
                                            Settle
                                        </Button>
                                    </div>
                                </div>
                            ) : isReserved ? (
                                <div className="flex-1 flex flex-col gap-3">
                                    <div className="flex-1 flex flex-col justify-center gap-1 p-3 bg-white dark:bg-zinc-900/50 rounded-lg border border-purple-100 dark:border-purple-900/30">
                                        <div className="flex items-center gap-2 mb-1">
                                            <CalendarDays className="h-4 w-4 text-purple-600" />
                                            <span className="font-semibold text-sm">{activeReservation.customerName}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-xs text-zinc-500">
                                            <Clock className="h-3 w-3" />
                                            {new Date(activeReservation.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                        <div className="flex items-center gap-2 text-xs text-zinc-500">
                                            <Users className="h-3 w-3" />
                                            {activeReservation.guests} Guests
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-2 mt-auto">
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            className="h-8 text-xs text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                                            onClick={() => handleCancelReservation(activeReservation.id)}
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            size="sm"
                                            className="h-8 text-xs bg-purple-600 hover:bg-purple-700 text-white"
                                            onClick={() => {
                                                handleSeated(activeReservation.id);
                                                handleAddItems(table.name);
                                            }}
                                        >
                                            Seating
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex-1 flex flex-col items-center justify-center min-h-[100px] text-zinc-300 dark:text-zinc-700">
                                    <div className="flex flex-col items-center gap-2 mb-4">
                                        <Armchair className="h-8 w-8 opacity-50" />
                                        <span className="text-xs font-medium">Available</span>
                                    </div>
                                </div>
                            )}

                            {/* Action for Free Table */}
                            {!isOccupied && !isReserved && (
                                <div className="grid grid-cols-2 gap-2 mt-4">
                                    <Button
                                        className="w-full h-9 border-zinc-200 dark:border-zinc-700 hover:border-purple-500 hover:text-purple-600 dark:hover:text-purple-500 text-zinc-500"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                            setSelectedTableForReservation(table);
                                            setIsReservationModalOpen(true);
                                        }}
                                    >
                                        Reserve
                                    </Button>
                                    <Button
                                        className="w-full h-9 border-zinc-200 dark:border-zinc-700 hover:border-orange-500 hover:text-orange-600 dark:hover:text-orange-500 text-zinc-500"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleAddItems(table.name)}
                                    >
                                        Order
                                    </Button>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            <SettlementModal
                open={isSettlementModalOpen}
                onOpenChange={setIsSettlementModalOpen}
                order={selectedOrder}
                onSettle={handleSettle}
            />

            {/* Reservation Modal */}
            <ReservationModal
                open={isReservationModalOpen}
                onOpenChange={setIsReservationModalOpen}
                table={selectedTableForReservation}
                onSubmit={handleCreateReservation}
            />
        </div>
    );
}

function ReservationModal({
    open,
    onOpenChange,
    table,
    onSubmit
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    table: any;
    onSubmit: (data: any) => void;
}) {
    const [name, setName] = useState("");
    const [guests, setGuests] = useState("2");
    const [time, setTime] = useState("");

    useEffect(() => {
        if (open) {
            // Default time to next hour
            const now = new Date();
            now.setMinutes(0, 0, 0);
            now.setHours(now.getHours() + 1);
            setTime(now.toTimeString().slice(0, 5));
            setName("");
            setGuests(table?.seats?.toString() || "2");
        }
    }, [open, table]);

    if (!open || !table) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Combine today's date with selected time
        const [hours, minutes] = time.split(':').map(Number);
        const reservationDate = new Date();
        reservationDate.setHours(hours, minutes, 0, 0);

        // Handle next day if time is in past (simplified logic)
        if (reservationDate.getTime() < Date.now()) {
            reservationDate.setDate(reservationDate.getDate() + 1);
        }

        onSubmit({
            tableId: table.id,
            tableName: table.name,
            customerName: name,
            guests: parseInt(guests),
            time: reservationDate.getTime()
        });
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
            <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl w-full max-w-md overflow-hidden border border-zinc-200 dark:border-zinc-800">
                <div className="p-6 border-b border-zinc-100 dark:border-zinc-800 flex justify-between items-center">
                    <div>
                        <h2 className="text-xl font-bold text-zinc-900 dark:text-white">Reserve Table</h2>
                        <p className="text-sm text-zinc-500">Book {table.name} for a customer</p>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)}>
                        <X className="h-5 w-5" />
                    </Button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div className="space-y-2">
                        <Label>Customer Name</Label>
                        <Input
                            required

                            placeholder="e.g. John Doe"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            className="bg-zinc-50 dark:bg-zinc-800"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Number of Guests</Label>
                            <Input
                                type="number"
                                min="1"
                                max={table.seats + 2} // allow slight squeeze
                                required
                                value={guests}
                                onChange={e => setGuests(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Time</Label>
                            <Input
                                type="time"
                                required
                                value={time}
                                onChange={e => setTime(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-xl flex items-center gap-3 text-sm text-purple-900 dark:text-purple-200 border border-purple-100 dark:border-purple-800/30">
                        <Calendar className="h-5 w-5 text-purple-600" />
                        <div className="flex-1">
                            <p className="font-semibold">Reservation Summary</p>
                            <p className="opacity-80">{table.name} • {parseInt(guests)} Guests • Today, {time}</p>
                        </div>
                    </div>

                    <div className="pt-2 flex gap-3">
                        <Button type="button" variant="ghost" className="flex-1" onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" className="flex-1 bg-purple-600 hover:bg-purple-700 text-white">
                            Confirm Booking
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
