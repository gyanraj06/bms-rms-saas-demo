"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
    Store,
    Bell,
    Settings as SettingsIcon,
    LayoutGrid,
    Plus,
    Trash2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState<"general" | "tables">("general");

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
                <p className="text-gray-500 dark:text-gray-400">Manage your restaurant preferences.</p>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 border-b border-zinc-200 dark:border-zinc-800">
                <button
                    onClick={() => setActiveTab("general")}
                    className={cn(
                        "px-4 py-2 text-sm font-medium border-b-2 transition-colors",
                        activeTab === "general"
                            ? "border-orange-600 text-orange-600"
                            : "border-transparent text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
                    )}
                >
                    General Settings
                </button>
                <button
                    onClick={() => setActiveTab("tables")}
                    className={cn(
                        "px-4 py-2 text-sm font-medium border-b-2 transition-colors",
                        activeTab === "tables"
                            ? "border-orange-600 text-orange-600"
                            : "border-transparent text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
                    )}
                >
                    Table Management
                </button>
            </div>

            {/* Tab Content */}
            {activeTab === "general" && <GeneralSettings />}
            {activeTab === "tables" && <TableSettings />}
        </div>
    );
}

function GeneralSettings() {
    return (
        <div className="space-y-6">
            {/* Restaurant Profile */}
            <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-800 p-6">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
                        <Store className="h-5 w-5 text-orange-600 dark:text-orange-500" />
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Restaurant Profile</h2>
                        <p className="text-sm text-gray-500">Update your restaurant information</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Restaurant Name</label>
                        <Input defaultValue="The Spice Route" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Contact Email</label>
                        <Input type="email" defaultValue="contact@spiceroute.com" />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Address</label>
                        <Input defaultValue="123 Main Street, City, State 12345" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Phone Number</label>
                        <Input defaultValue="+1 (555) 123-4567" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Tax Rate (%)</label>
                        <Input type="number" defaultValue="8.5" />
                    </div>
                </div>

                <div className="flex justify-end gap-2 mt-6 pt-4 border-t border-zinc-200 dark:border-zinc-800">
                    <Button variant="outline">Cancel</Button>
                    <Button className="bg-orange-600 hover:bg-orange-700">Save Changes</Button>
                </div>
            </div>

            {/* Notifications */}
            <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-800 p-6">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                        <Bell className="h-5 w-5 text-blue-600 dark:text-blue-500" />
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Notifications</h2>
                        <p className="text-sm text-gray-500">Configure your notification preferences</p>
                    </div>
                </div>

                <div className="space-y-4">
                    {[
                        { label: "New Order Alerts", desc: "Get notified when new orders arrive" },
                        { label: "Low Stock Warnings", desc: "Alert when inventory is running low" },
                        { label: "Daily Reports", desc: "Receive end-of-day sales summary" },
                    ].map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between p-4 rounded-lg border border-zinc-200 dark:border-zinc-800">
                            <div>
                                <div className="font-medium text-gray-900 dark:text-white">{item.label}</div>
                                <div className="text-sm text-gray-500">{item.desc}</div>
                            </div>
                            <div className="w-11 h-6 bg-orange-600 rounded-full p-1 cursor-pointer">
                                <div className="w-4 h-4 bg-white rounded-full translate-x-5 transition-transform" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

function TableSettings() {
    const router = useRouter();
    const [tables, setTables] = useState<any[]>([]);
    const [newTable, setNewTable] = useState({ name: "", seats: 4, shape: "square" });
    const [isAddOpen, setIsAddOpen] = useState(false);

    useEffect(() => {
        const saved = localStorage.getItem("restaurant_tables");
        if (saved) {
            setTables(JSON.parse(saved));
        } else {
            // Defaults
            const defaults = [
                { id: "t1", name: "Table 1", seats: 4, shape: "square" },
                { id: "t2", name: "Table 2", seats: 4, shape: "square" },
                { id: "t3", name: "Table 3", seats: 6, shape: "rectangle" },
                { id: "t4", name: "Table 4", seats: 2, shape: "circle" },
            ];
            setTables(defaults);
            localStorage.setItem("restaurant_tables", JSON.stringify(defaults));
        }
    }, []);

    const saveTables = (newTables: any[]) => {
        setTables(newTables);
        localStorage.setItem("restaurant_tables", JSON.stringify(newTables));
        // Dispatch storage event so POS updates if open
        window.dispatchEvent(new Event("storage"));
    };

    const addTable = () => {
        if (!newTable.name) return;
        const table = {
            id: `t-${Date.now()}`,
            ...newTable
        };
        saveTables([...tables, table]);
        setIsAddOpen(false);
        setNewTable({ name: "", seats: 4, shape: "square" });
    };

    const deleteTable = (id: string) => {
        if (confirm("Delete this table?")) {
            saveTables(tables.filter(t => t.id !== id));
        }
    };

    const goToPos = (tableName: string) => {
        router.push(`/restaurant/pos?table=${encodeURIComponent(tableName)}`);
    };

    return (
        <div className="space-y-6">
            <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-800 p-6">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                            <LayoutGrid className="h-5 w-5 text-green-600 dark:text-green-500" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Table Management</h2>
                            <p className="text-sm text-gray-500">Configure your restaurant layout</p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        {isAddOpen ? (
                            <div className="flex items-center gap-2 bg-zinc-50 dark:bg-zinc-800 p-2 rounded-lg border border-zinc-200 dark:border-zinc-700 animate-in fade-in slide-in-from-right-5">
                                <Input
                                    placeholder="Name (e.g. T-5)"
                                    className="h-9 w-32"
                                    value={newTable.name}
                                    onChange={e => setNewTable({ ...newTable, name: e.target.value })}
                                />
                                <Input
                                    type="number"
                                    className="h-9 w-20"
                                    value={newTable.seats}
                                    onChange={e => setNewTable({ ...newTable, seats: parseInt(e.target.value) || 2 })}
                                />
                                <select
                                    className="h-9 rounded-md border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-sm"
                                    value={newTable.shape}
                                    onChange={e => setNewTable({ ...newTable, shape: e.target.value })}
                                >
                                    <option value="square">Square</option>
                                    <option value="circle">Circle</option>
                                    <option value="rectangle">Rectangle</option>
                                </select>
                                <Button size="sm" onClick={addTable} className="bg-green-600 hover:bg-green-700">Save</Button>
                                <Button size="sm" variant="ghost" onClick={() => setIsAddOpen(false)}>Cancel</Button>
                            </div>
                        ) : (
                            <Button onClick={() => setIsAddOpen(true)} className="bg-orange-600 hover:bg-orange-700">
                                <Plus className="h-4 w-4 mr-2" />
                                Add Table
                            </Button>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {tables.map(table => (
                        <div key={table.id} className="group relative p-4 border border-zinc-200 dark:border-zinc-800 rounded-lg flex flex-col gap-3 hover:border-orange-500 transition-colors bg-zinc-50/50 dark:bg-zinc-900/50">
                            <div className="flex items-start justify-between">
                                <div className="flex items-center gap-3">

                                    <div>
                                        <h3 className="font-medium text-gray-900 dark:text-white">{table.name}</h3>
                                        <p className="text-xs text-gray-500">{table.seats} Seats • {table.shape}</p>
                                    </div>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => deleteTable(table.id)}
                                    className="text-zinc-400 hover:text-red-500 -mt-2 -mr-2"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>

                            <Button
                                className="w-full mt-2 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-700 hover:bg-orange-50 dark:hover:bg-orange-900/10 hover:border-orange-200 dark:hover:border-orange-800"
                                onClick={() => goToPos(table.name)}
                            >
                                Start Order &rarr;
                            </Button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
