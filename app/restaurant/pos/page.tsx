"use client";

import React, { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import { Search, Plus, Minus, Trash2, CreditCard, Banknote, ChefHat, User, Phone, MapPin, Printer, ArrowLeft, QrCode, CheckCircle2, PauseCircle, Utensils, ShoppingBag, Home } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogClose
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useSearchParams } from "next/navigation";

// Initial Data Imports
import { INITIAL_CATEGORIES, INITIAL_ITEMS, INITIAL_MENUS, MenuItem, Category, Menu } from "@/lib/menu-data";

interface OrderItem extends MenuItem {
    quantity: number;
}

interface CustomerDetails {
    name: string;
    phone: string;
    standNumber: string;
    orderType: "dine-in" | "takeaway" | "room-service";
}

interface HeldOrder {
    id: string; // paymentNumber
    customer: CustomerDetails;
    items: OrderItem[];
    timestamp: number;
    total: number;
}

function POSContent() {
    const searchParams = useSearchParams();
    // Flow State: 'customer' -> 'menu'
    const [viewMode, setViewMode] = useState<"customer" | "menu">("customer");



    // Persisted Data State
    const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [heldOrders, setHeldOrders] = useState<HeldOrder[]>([]);
    const [activeOrders, setActiveOrders] = useState<any[]>([]); // New state for Unpaid orders
    const [menus, setMenus] = useState<Menu[]>([]);
    const [selectedMenuId, setSelectedMenuId] = useState<string>("");

    // Table Management State
    const [tables, setTables] = useState<any[]>([]);


    // Load Data on Mount
    useEffect(() => {
        const loadData = () => {
            const savedItems = localStorage.getItem('restaurant_menu_items');
            const savedCats = localStorage.getItem('restaurant_categories');
            const savedHeld = localStorage.getItem('restaurant_held_orders');
            const savedOrders = localStorage.getItem('restaurant_orders'); // Load all orders
            const savedMenus = localStorage.getItem('restaurant_menus');
            const savedSelectedMenu = localStorage.getItem('restaurant_selected_menu');
            const savedTables = localStorage.getItem("restaurant_tables");

            setMenuItems(savedItems ? JSON.parse(savedItems) : INITIAL_ITEMS);
            setCategories(savedCats ? JSON.parse(savedCats) : INITIAL_CATEGORIES);
            const loadedMenus = savedMenus ? JSON.parse(savedMenus) : INITIAL_MENUS;
            setMenus(loadedMenus);

            if (savedTables) {
                setTables(JSON.parse(savedTables));
            } else {
                const defaultTables = [
                    { id: "t1", name: "Table 1", seats: 4, shape: "square" },
                    { id: "t2", name: "Table 2", seats: 4, shape: "square" },
                    { id: "t3", name: "Table 3", seats: 6, shape: "rectangle" },
                    { id: "t4", name: "Table 4", seats: 2, shape: "circle" },
                ];
                setTables(defaultTables);
            }

            // Set selected menu (default to first active menu if not set)
            if (savedSelectedMenu) {
                setSelectedMenuId(savedSelectedMenu);
            } else if (loadedMenus.length > 0) {
                const firstActiveMenu = loadedMenus.find((m: Menu) => m.active);
                setSelectedMenuId(firstActiveMenu?.id || loadedMenus[0].id);
            }

            if (savedHeld) setHeldOrders(JSON.parse(savedHeld));

            let currentUnpaid: any[] = [];
            if (savedOrders) {
                const parsedOrders = JSON.parse(savedOrders);
                currentUnpaid = parsedOrders.filter((o: any) => o.status === "Unpaid");
                setActiveOrders(currentUnpaid);
            }

            // check for table param explicitly here to handle auto-resume or auto-start
            const tableParam = searchParams.get('table');
            if (tableParam) {
                const tableName = decodeURIComponent(tableParam);
                const existingOrder = currentUnpaid.find(o => o.table === tableName);

                if (existingOrder) {
                    resumeActiveOrder(existingOrder);
                } else {
                    // Start new order for this table
                    setCustomer(prev => ({
                        ...prev,
                        standNumber: tableName,
                        name: "Guest", // Default name to skip form
                        orderType: "dine-in"
                    }));
                    setViewMode("menu");
                }
            }
        };
        loadData();

        window.addEventListener('storage', loadData);
        return () => window.removeEventListener('storage', loadData);
    }, []); // Run only on mount (and searchParams changes effectively captured on mount)

    // Persist Held Orders
    useEffect(() => {
        localStorage.setItem('restaurant_held_orders', JSON.stringify(heldOrders));
    }, [heldOrders]);

    // Persist Selected Menu
    useEffect(() => {
        if (selectedMenuId) {
            localStorage.setItem('restaurant_selected_menu', selectedMenuId);
        }
    }, [selectedMenuId]);

    // Derived Categories List
    const categoryNames = ["All", ...categories.map(c => c.name)];

    // POS State
    const [selectedCategory, setSelectedCategory] = useState<string>("All");
    const [sidebarTab, setSidebarTab] = useState<"held" | "active">("held"); // Tab state

    // Customer State
    const [customer, setCustomer] = useState<CustomerDetails>({
        name: "",
        phone: "",
        standNumber: "",
        orderType: "dine-in"
    });

    const [searchQuery, setSearchQuery] = useState("");
    const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
    const [orderNotes, setOrderNotes] = useState("");


    // Payment State
    const [paymentNumber, setPaymentNumber] = useState(() => `TXN-${Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}`);
    const [isPaid, setIsPaid] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState<"Cash" | "Card" | "UPI" | null>(null);
    const [hasPrinted, setHasPrinted] = useState(false);

    // Payment Dialog State
    const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<"Cash" | "Card" | "UPI" | null>(null);

    // Printing Logic
    const handlePrintBill = () => {
        setHasPrinted(true);
        window.print();
    };

    const handlePrintKOT = () => {
        setHasPrinted(true);
        // Inject styles for KOT (hide prices, show KOT header)
        const style = document.createElement('style');
        style.innerHTML = `
            @media print {
                .price-column, .total-section, .bill-header { display: none !important; }
                .kot-header { display: block !important; }
                .customer-info { display: block !important; }
            }
        `;
        document.head.appendChild(style);
        window.print();
        document.head.removeChild(style);
    };

    const subtotal = orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = subtotal * 0.1; // 10% tax
    const total = subtotal + tax;

    // Held Order Logic
    const holdOrder = () => {
        if (orderItems.length === 0) return;

        const newHeldOrder: HeldOrder = {
            id: paymentNumber,
            customer,
            items: orderItems,
            timestamp: Date.now(),
            total: total
        };

        setHeldOrders(prev => [newHeldOrder, ...prev]);

        // Reset POS
        setOrderItems([]);
        setOrderNotes("");
        const nextId = `TXN-${Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}`;
        setPaymentNumber(nextId);
        setViewMode("customer");
        setCustomer({ name: "", phone: "", standNumber: "", orderType: "dine-in" });
        setPaymentMethod(null);
        setIsPaid(false);
        setHasPrinted(false);
    };

    const resumeOrder = (order: HeldOrder) => {
        setCustomer(order.customer);
        setOrderItems(order.items);
        setPaymentNumber(order.id);
        setViewMode("menu");

        // Remove from held orders
        setHeldOrders(prev => prev.filter(o => o.id !== order.id));
    };

    const resumeActiveOrder = (order: any) => {
        setCustomer({
            name: order.customer,
            phone: "", // Phone might not be saved in older interface, but that's ok
            standNumber: order.table,
            orderType: (order.type === "Dine-in" || order.type === "Takeaway" || order.type === "Room Service") ? (order.type.toLowerCase() as any) : "dine-in"
        });

        // Ensure rawItems exists, otherwise parse from string description (fallback)
        if (order.rawItems && Array.isArray(order.rawItems)) {
            setOrderItems(order.rawItems);
        } else {
            // Fallback if rawItems missing (legacy data) - Start empty
            setOrderItems([]);
        }

        setPaymentNumber(order.id);
        setViewMode("menu");
        // We do NOT remove from activeOrders until saved again
    };

    const discardHeldOrder = (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        if (confirm("Are you sure you want to discard this saved order?")) {
            setHeldOrders(prev => prev.filter(o => o.id !== id));
        }
    };

    const handlePayLater = () => {
        if (orderItems.length === 0) return;

        // Create Unpaid Order directly
        const newOrder = {
            id: paymentNumber,
            customer: customer.name,
            items: orderItems.map(i => `${i.quantity}x ${i.name}`).join(", "),
            total: total,
            status: "Unpaid", // Unpaid status for dashboard settlement
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            type: "Dine-in",
            table: customer.standNumber,
            timestamp: Date.now(),
            rawItems: orderItems, // Preservation for Inventory System
            notes: orderNotes
        };

        // Save to LocalStorage
        // Save to LocalStorage
        const existingOrders = JSON.parse(localStorage.getItem('restaurant_orders') || '[]');
        const existingIndex = existingOrders.findIndex((o: any) => o.id === paymentNumber);

        let updatedOrders;
        if (existingIndex >= 0) {
            // Update existing order
            updatedOrders = [...existingOrders];
            updatedOrders[existingIndex] = newOrder;
        } else {
            // Create new order
            updatedOrders = [newOrder, ...existingOrders];
        }

        localStorage.setItem('restaurant_orders', JSON.stringify(updatedOrders));
        setActiveOrders(updatedOrders.filter((o: any) => o.status === "Unpaid")); // Update local state
        // Force sync for other tabs/components
        window.dispatchEvent(new Event("storage"));

        // Reset POS immediately
        setIsPaid(false);
        setHasPrinted(false);
        setPaymentMethod(null);
        setOrderItems([]);
        setOrderNotes("");
        const nextId = `TXN-${Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}`;
        setPaymentNumber(nextId);
        setViewMode("customer");
        setCustomer({ name: "", phone: "", standNumber: "", orderType: "dine-in" });
    };

    const initiatePayment = (method: "Cash" | "Card" | "UPI") => {
        if (orderItems.length === 0) return;
        setSelectedPaymentMethod(method);
        setPaymentDialogOpen(true);
    };

    const confirmPayment = () => {
        if (!selectedPaymentMethod) return;

        setPaymentMethod(selectedPaymentMethod);
        setIsPaid(true);
        setPaymentDialogOpen(false);

        // Save order to LocalStorage for "Live Orders" page
        const newOrder = {
            id: paymentNumber,
            customer: customer.name,
            items: orderItems.map(i => `${i.quantity}x ${i.name}`).join(", "),
            total: total,
            status: "Pending", // Default new order status
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            type: customer.orderType, // Default
            table: customer.standNumber,
            timestamp: Date.now(),
            rawItems: orderItems, // Preservation for Inventory System
            notes: orderNotes
        };

        const existingOrders = JSON.parse(localStorage.getItem('restaurant_orders') || '[]');
        const existingIndex = existingOrders.findIndex((o: any) => o.id === paymentNumber);

        let updatedOrders;
        if (existingIndex >= 0) {
            updatedOrders = [...existingOrders];
            updatedOrders[existingIndex] = newOrder;
        } else {
            updatedOrders = [newOrder, ...existingOrders];
        }

        localStorage.setItem('restaurant_orders', JSON.stringify(updatedOrders));
        setActiveOrders(updatedOrders.filter((o: any) => o.status === "Unpaid"));
        // Force sync for other tabs/components
        window.dispatchEvent(new Event("storage"));

        // Notify user or subtle feedback could go here
    };

    const handleNewOrder = () => {
        if (!hasPrinted) return;
        setIsPaid(false);
        setHasPrinted(false);
        setPaymentMethod(null);
        setOrderItems([]);
        setOrderNotes("");
        const nextId = `TXN-${Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}`;
        setPaymentNumber(nextId);
        setViewMode("customer");
        setCustomer({ name: "", phone: "", standNumber: "", orderType: "dine-in" });
    }

    // --- Customer Form Handlers ---
    const handleCustomerSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (customer.name && customer.standNumber) {
            setViewMode("menu");
        }
    };

    // --- POS Handlers ---
    const filteredItems = menuItems.filter(item => {
        // Menu filtering
        if (selectedMenuId) {
            const selectedMenu = menus.find(m => m.id === selectedMenuId);
            if (selectedMenu) {
                // If menu has specific items, check if item is in the list
                if (selectedMenu.itemIds.length > 0) {
                    if (!selectedMenu.itemIds.includes(item.id)) {
                        return false;
                    }
                } else {
                    // Otherwise, check if item's category is in the menu
                    if (!selectedMenu.categoryIds.includes(item.categoryId)) {
                        return false;
                    }
                }
            }
        }

        let itemCategoryName = "Unknown";
        if (item.categoryId) {
            const cat = categories.find(c => c.id === item.categoryId);
            itemCategoryName = cat ? cat.name : "Unknown";
        }

        const matchesCategory = selectedCategory === "All" || itemCategoryName === selectedCategory;
        const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const addToOrder = (item: MenuItem) => {
        if (isPaid) return;
        setOrderItems(prev => {
            const existing = prev.find(i => i.id === item.id);
            if (existing) {
                return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
            }
            return [...prev, { ...item, quantity: 1 }];
        });
    };

    const updateQuantity = (id: string, delta: number) => {
        if (isPaid) return;
        setOrderItems(prev => prev.map(item => {
            if (item.id === id) {
                return { ...item, quantity: Math.max(0, item.quantity + delta) };
            }
            return item;
        }).filter(item => item.quantity > 0));
    };

    // --- Views ---

    // 1. Customer Details Form (Redesigned - Tablet PRO Mode - Fixed Layout)
    if (viewMode === "customer") {
        return (
            <div className="flex flex-col lg:flex-row h-[calc(100vh-6rem)] bg-zinc-100 dark:bg-zinc-950 overflow-hidden">
                {/* LEFT SIDE: Held Orders (High Contrast Sidebar) */}
                <div className="w-full lg:w-[320px] bg-zinc-900 text-zinc-100 flex flex-col border-r border-zinc-800 flex-shrink-0">
                    <div className="p-3 border-b border-zinc-800 bg-zinc-900 z-10 shrink-0">
                        {/* Sidebar Tabs */}
                        <div className="flex p-1 bg-zinc-800 rounded-lg mb-3">
                            <button
                                onClick={() => setSidebarTab("held")}
                                className={cn(
                                    "flex-1 py-1.5 text-xs font-bold rounded-md transition-all",
                                    sidebarTab === "held"
                                        ? "bg-zinc-700 text-white shadow"
                                        : "text-zinc-500 hover:text-zinc-300"
                                )}
                            >
                                Held (Drafts)
                            </button>
                            <button
                                onClick={() => setSidebarTab("active")}
                                className={cn(
                                    "flex-1 py-1.5 text-xs font-bold rounded-md transition-all",
                                    sidebarTab === "active"
                                        ? "bg-orange-600 text-white shadow"
                                        : "text-zinc-500 hover:text-zinc-300"
                                )}
                            >
                                Active
                            </button>
                        </div>

                        <h2 className="text-sm font-bold flex items-center gap-2 text-zinc-400 uppercase tracking-wider">
                            {sidebarTab === "held" ? (
                                <>
                                    <PauseCircle className="h-4 w-4" />
                                    Held Tickets
                                </>
                            ) : (
                                <>
                                    <CheckCircle2 className="h-4 w-4" />
                                    Active Orders
                                </>
                            )}
                        </h2>
                    </div>

                    <div className="flex-1 overflow-y-auto p-3 space-y-2 custom-scrollbar">
                        {sidebarTab === "held" ? (
                            heldOrders.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-zinc-600 gap-3 opacity-50">
                                    <CreditCard className="h-10 w-10" />
                                    <p className="text-sm">No held tickets</p>
                                </div>
                            ) : (
                                heldOrders.map((order) => (
                                    <div
                                        key={order.id}
                                        onClick={() => resumeOrder(order)}
                                        className="group relative bg-zinc-800 rounded-lg p-0 overflow-hidden cursor-pointer hover:bg-zinc-700 transition-colors border border-zinc-700 hover:border-orange-500"
                                    >
                                        {/* Ticket Header */}
                                        <div className="bg-zinc-950/30 p-2.5 flex justify-between items-center border-b border-zinc-700/50">
                                            <div className="flex items-center gap-2">
                                                <span className="font-mono text-orange-500 font-bold">{order.customer.standNumber}</span>
                                                <span className="text-[10px] text-zinc-400 truncate max-w-[100px]">{order.customer.name}</span>
                                            </div>
                                            <span className="text-[10px] font-mono text-zinc-500">
                                                {new Date(order.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>

                                        {/* Ticket Body */}
                                        <div className="p-2.5">
                                            <div className="flex justify-between items-end">
                                                <div className="text-[10px] text-zinc-400 space-y-0.5">
                                                    <p>{order.items.length} items</p>
                                                    <p className="opacity-50 font-mono">{order.id.slice(-6)}</p>
                                                </div>
                                                <div className="font-bold text-base text-white">
                                                    ${order.total.toFixed(2)}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Hover Action */}
                                        <div className="absolute right-1 top-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={(e) => discardHeldOrder(e, order.id)}
                                                className="p-1.5 hover:bg-red-500/20 text-zinc-400 hover:text-red-500 rounded"
                                            >
                                                <Trash2 className="h-3.5 w-3.5" />
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )
                        ) : (
                            activeOrders.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-zinc-600 gap-3 opacity-50">
                                    <ChefHat className="h-10 w-10" />
                                    <p className="text-sm">No active orders</p>
                                </div>
                            ) : (
                                activeOrders.map((order) => (
                                    <div
                                        key={order.id}
                                        onClick={() => resumeActiveOrder(order)}
                                        className="group relative bg-zinc-800 rounded-lg p-0 overflow-hidden cursor-pointer hover:bg-zinc-700 transition-colors border border-zinc-700 hover:border-green-500"
                                    >
                                        {/* Active Order Header */}
                                        <div className="bg-green-900/10 p-2.5 flex justify-between items-center border-b border-zinc-700/50">
                                            <div className="flex items-center gap-2">
                                                <span className="font-mono text-green-500 font-bold">{order.table}</span>
                                                <span className="text-[10px] text-zinc-400 truncate max-w-[100px]">{order.customer}</span>
                                            </div>
                                            <span className="text-[10px] font-mono text-zinc-500">
                                                {order.time}
                                            </span>
                                        </div>

                                        {/* Body */}
                                        <div className="p-2.5">
                                            <div className="flex justify-between items-end">
                                                <div className="text-[10px] text-zinc-400 space-y-0.5">
                                                    <p className="text-green-400/80 uppercase text-[9px] font-bold">Pay Later</p>
                                                    <p className="opacity-50 font-mono">{order.id.slice(-6)}</p>
                                                </div>
                                                <div className="font-bold text-base text-white">
                                                    ${Number(order.total).toFixed(2)}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="h-1 bg-green-900/40 w-full" />
                                    </div>
                                ))
                            )
                        )}
                    </div>
                </div>

                {/* RIGHT SIDE: Open New Tab (Keyboard Input) - FIXED FULL HEIGHT */}
                <div className="flex-1 flex flex-col bg-zinc-50 dark:bg-zinc-900 h-full overflow-hidden relative">
                    {/* Header Bar */}
                    <div className="h-14 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex items-center justify-between px-6 shrink-0">
                        <h1 className="text-base font-semibold text-zinc-800 dark:text-zinc-200">Start New Ticket</h1>
                        <div className="text-xs text-zinc-500">
                            {new Date().toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                        </div>
                    </div>

                    <div className="flex-1 flex flex-col items-center justify-center p-6 lg:p-12 overflow-hidden">
                        {/* Form Area - Centered & Compact */}
                        <div className="w-full max-w-[480px] bg-white dark:bg-zinc-800 rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-700 p-8 flex flex-col">
                            <div className="text-center mb-6">
                                <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-orange-50 dark:bg-zinc-900 text-orange-600 mb-3 ring-1 ring-zinc-100 dark:ring-zinc-700">
                                    <ChefHat className="h-6 w-6" />
                                </div>
                                <h2 className="text-xl font-bold text-zinc-900 dark:text-white">New Order</h2>
                                <p className="text-sm text-zinc-500">Enter details to open a tab</p>
                            </div>

                            <form onSubmit={handleCustomerSubmit} className="space-y-4">
                                {/* Order Type Toggle */}
                                <div className="grid grid-cols-3 gap-2 p-1 bg-zinc-100 dark:bg-zinc-900/50 rounded-lg">
                                    <button
                                        type="button"
                                        onClick={() => setCustomer({ ...customer, orderType: "dine-in" })}
                                        className={cn(
                                            "flex flex-col items-center justify-center gap-1 py-2 rounded-md text-xs font-medium transition-all",
                                            customer.orderType === "dine-in"
                                                ? "bg-white dark:bg-zinc-800 text-orange-600 shadow-sm ring-1 ring-zinc-200 dark:ring-zinc-700"
                                                : "text-zinc-500 hover:bg-zinc-200/50 dark:hover:bg-zinc-800/50"
                                        )}
                                    >
                                        <Utensils className="h-4 w-4" />
                                        Dine-In
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setCustomer({ ...customer, orderType: "takeaway" })}
                                        className={cn(
                                            "flex flex-col items-center justify-center gap-1 py-2 rounded-md text-xs font-medium transition-all",
                                            customer.orderType === "takeaway"
                                                ? "bg-white dark:bg-zinc-800 text-orange-600 shadow-sm ring-1 ring-zinc-200 dark:ring-zinc-700"
                                                : "text-zinc-500 hover:bg-zinc-200/50 dark:hover:bg-zinc-800/50"
                                        )}
                                    >
                                        <ShoppingBag className="h-4 w-4" />
                                        Takeaway
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setCustomer({ ...customer, orderType: "room-service" })}
                                        className={cn(
                                            "flex flex-col items-center justify-center gap-1 py-2 rounded-md text-xs font-medium transition-all",
                                            customer.orderType === "room-service"
                                                ? "bg-white dark:bg-zinc-800 text-orange-600 shadow-sm ring-1 ring-zinc-200 dark:ring-zinc-700"
                                                : "text-zinc-500 hover:bg-zinc-200/50 dark:hover:bg-zinc-800/50"
                                        )}
                                    >
                                        <Home className="h-4 w-4" />
                                        Room
                                    </button>
                                </div>

                                <div className="space-y-1.5">
                                    <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 ml-1">
                                        {customer.orderType === 'dine-in' ? 'Table Number' :
                                            customer.orderType === 'room-service' ? 'Room Number' : 'Order / Token No.'}
                                    </Label>
                                    <div className="relative group">
                                        <MapPin className="absolute left-3 top-3.5 h-4 w-4 text-zinc-400 group-focus-within:text-orange-500 transition-colors pointer-events-none z-10" />

                                        {customer.orderType === 'dine-in' && tables.length > 0 ? (
                                            <div className="relative">
                                                <Select
                                                    value={customer.standNumber}
                                                    onValueChange={(value) => setCustomer({ ...customer, standNumber: value })}
                                                >
                                                    <SelectTrigger className="h-11 w-full pl-10 pr-4 text-base bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-700 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 rounded-lg font-medium transition-all">
                                                        <SelectValue placeholder="Select Table" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {tables.map(table => (
                                                            <SelectItem key={table.id} value={table.name}>
                                                                <span className="font-medium">{table.name}</span>
                                                                <span className="text-zinc-400 ml-2 text-xs">({table.seats} seats)</span>
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        ) : (
                                            <Input
                                                autoFocus
                                                className="h-11 pl-10 text-base bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-700 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 rounded-lg font-medium transition-all"
                                                placeholder={customer.orderType === 'dine-in' ? "e.g. T-4" : customer.orderType === 'room-service' ? "e.g. 104" : "e.g. TA-01"}
                                                value={customer.standNumber}
                                                onChange={(e) => setCustomer({ ...customer, standNumber: e.target.value })}
                                                required
                                            />
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <Label className="text-[10px] font-semibold uppercase tracking-widest text-zinc-500 ml-1">Customer Name</Label>
                                    <div className="relative group">
                                        <User className="absolute left-3 top-3.5 h-4 w-4 text-zinc-400 group-focus-within:text-orange-500 transition-colors" />
                                        <Input
                                            className="h-11 pl-10 text-base bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-700 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 rounded-lg font-medium transition-all"
                                            placeholder="Guest Name"
                                            value={customer.name}
                                            onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <Label className="text-[10px] font-semibold uppercase tracking-widest text-zinc-500 ml-1">Phone (Optional)</Label>
                                    <div className="relative group">
                                        <Phone className="absolute left-3 top-3.5 h-4 w-4 text-zinc-400 group-focus-within:text-orange-500 transition-colors" />
                                        <Input
                                            type="tel"
                                            className="h-11 pl-10 text-base bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-700 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 rounded-lg font-medium transition-all"
                                            placeholder="Mobile Number"
                                            value={customer.phone}
                                            onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <Button
                                    type="submit"
                                    className="w-full h-12 mt-2 text-base font-bold rounded-lg bg-orange-600 hover:bg-orange-700 text-white shadow-lg shadow-orange-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                                >
                                    Start Service &rarr;
                                </Button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // 2. POS Interface
    return (
        <div className="flex flex-col lg:flex-row h-[calc(100vh-6rem)] gap-6">
            {/* LEFT SIDE: Menu Grid */}
            <div className="flex-1 flex flex-col gap-4 overflow-hidden print:hidden">
                {/* Search & Filter */}
                <div className="flex flex-col gap-4 bg-white dark:bg-zinc-900 p-4 rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-800">
                    <div className="flex items-center gap-2 w-full">
                        <Button variant="ghost" size="icon" onClick={() => setViewMode("customer")} title="Back to Customer Details">
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input
                                placeholder="Search menu..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-9 bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700"
                            />
                        </div>

                        {/* Menu Selector */}
                        {menus.length > 0 && (
                            <select
                                value={selectedMenuId}
                                onChange={(e) => setSelectedMenuId(e.target.value)}
                                className="h-10 px-4 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm font-medium text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                            >
                                {menus.filter(m => m.active).map(menu => (
                                    <option key={menu.id} value={menu.id}>
                                        📋 {menu.name}
                                    </option>
                                ))}
                            </select>
                        )}
                    </div>

                    <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
                        {categoryNames.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={cn(
                                    "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors",
                                    selectedCategory === cat
                                        ? "bg-orange-600 text-white"
                                        : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700"
                                )}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Grid */}
                <div className="flex-1 overflow-y-auto pr-2">
                    <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-3 pb-20 lg:pb-0">
                        {filteredItems.map((item) => (
                            <div
                                key={item.id}
                                onClick={() => addToOrder(item)}
                                className="group relative flex flex-col bg-white dark:bg-zinc-900 rounded-lg overflow-hidden shadow-sm border border-zinc-200 dark:border-zinc-800 cursor-pointer hover:border-orange-500 hover:shadow-md transition-all active:scale-[0.98]"
                            >
                                <div className="aspect-square relative">
                                    <Image
                                        src={item.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=300&q=80"}
                                        alt={item.name}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <div className="absolute top-1 right-1 bg-black/60 backdrop-blur-md px-1.5 py-0.5 rounded text-white text-[10px] font-bold">
                                        ${item.price.toFixed(2)}
                                    </div>
                                </div>
                                <div className="p-2">
                                    <h3 className="font-semibold text-xs text-zinc-900 dark:text-zinc-100 truncate">{item.name}</h3>
                                    <p className="text-[10px] text-zinc-500 dark:text-zinc-400">
                                        {categories.find(c => c.id === item.categoryId)?.name || "Unknown"}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* RIGHT SIDE: Order Ticket */}
            <div className="w-full lg:w-96 flex flex-col bg-white dark:bg-zinc-900 rounded-xl shadow-lg border border-zinc-200 dark:border-zinc-800 h-full overflow-hidden print:w-full print:absolute print:inset-0 print:z-50 print:h-auto">
                {/* Header */}
                <div className="p-4 border-b border-zinc-100 dark:border-zinc-800 flex justify-between items-center bg-zinc-50/50 dark:bg-zinc-950/50 print:bg-white">
                    <div>
                        <h2 className="font-bold text-lg bill-header">Order Summary</h2>
                        <h2 className="font-bold text-lg kot-header hidden">KOT Ticket</h2>
                        <div className="text-xs text-zinc-500 flex flex-col customer-info">
                            <span className="font-medium text-zinc-900 dark:text-zinc-100">{customer.name}</span>
                            <span className="capitalize">{customer.orderType.replace("-", " ")} • {customer.standNumber}</span>
                            {customer.phone && <span>{customer.phone}</span>}
                        </div>
                    </div>
                    {!isPaid && (
                        <div className="flex gap-2 print:hidden">
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={holdOrder}
                                title="Hold/Save Order"
                                className="border-yellow-200 bg-yellow-50 text-yellow-700 hover:bg-yellow-100"
                            >
                                <PauseCircle className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="icon" onClick={() => setOrderItems([])}>
                                <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                        </div>
                    )}
                </div>

                {/* Items List */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 print:overflow-visible">
                    {orderItems.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-zinc-400 gap-2 print:hidden">
                            <ChefHat className="h-12 w-12 opacity-20" />
                            <p className="text-sm">No items added</p>
                        </div>
                    ) : (
                        orderItems.map((item) => (
                            <div key={item.id} className="flex items-center gap-3">
                                <div className="relative h-12 w-12 rounded-lg overflow-hidden shrink-0 print:hidden">
                                    <Image src={item.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=300&q=80"} alt={item.name} fill className="object-cover" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-medium text-sm truncate">{item.name}</h4>
                                    <p className="text-xs text-zinc-500 price-column">${(item.price * item.quantity).toFixed(2)}</p>
                                </div>
                                <div className="flex items-center gap-2 bg-zinc-100 dark:bg-zinc-800 rounded-lg p-1 print:bg-transparent">
                                    {!isPaid && (
                                        <button
                                            onClick={(e) => { e.stopPropagation(); updateQuantity(item.id, -1); }}
                                            className="p-1 hover:bg-white dark:hover:bg-zinc-700 rounded transition-colors print:hidden"
                                        >
                                            <Minus className="h-3 w-3" />
                                        </button>
                                    )}
                                    <span className="text-xs font-semibold w-4 text-center">{item.quantity}</span>
                                    {!isPaid && (
                                        <button
                                            onClick={(e) => { e.stopPropagation(); updateQuantity(item.id, 1); }}
                                            className="p-1 hover:bg-white dark:hover:bg-zinc-700 rounded transition-colors print:hidden"
                                        >
                                            <Plus className="h-3 w-3" />
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Footer / Total */}
                <div className="p-4 bg-zinc-50 dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-800 space-y-3 print:bg-white total-section">
                    <div className="space-y-1 text-sm">
                        <div className="flex justify-between text-zinc-500">
                            <span>Subtotal</span>
                            <span>${subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-zinc-500">
                            <span>Tax (10%)</span>
                            <span>${tax.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between font-bold text-lg pt-2 border-t border-zinc-200 dark:border-zinc-800">
                            <span>Total</span>
                            <span>${total.toFixed(2)}</span>
                        </div>
                    </div>

                    <div className="pt-2 print:hidden space-y-3">
                        {/* Notes Section */}
                        {!isPaid && (
                            <div className="space-y-1">
                                <Label htmlFor="orderNotes" className="text-xs text-zinc-500">Cooking Notes / Special Requests</Label>
                                <Textarea
                                    id="orderNotes"
                                    placeholder="e.g. No onions, extra spicy..."
                                    className="h-16 text-xs bg-white dark:bg-zinc-800 resize-none"
                                    value={orderNotes}
                                    onChange={(e) => setOrderNotes(e.target.value)}
                                />
                            </div>
                        )}

                        {/* Payment Info */}
                        <div className="space-y-1">
                            <div className="flex justify-between items-center">
                                <Label htmlFor="payNumber" className="text-xs text-zinc-500">Payment Reference / Number</Label>
                                <button
                                    onClick={() => !isPaid && setPaymentNumber(`TXN-${Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}`)}
                                    className="text-[10px] text-orange-600 hover:text-orange-700 font-medium transition-colors disabled:opacity-50"
                                    disabled={isPaid}
                                >
                                    Regenerate
                                </button>
                            </div>
                            <Input
                                id="payNumber"
                                placeholder="e.g. TXN-123456"
                                className="h-8 text-xs bg-white dark:bg-zinc-800 font-mono"
                                value={paymentNumber}
                                onChange={(e) => setPaymentNumber(e.target.value)}
                                disabled={isPaid}
                            />
                        </div>

                        {!isPaid ? (
                            <>
                                <div className="grid grid-cols-3 gap-2">
                                    <Button
                                        onClick={() => initiatePayment("Cash")}
                                        disabled={orderItems.length === 0}
                                        className="w-full bg-green-600 hover:bg-green-700 text-white gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
                                        size="sm"
                                    >
                                        <Banknote className="h-3.5 w-3.5" />
                                        Cash
                                    </Button>
                                    <Button
                                        onClick={() => initiatePayment("Card")}
                                        disabled={orderItems.length === 0}
                                        className="w-full bg-blue-600 hover:bg-blue-700 text-white gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
                                        size="sm"
                                    >
                                        <CreditCard className="h-3.5 w-3.5" />
                                        Card
                                    </Button>
                                    <Button
                                        onClick={() => initiatePayment("UPI")}
                                        disabled={orderItems.length === 0}
                                        className="w-full bg-purple-600 hover:bg-purple-700 text-white gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
                                        size="sm"
                                    >
                                        <QrCode className="h-3.5 w-3.5" />
                                        UPI
                                    </Button>
                                </div>
                                <Button
                                    onClick={handlePayLater}
                                    disabled={orderItems.length === 0}
                                    className="w-full bg-orange-600 hover:bg-orange-700 text-white gap-2 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
                                >
                                    <ChefHat className="h-4 w-4" />
                                    {activeOrders.some(o => o.id === paymentNumber) ? "Update Order (Add to Bill)" : "Send to Kitchen (Pay Later)"}
                                </Button>
                            </>
                        ) : (
                            <div className="space-y-3">
                                <div className="flex items-center justify-center gap-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 p-2 rounded-lg border border-green-200 dark:border-green-800">
                                    <CheckCircle2 className="h-5 w-5" />
                                    <span className="font-bold">PAID via {paymentMethod}</span>
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                    <Button
                                        className="w-full border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 gap-2"
                                        variant="outline"
                                        size="sm"
                                        onClick={handlePrintKOT}
                                    >
                                        <ChefHat className="h-4 w-4" />
                                        Print KOT
                                    </Button>
                                    <Button
                                        className="w-full bg-zinc-900 dark:bg-zinc-100 text-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-200 gap-2"
                                        size="sm"
                                        onClick={handlePrintBill}
                                    >
                                        <Printer className="h-4 w-4" />
                                        Print Bill
                                    </Button>
                                </div>
                                <Button
                                    className="w-full disabled:opacity-50 disabled:cursor-not-allowed"
                                    variant="ghost"
                                    size="sm"
                                    onClick={handleNewOrder}
                                    disabled={!hasPrinted}
                                    title={!hasPrinted ? "Please print bill or KOT first" : "Start a new order"}
                                >
                                    {!hasPrinted ? "Print to Continue" : "Start New Order"}
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Payment Confirmation Dialog */}
            <Dialog open={paymentDialogOpen} onOpenChange={setPaymentDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Confirm Payment</DialogTitle>
                        <DialogClose onClick={() => setPaymentDialogOpen(false)} />
                    </DialogHeader>

                    <div className="py-6 space-y-6 text-center">
                        <div className="space-y-2">
                            <p className="text-zinc-500">Total Amount Due</p>
                            <p className="text-4xl font-bold">${total.toFixed(2)}</p>
                        </div>

                        <div className="p-4 bg-zinc-50 dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800">
                            {selectedPaymentMethod === "Cash" && (
                                <div className="space-y-3">
                                    <Banknote className="h-8 w-8 mx-auto text-green-600" />
                                    <p className="font-medium">Cash Payment</p>
                                    <Input placeholder="Enter Amount Received" className="text-center" type="number" />
                                    <p className="text-xs text-zinc-500">Please verify cash received before confirming.</p>
                                </div>
                            )}
                            {selectedPaymentMethod === "Card" && (
                                <div className="space-y-3">
                                    <CreditCard className="h-8 w-8 mx-auto text-blue-600" />
                                    <p className="font-medium">Card Payment</p>
                                    <p className="text-sm text-zinc-500">Swipe or insert card on the terminal.</p>
                                    <div className="animate-pulse flex justify-center gap-1">
                                        <div className="h-2 w-2 bg-blue-400 rounded-full"></div>
                                        <div className="h-2 w-2 bg-blue-400 rounded-full animation-delay-75"></div>
                                        <div className="h-2 w-2 bg-blue-400 rounded-full animation-delay-150"></div>
                                    </div>
                                    <p className="text-xs text-zinc-500">Waiting for terminal response...</p>
                                </div>
                            )}
                            {selectedPaymentMethod === "UPI" && (
                                <div className="space-y-3">
                                    <QrCode className="h-8 w-8 mx-auto text-purple-600" />
                                    <p className="font-medium">UPI Payment</p>
                                    <div className="h-32 w-32 bg-white mx-auto border p-2 flex items-center justify-center rounded-lg">
                                        {/* Static Sample QR */}
                                        <img
                                            src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=UPI://pay?pa=mock@upi&pn=Restaurant&am=0&cu=INR"
                                            alt="Scan to Pay"
                                            className="h-full w-full object-contain"
                                        />
                                    </div>
                                    <p className="text-sm text-zinc-500">Scan QR code to pay</p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <Button
                            variant="outline"
                            className="w-full"
                            onClick={() => setPaymentDialogOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            className={cn(
                                "w-full text-white",
                                selectedPaymentMethod === "Cash" ? "bg-green-600 hover:bg-green-700" :
                                    selectedPaymentMethod === "Card" ? "bg-blue-600 hover:bg-blue-700" :
                                        "bg-purple-600 hover:bg-purple-700"
                            )}
                            onClick={confirmPayment}
                        >
                            Confirm {selectedPaymentMethod}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Print Styles */}
            <style jsx global>{`
                @media print {
                    body * {
                        visibility: hidden;
                    }
                    .print\\:w-full, .print\\:w-full * {
                        visibility: visible;
                    }
                    .print\\:w-full {
                        position: absolute;
                        left: 0;
                        top: 0;
                        width: 100%;
                    }
                    .print\\:hidden {
                        display: none !important;
                    }
                    .print\\:bg-white {
                         background-color: white !important;
                    }
                    .print\\:bg-transparent {
                        background-color: transparent !important;
                    }
                    .print\\:overflow-visible {
                        overflow: visible !important;
                    }
                }
            `}</style>
        </div >
    );
}

export default function RestaurantPOSPage() {
    return (
        <Suspense fallback={<div className="h-screen w-full flex items-center justify-center">Loading POS...</div>}>
            <POSContent />
        </Suspense>
    );
}
