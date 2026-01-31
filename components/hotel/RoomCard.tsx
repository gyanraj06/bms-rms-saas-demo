"use client";

import React, { useState } from "react";
import {
    Users,
    Maximize2,
    IndianRupee,
    MoreVertical,
    Edit,
    Trash2,
    ChevronLeft,
    ChevronRight,
    CheckCircle2,
    XCircle,
    Wrench,
    RefreshCw,
    Image as ImageIcon,
    Wifi,
    AirVent,
    Tv,
    Car,
    Coffee,
    Bath,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import type { Room } from "@/app/dashboard/rooms/page";

interface RoomCardProps {
    room: Room;
    onEdit: () => void;
    onDelete: () => void;
    onStatusChange: (status: Room["status"]) => void;
}

// Room type colors
const ROOM_TYPE_COLORS: Record<Room["type"], string> = {
    standard: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
    deluxe: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    suite: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
    family: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    presidential: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
};

// Status colors
const STATUS_CONFIG: Record<Room["status"], { bg: string; text: string; icon: React.ElementType; label: string }> = {
    available: { bg: "bg-emerald-100 dark:bg-emerald-900/30", text: "text-emerald-700 dark:text-emerald-400", icon: CheckCircle2, label: "Available" },
    occupied: { bg: "bg-red-100 dark:bg-red-900/30", text: "text-red-700 dark:text-red-400", icon: XCircle, label: "Occupied" },
    maintenance: { bg: "bg-orange-100 dark:bg-orange-900/30", text: "text-orange-700 dark:text-orange-400", icon: Wrench, label: "Maintenance" },
    cleaning: { bg: "bg-blue-100 dark:bg-blue-900/30", text: "text-blue-700 dark:text-blue-400", icon: RefreshCw, label: "Cleaning" },
};

// Amenity icons
const AMENITY_ICONS: Record<string, React.ElementType> = {
    "WiFi": Wifi,
    "AC": AirVent,
    "TV": Tv,
    "Parking": Car,
    "Coffee Maker": Coffee,
    "Bathtub": Bath,
};

export function RoomCard({ room, onEdit, onDelete, onStatusChange }: RoomCardProps) {
    const [photoIndex, setPhotoIndex] = useState(0);
    const StatusIcon = STATUS_CONFIG[room.status].icon;

    const nextPhoto = () => {
        if (room.photos.length > 0) {
            setPhotoIndex((prev) => (prev + 1) % room.photos.length);
        }
    };

    const prevPhoto = () => {
        if (room.photos.length > 0) {
            setPhotoIndex((prev) => (prev - 1 + room.photos.length) % room.photos.length);
        }
    };

    return (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden group hover:shadow-lg transition-shadow">
            {/* Photo Carousel */}
            <div className="relative aspect-[16/10] bg-slate-100 dark:bg-slate-800">
                {room.photos.length > 0 ? (
                    <>
                        <img
                            src={room.photos[photoIndex]}
                            alt={room.name}
                            className="w-full h-full object-cover"
                        />
                        {room.photos.length > 1 && (
                            <>
                                <button
                                    onClick={prevPhoto}
                                    className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
                                >
                                    <ChevronLeft className="h-4 w-4" />
                                </button>
                                <button
                                    onClick={nextPhoto}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
                                >
                                    <ChevronRight className="h-4 w-4" />
                                </button>
                                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                                    {room.photos.map((_, i) => (
                                        <div
                                            key={i}
                                            className={cn(
                                                "w-1.5 h-1.5 rounded-full transition-colors",
                                                i === photoIndex ? "bg-white" : "bg-white/50"
                                            )}
                                        />
                                    ))}
                                </div>
                            </>
                        )}
                    </>
                ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 dark:text-slate-600">
                        <ImageIcon className="h-10 w-10 mb-2" />
                        <span className="text-xs">No photos</span>
                    </div>
                )}

                {/* Type Badge */}
                <div className={cn(
                    "absolute top-3 left-3 px-2 py-1 rounded-md text-xs font-medium capitalize",
                    ROOM_TYPE_COLORS[room.type]
                )}>
                    {room.type}
                </div>

                {/* Status Badge */}
                <div className={cn(
                    "absolute top-3 right-3 px-2 py-1 rounded-md text-xs font-medium flex items-center gap-1",
                    STATUS_CONFIG[room.status].bg,
                    STATUS_CONFIG[room.status].text
                )}>
                    <StatusIcon className="h-3 w-3" />
                    {STATUS_CONFIG[room.status].label}
                </div>
            </div>

            {/* Content */}
            <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                    <div>
                        <h3 className="font-semibold text-slate-900 dark:text-white">
                            {room.name}
                        </h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            Room #{room.roomNumber} • Floor {room.floor}
                        </p>
                    </div>
                    <DropdownMenu>
                        <DropdownMenuTrigger className="h-8 w-8 p-0 border-none outline-none focus:ring-0">
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreVertical className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-48 mr-4">
                            <DropdownMenuItem onClick={onEdit}>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit Room
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => onStatusChange("available")}>
                                <CheckCircle2 className="h-4 w-4 mr-2 text-emerald-500" />
                                Mark Available
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onStatusChange("occupied")}>
                                <XCircle className="h-4 w-4 mr-2 text-red-500" />
                                Mark Occupied
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onStatusChange("maintenance")}>
                                <Wrench className="h-4 w-4 mr-2 text-orange-500" />
                                Mark Maintenance
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onStatusChange("cleaning")}>
                                <RefreshCw className="h-4 w-4 mr-2 text-blue-500" />
                                Mark Cleaning
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={onDelete} className="text-red-600 dark:text-red-400">
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete Room
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                {/* Quick Info */}
                <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400 mb-3">
                    <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        <span>{room.capacity.adults + room.capacity.children}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Maximize2 className="h-4 w-4" />
                        <span>{room.size} sq ft</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <IndianRupee className="h-4 w-4" />
                        <span className="font-medium text-slate-900 dark:text-white">
                            {room.basePrice.toLocaleString()}
                        </span>
                        <span className="text-xs">/night</span>
                    </div>
                </div>

                {/* Amenities */}
                <div className="flex flex-wrap gap-2">
                    {room.amenities.slice(0, 4).map((amenity) => {
                        const Icon = AMENITY_ICONS[amenity];
                        return (
                            <div
                                key={amenity}
                                className="flex items-center gap-1 px-2 py-1 rounded-md bg-slate-50 dark:bg-slate-800 text-xs text-slate-600 dark:text-slate-400"
                                title={amenity}
                            >
                                {Icon && <Icon className="h-3 w-3" />}
                                <span>{amenity}</span>
                            </div>
                        );
                    })}
                    {room.amenities.length > 4 && (
                        <div className="px-2 py-1 rounded-md bg-slate-50 dark:bg-slate-800 text-xs text-slate-500">
                            +{room.amenities.length - 4} more
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
