"use client";

import React, { useState, useEffect } from "react";
import {
    BedDouble,
    Plus,
    Search,
    Filter,
    Users,
    Maximize2,
    IndianRupee,
    Wifi,
    AirVent,
    Tv,
    Car,
    Coffee,
    Bath,
    RefreshCw,
    Wrench,
    CheckCircle2,
    XCircle,
    MoreVertical,
    Edit,
    Trash2,
    ChevronLeft,
    ChevronRight,
    X,
    Image as ImageIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { RoomForm } from "@/components/hotel/RoomForm";
import { RoomCard } from "@/components/hotel/RoomCard";

// Room interface
export interface Room {
    id: string;
    name: string;
    roomNumber: string;
    floor: number;
    type: "standard" | "deluxe" | "suite" | "family" | "presidential";
    basePrice: number;
    weekendPrice?: number;
    capacity: {
        adults: number;
        children: number;
        extraBeds: number;
    };
    size: number; // sq ft
    bedType: "single" | "double" | "queen" | "king" | "twin";
    view: "city" | "garden" | "pool" | "mountain" | "sea" | "none";
    amenities: string[];
    photos: string[]; // base64 images
    status: "available" | "occupied" | "maintenance" | "cleaning";
    description: string;
    createdAt: number;
}

// Amenity icons mapping
export const AMENITY_ICONS: Record<string, React.ElementType> = {
    "WiFi": Wifi,
    "AC": AirVent,
    "TV": Tv,
    "Parking": Car,
    "Coffee Maker": Coffee,
    "Bathtub": Bath,
};

// Room type colors
const ROOM_TYPE_COLORS: Record<Room["type"], string> = {
    standard: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
    deluxe: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    suite: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
    family: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    presidential: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
};

// Status colors
const STATUS_COLORS: Record<Room["status"], { bg: string; text: string; icon: React.ElementType }> = {
    available: { bg: "bg-emerald-100 dark:bg-emerald-900/30", text: "text-emerald-700 dark:text-emerald-400", icon: CheckCircle2 },
    occupied: { bg: "bg-red-100 dark:bg-red-900/30", text: "text-red-700 dark:text-red-400", icon: XCircle },
    maintenance: { bg: "bg-orange-100 dark:bg-orange-900/30", text: "text-orange-700 dark:text-orange-400", icon: Wrench },
    cleaning: { bg: "bg-blue-100 dark:bg-blue-900/30", text: "text-blue-700 dark:text-blue-400", icon: RefreshCw },
};

// Demo room data
const DEMO_ROOMS: Room[] = [
    {
        id: "RM-001",
        name: "Comfort Standard Room",
        roomNumber: "101",
        floor: 1,
        type: "standard",
        basePrice: 2500,
        weekendPrice: 3000,
        capacity: { adults: 2, children: 1, extraBeds: 1 },
        size: 250,
        bedType: "double",
        view: "city",
        amenities: ["WiFi", "AC", "TV", "Coffee Maker"],
        photos: [],
        status: "available",
        description: "Cozy standard room with modern amenities and city views.",
        createdAt: Date.now() - 30 * 86400000,
    },
    {
        id: "RM-002",
        name: "Deluxe Garden View",
        roomNumber: "201",
        floor: 2,
        type: "deluxe",
        basePrice: 4000,
        weekendPrice: 4800,
        capacity: { adults: 2, children: 2, extraBeds: 1 },
        size: 350,
        bedType: "queen",
        view: "garden",
        amenities: ["WiFi", "AC", "TV", "Coffee Maker", "Bathtub", "Parking"],
        photos: [],
        status: "occupied",
        description: "Spacious deluxe room overlooking our beautiful garden.",
        createdAt: Date.now() - 25 * 86400000,
    },
    {
        id: "RM-003",
        name: "Executive Suite",
        roomNumber: "301",
        floor: 3,
        type: "suite",
        basePrice: 7500,
        weekendPrice: 9000,
        capacity: { adults: 2, children: 2, extraBeds: 2 },
        size: 500,
        bedType: "king",
        view: "pool",
        amenities: ["WiFi", "AC", "TV", "Coffee Maker", "Bathtub", "Parking"],
        photos: [],
        status: "available",
        description: "Luxurious suite with separate living area and pool view.",
        createdAt: Date.now() - 20 * 86400000,
    },
    {
        id: "RM-004",
        name: "Family Deluxe Room",
        roomNumber: "202",
        floor: 2,
        type: "family",
        basePrice: 5500,
        weekendPrice: 6500,
        capacity: { adults: 4, children: 3, extraBeds: 2 },
        size: 450,
        bedType: "twin",
        view: "garden",
        amenities: ["WiFi", "AC", "TV", "Coffee Maker", "Bathtub"],
        photos: [],
        status: "cleaning",
        description: "Perfect for families with spacious layout and extra beds.",
        createdAt: Date.now() - 15 * 86400000,
    },
    {
        id: "RM-005",
        name: "Presidential Suite",
        roomNumber: "501",
        floor: 5,
        type: "presidential",
        basePrice: 15000,
        weekendPrice: 18000,
        capacity: { adults: 4, children: 2, extraBeds: 2 },
        size: 800,
        bedType: "king",
        view: "city",
        amenities: ["WiFi", "AC", "TV", "Coffee Maker", "Bathtub", "Parking"],
        photos: [],
        status: "available",
        description: "Our finest accommodation with panoramic city views and premium amenities.",
        createdAt: Date.now() - 10 * 86400000,
    },
    {
        id: "RM-006",
        name: "Standard Twin Room",
        roomNumber: "102",
        floor: 1,
        type: "standard",
        basePrice: 2800,
        weekendPrice: 3200,
        capacity: { adults: 2, children: 0, extraBeds: 0 },
        size: 280,
        bedType: "twin",
        view: "none",
        amenities: ["WiFi", "AC", "TV"],
        photos: [],
        status: "maintenance",
        description: "Twin bedded room ideal for business travelers.",
        createdAt: Date.now() - 5 * 86400000,
    },
];

const STORAGE_KEY = "hotel_rooms";

export default function RoomsPage() {
    const [rooms, setRooms] = useState<Room[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [filterType, setFilterType] = useState<Room["type"] | "all">("all");
    const [filterStatus, setFilterStatus] = useState<Room["status"] | "all">("all");
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingRoom, setEditingRoom] = useState<Room | null>(null);

    // Load rooms from localStorage
    useEffect(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            try {
                setRooms(JSON.parse(stored));
            } catch {
                setRooms(DEMO_ROOMS);
                localStorage.setItem(STORAGE_KEY, JSON.stringify(DEMO_ROOMS));
            }
        } else {
            setRooms(DEMO_ROOMS);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(DEMO_ROOMS));
        }
        setIsLoading(false);
    }, []);

    const saveRooms = (newRooms: Room[]) => {
        setRooms(newRooms);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newRooms));
    };

    const handleAddRoom = (roomData: Omit<Room, "id" | "createdAt">) => {
        const newRoom: Room = {
            ...roomData,
            id: `RM-${String(rooms.length + 1).padStart(3, "0")}`,
            createdAt: Date.now(),
        };
        saveRooms([newRoom, ...rooms]);
        setIsFormOpen(false);
    };

    const handleEditRoom = (roomData: Omit<Room, "id" | "createdAt">) => {
        if (!editingRoom) return;
        const updated = rooms.map((r) =>
            r.id === editingRoom.id ? { ...r, ...roomData } : r
        );
        saveRooms(updated);
        setEditingRoom(null);
        setIsFormOpen(false);
    };

    const handleDeleteRoom = (roomId: string) => {
        if (confirm("Are you sure you want to delete this room?")) {
            saveRooms(rooms.filter((r) => r.id !== roomId));
        }
    };

    const handleStatusChange = (roomId: string, status: Room["status"]) => {
        saveRooms(rooms.map((r) => (r.id === roomId ? { ...r, status } : r)));
    };

    const openEditForm = (room: Room) => {
        setEditingRoom(room);
        setIsFormOpen(true);
    };

    // Filter rooms
    const filteredRooms = rooms.filter((room) => {
        const matchesSearch =
            room.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            room.roomNumber.includes(searchQuery);
        const matchesType = filterType === "all" || room.type === filterType;
        const matchesStatus = filterStatus === "all" || room.status === filterStatus;
        return matchesSearch && matchesType && matchesStatus;
    });

    // Stats
    const stats = {
        total: rooms.length,
        available: rooms.filter((r) => r.status === "available").length,
        occupied: rooms.filter((r) => r.status === "occupied").length,
        maintenance: rooms.filter((r) => r.status === "maintenance" || r.status === "cleaning").length,
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900 dark:border-white" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">
                        Room Management
                    </h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                        Manage your property rooms, amenities, and availability
                    </p>
                </div>
                <Button
                    onClick={() => {
                        setEditingRoom(null);
                        setIsFormOpen(true);
                    }}
                    className="bg-slate-900 hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
                >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Room
                </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: "Total Rooms", value: stats.total, icon: BedDouble, color: "text-slate-600 dark:text-slate-400" },
                    { label: "Available", value: stats.available, icon: CheckCircle2, color: "text-emerald-600 dark:text-emerald-400" },
                    { label: "Occupied", value: stats.occupied, icon: Users, color: "text-red-600 dark:text-red-400" },
                    { label: "Maintenance", value: stats.maintenance, icon: Wrench, color: "text-orange-600 dark:text-orange-400" },
                ].map((stat) => (
                    <div
                        key={stat.label}
                        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4"
                    >
                        <div className="flex items-center gap-3">
                            <div className={cn("p-2 rounded-lg bg-slate-50 dark:bg-slate-800", stat.color)}>
                                <stat.icon className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-2xl font-semibold text-slate-900 dark:text-white">
                                    {stat.value}
                                </p>
                                <p className="text-xs text-slate-500 dark:text-slate-400">{stat.label}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Search & Filter */}
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                        placeholder="Search by room name or number..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                    />
                </div>
                <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value as Room["type"] | "all")}
                    className="h-10 px-3 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-sm"
                >
                    <option value="all">All Types</option>
                    <option value="standard">Standard</option>
                    <option value="deluxe">Deluxe</option>
                    <option value="suite">Suite</option>
                    <option value="family">Family</option>
                    <option value="presidential">Presidential</option>
                </select>
                <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value as Room["status"] | "all")}
                    className="h-10 px-3 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-sm"
                >
                    <option value="all">All Status</option>
                    <option value="available">Available</option>
                    <option value="occupied">Occupied</option>
                    <option value="maintenance">Maintenance</option>
                    <option value="cleaning">Cleaning</option>
                </select>
            </div>

            {/* Room Grid */}
            {filteredRooms.length === 0 ? (
                <div className="text-center py-12 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
                    <BedDouble className="h-12 w-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
                    <p className="text-slate-500 dark:text-slate-400">No rooms found</p>
                    <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">
                        Try adjusting your search or filters
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {filteredRooms.map((room) => (
                        <RoomCard
                            key={room.id}
                            room={room}
                            onEdit={() => openEditForm(room)}
                            onDelete={() => handleDeleteRoom(room.id)}
                            onStatusChange={(status) => handleStatusChange(room.id, status)}
                        />
                    ))}
                </div>
            )}

            {/* Add/Edit Room Dialog */}
            <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>
                            {editingRoom ? "Edit Room" : "Add New Room"}
                        </DialogTitle>
                    </DialogHeader>
                    <RoomForm
                        initialData={editingRoom}
                        onSubmit={editingRoom ? handleEditRoom : handleAddRoom}
                        onCancel={() => {
                            setIsFormOpen(false);
                            setEditingRoom(null);
                        }}
                    />
                </DialogContent>
            </Dialog>
        </div>
    );
}
