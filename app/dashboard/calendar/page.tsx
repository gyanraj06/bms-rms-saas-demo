"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
    ChevronLeft,
    ChevronRight,
    CalendarDays,
    BedDouble,
    User,
    Clock,
    LogIn,
    LogOut,
    Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Booking } from "@/app/dashboard/bookings/page";

// Room configuration
const ROOMS = [
    // Standard rooms
    { number: "101", type: "standard", floor: 1 },
    { number: "102", type: "standard", floor: 1 },
    { number: "103", type: "standard", floor: 1 },
    { number: "104", type: "standard", floor: 1 },
    { number: "105", type: "standard", floor: 1 },
    // Deluxe rooms
    { number: "201", type: "deluxe", floor: 2 },
    { number: "202", type: "deluxe", floor: 2 },
    { number: "203", type: "deluxe", floor: 2 },
    { number: "204", type: "deluxe", floor: 2 },
    { number: "205", type: "deluxe", floor: 2 },
    { number: "301", type: "deluxe", floor: 3 },
    { number: "302", type: "deluxe", floor: 3 },
    { number: "303", type: "deluxe", floor: 3 },
    { number: "304", type: "deluxe", floor: 3 },
    { number: "305", type: "deluxe", floor: 3 },
    // Suite rooms
    { number: "401", type: "suite", floor: 4 },
    { number: "402", type: "suite", floor: 4 },
    { number: "403", type: "suite", floor: 4 },
    { number: "501", type: "suite", floor: 5 },
    { number: "502", type: "suite", floor: 5 },
    { number: "503", type: "suite", floor: 5 },
    // Family rooms
    { number: "601", type: "family", floor: 6 },
    { number: "602", type: "family", floor: 6 },
    { number: "603", type: "family", floor: 6 },
    // Presidential
    { number: "701", type: "presidential", floor: 7 },
];

const ROOM_TYPE_STYLES = {
    standard: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
    deluxe: "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300",
    suite: "bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300",
    family: "bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300",
    presidential: "bg-gradient-to-r from-amber-200 to-yellow-200 text-amber-800 dark:from-amber-900/70 dark:to-yellow-900/70 dark:text-amber-200",
};

const STATUS_COLORS = {
    confirmed: "bg-blue-500",
    checked_in: "bg-emerald-500",
    checked_out: "bg-slate-400",
    cancelled: "bg-red-400",
};

interface CalendarDay {
    date: Date;
    dateStr: string;
    isToday: boolean;
    isWeekend: boolean;
}

export default function CalendarPage() {
    const router = useRouter();
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [startDate, setStartDate] = useState(() => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        // Start from beginning of current week (Monday)
        const day = today.getDay();
        const diff = today.getDate() - day + (day === 0 ? -6 : 1);
        return new Date(today.setDate(diff));
    });
    const [hoveredBooking, setHoveredBooking] = useState<Booking | null>(null);
    const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

    // Load bookings from localStorage
    useEffect(() => {
        const saved = localStorage.getItem("hotel_bookings");
        if (saved) {
            setBookings(JSON.parse(saved));
        }
    }, []);

    // Generate 14 days from start date
    const days: CalendarDay[] = useMemo(() => {
        const result: CalendarDay[] = [];
        for (let i = 0; i < 14; i++) {
            const date = new Date(startDate);
            date.setDate(startDate.getDate() + i);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            result.push({
                date,
                dateStr: date.toISOString().split("T")[0],
                isToday: date.getTime() === today.getTime(),
                isWeekend: date.getDay() === 0 || date.getDay() === 6,
            });
        }
        return result;
    }, [startDate]);

    // Navigation functions
    const goToPreviousWeek = () => {
        const newStart = new Date(startDate);
        newStart.setDate(startDate.getDate() - 7);
        setStartDate(newStart);
    };

    const goToNextWeek = () => {
        const newStart = new Date(startDate);
        newStart.setDate(startDate.getDate() + 7);
        setStartDate(newStart);
    };

    const goToToday = () => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const day = today.getDay();
        const diff = today.getDate() - day + (day === 0 ? -6 : 1);
        setStartDate(new Date(today.setDate(diff)));
    };

    // Get booking for a specific room and date
    const getBookingForCell = (roomNumber: string, dateStr: string) => {
        return bookings.find((b) => {
            if (b.roomNumber !== roomNumber) return false;
            if (b.status === "cancelled") return false;
            return dateStr >= b.checkIn && dateStr < b.checkOut;
        });
    };

    // Check if this is the start of a booking
    const isBookingStart = (booking: Booking, dateStr: string) => {
        return booking.checkIn === dateStr;
    };

    // Calculate booking span (how many visible days)
    const getBookingSpan = (booking: Booking, startDateStr: string) => {
        const bookingStart = new Date(booking.checkIn);
        const bookingEnd = new Date(booking.checkOut);
        const visibleStart = new Date(startDateStr);
        const visibleEnd = new Date(days[days.length - 1].dateStr);
        visibleEnd.setDate(visibleEnd.getDate() + 1);

        const effectiveStart = bookingStart > visibleStart ? bookingStart : visibleStart;
        const effectiveEnd = bookingEnd < visibleEnd ? bookingEnd : visibleEnd;

        const diffTime = effectiveEnd.getTime() - effectiveStart.getTime();
        return Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
    };

    // Get initials from guest name
    const getInitials = (name: string) => {
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);
    };

    // Format date for display
    const formatDate = (date: Date) => {
        return date.toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
        });
    };

    const formatDayName = (date: Date) => {
        return date.toLocaleDateString("en-IN", { weekday: "short" });
    };

    // Handle tooltip positioning
    const handleBookingHover = (
        e: React.MouseEvent,
        booking: Booking | null
    ) => {
        if (booking) {
            setTooltipPosition({ x: e.clientX, y: e.clientY });
            setHoveredBooking(booking);
        } else {
            setHoveredBooking(null);
        }
    };

    // Calculate stats
    const stats = useMemo(() => {
        const today = new Date().toISOString().split("T")[0];
        const activeBookings = bookings.filter(
            (b) => b.status !== "cancelled" && b.checkIn <= today && b.checkOut > today
        );
        const occupiedRooms = new Set(activeBookings.map((b) => b.roomNumber));
        const checkingInToday = bookings.filter((b) => b.checkIn === today && b.status === "confirmed");
        const checkingOutToday = bookings.filter((b) => b.checkOut === today && b.status === "checked_in");

        return {
            totalRooms: ROOMS.length,
            occupiedRooms: occupiedRooms.size,
            availableRooms: ROOMS.length - occupiedRooms.size,
            occupancyRate: Math.round((occupiedRooms.size / ROOMS.length) * 100),
            checkingInToday: checkingInToday.length,
            checkingOutToday: checkingOutToday.length,
        };
    }, [bookings]);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-serif text-gray-900 dark:text-white">
                        Room Calendar
                    </h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                        View and manage room availability
                    </p>
                </div>

                {/* Navigation Controls */}
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={goToPreviousWeek}>
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={goToToday}>
                        Today
                    </Button>
                    <Button variant="outline" size="sm" onClick={goToNextWeek}>
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                    <div className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                        {formatDate(days[0].date)} — {formatDate(days[days.length - 1].date)}
                    </div>
                    <div className="ml-auto">
                        <Button
                            onClick={() => router.push("/dashboard/bookings?tab=new")}
                            className="gap-2"
                        >
                            <Plus className="h-4 w-4" />
                            New Booking
                        </Button>
                    </div>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-black p-4">
                    <div className="flex items-center gap-3">
                        <div className="rounded-lg bg-emerald-50 dark:bg-emerald-950/50 p-2">
                            <BedDouble className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Available</p>
                            <p className="text-lg font-bold text-gray-900 dark:text-white">
                                {stats.availableRooms} <span className="text-xs font-normal text-gray-400">/ {stats.totalRooms}</span>
                            </p>
                        </div>
                    </div>
                </div>
                <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-black p-4">
                    <div className="flex items-center gap-3">
                        <div className="rounded-lg bg-blue-50 dark:bg-blue-950/50 p-2">
                            <User className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Occupancy</p>
                            <p className="text-lg font-bold text-gray-900 dark:text-white">
                                {stats.occupancyRate}%
                            </p>
                        </div>
                    </div>
                </div>
                <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-black p-4">
                    <div className="flex items-center gap-3">
                        <div className="rounded-lg bg-amber-50 dark:bg-amber-950/50 p-2">
                            <LogIn className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Check-ins Today</p>
                            <p className="text-lg font-bold text-gray-900 dark:text-white">
                                {stats.checkingInToday}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-black p-4">
                    <div className="flex items-center gap-3">
                        <div className="rounded-lg bg-purple-50 dark:bg-purple-950/50 p-2">
                            <LogOut className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Check-outs Today</p>
                            <p className="text-lg font-bold text-gray-900 dark:text-white">
                                {stats.checkingOutToday}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Legend */}
            <div className="flex flex-wrap items-center gap-4 text-xs">
                <span className="text-gray-500 dark:text-gray-400 font-medium">Status:</span>
                <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-sm bg-emerald-500" />
                    <span className="text-gray-600 dark:text-gray-400">Checked In</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-sm bg-blue-500" />
                    <span className="text-gray-600 dark:text-gray-400">Confirmed</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-sm bg-slate-400" />
                    <span className="text-gray-600 dark:text-gray-400">Checked Out</span>
                </div>
                <span className="text-gray-400 mx-2">|</span>
                <span className="text-gray-500 dark:text-gray-400 font-medium">Room Types:</span>
                <Badge className={cn("text-[10px] px-1.5 py-0", ROOM_TYPE_STYLES.standard)}>Standard</Badge>
                <Badge className={cn("text-[10px] px-1.5 py-0", ROOM_TYPE_STYLES.deluxe)}>Deluxe</Badge>
                <Badge className={cn("text-[10px] px-1.5 py-0", ROOM_TYPE_STYLES.suite)}>Suite</Badge>
                <Badge className={cn("text-[10px] px-1.5 py-0", ROOM_TYPE_STYLES.family)}>Family</Badge>
                <Badge className={cn("text-[10px] px-1.5 py-0", ROOM_TYPE_STYLES.presidential)}>Presidential</Badge>
            </div>

            {/* Calendar Grid */}
            <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-black overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <div className="min-w-[1000px]">
                        {/* Header Row - Dates */}
                        <div className="grid grid-cols-[140px_repeat(14,1fr)] border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50">
                            <div className="p-3 border-r border-gray-100 dark:border-gray-800">
                                <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                                    Room
                                </span>
                            </div>
                            {days.map((day) => (
                                <div
                                    key={day.dateStr}
                                    className={cn(
                                        "p-2 text-center border-r border-gray-100 dark:border-gray-800 last:border-r-0",
                                        day.isToday && "bg-blue-50 dark:bg-blue-950/30",
                                        day.isWeekend && !day.isToday && "bg-gray-100 dark:bg-gray-800/50"
                                    )}
                                >
                                    <div className={cn(
                                        "text-[10px] uppercase tracking-wider",
                                        day.isToday ? "text-blue-600 dark:text-blue-400 font-semibold" : "text-gray-500 dark:text-gray-400"
                                    )}>
                                        {formatDayName(day.date)}
                                    </div>
                                    <div className={cn(
                                        "text-sm font-medium mt-0.5",
                                        day.isToday ? "text-blue-600 dark:text-blue-400" : "text-gray-700 dark:text-gray-300"
                                    )}>
                                        {day.date.getDate()}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Room Rows */}
                        {ROOMS.map((room, roomIndex) => (
                            <div
                                key={room.number}
                                className={cn(
                                    "grid grid-cols-[140px_repeat(14,1fr)]",
                                    roomIndex !== ROOMS.length - 1 && "border-b border-gray-100 dark:border-gray-800"
                                )}
                            >
                                {/* Room Info Cell */}
                                <div className="p-3 border-r border-gray-100 dark:border-gray-800 flex items-center gap-2 bg-white dark:bg-black">
                                    <span className="font-mono text-sm font-semibold text-gray-900 dark:text-white">
                                        {room.number}
                                    </span>
                                    <Badge className={cn("text-[9px] px-1 py-0 h-4", ROOM_TYPE_STYLES[room.type as keyof typeof ROOM_TYPE_STYLES])}>
                                        {room.type.charAt(0).toUpperCase() + room.type.slice(1)}
                                    </Badge>
                                </div>

                                {/* Day Cells */}
                                {days.map((day, dayIndex) => {
                                    const booking = getBookingForCell(room.number, day.dateStr);
                                    const isStart = booking && isBookingStart(booking, day.dateStr);
                                    const span = booking && isStart ? getBookingSpan(booking, day.dateStr) : 0;

                                    // Skip cells that are covered by a spanning booking
                                    if (booking && !isStart) {
                                        return null;
                                    }

                                    return (
                                        <div
                                            key={day.dateStr}
                                            className={cn(
                                                "relative h-12 border-r border-gray-100 dark:border-gray-800 last:border-r-0",
                                                day.isToday && "bg-blue-50/50 dark:bg-blue-950/20",
                                                day.isWeekend && !day.isToday && "bg-gray-50 dark:bg-gray-900/30",
                                                !booking && "hover:bg-gray-100 dark:hover:bg-gray-800/50 cursor-pointer transition-colors"
                                            )}
                                            style={isStart && span > 1 ? { gridColumn: `span ${Math.min(span, 14 - dayIndex)}` } : undefined}
                                        >
                                            {booking && isStart && (
                                                <div
                                                    className={cn(
                                                        "absolute inset-1 rounded-md flex items-center gap-1.5 px-2 cursor-pointer transition-all",
                                                        "hover:ring-2 hover:ring-offset-1 hover:ring-gray-400 dark:hover:ring-gray-500",
                                                        STATUS_COLORS[booking.status]
                                                    )}
                                                    onMouseEnter={(e) => handleBookingHover(e, booking)}
                                                    onMouseLeave={() => handleBookingHover(null as any, null)}
                                                >
                                                    <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-[10px] font-bold text-white shrink-0">
                                                        {getInitials(booking.guestName)}
                                                    </div>
                                                    {span > 2 && (
                                                        <span className="text-xs font-medium text-white truncate">
                                                            {booking.guestName.split(" ")[0]}
                                                        </span>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Hover Tooltip */}
            {hoveredBooking && (
                <div
                    className="fixed z-50 pointer-events-none"
                    style={{
                        left: tooltipPosition.x + 10,
                        top: tooltipPosition.y + 10,
                    }}
                >
                    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 p-3 max-w-xs">
                        <div className="flex items-center gap-2 mb-2">
                            <div className={cn(
                                "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white",
                                STATUS_COLORS[hoveredBooking.status]
                            )}>
                                {getInitials(hoveredBooking.guestName)}
                            </div>
                            <div>
                                <p className="font-semibold text-sm text-gray-900 dark:text-white">
                                    {hoveredBooking.guestName}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    {hoveredBooking.id}
                                </p>
                            </div>
                        </div>
                        <div className="space-y-1 text-xs text-gray-600 dark:text-gray-400">
                            <div className="flex items-center gap-2">
                                <CalendarDays className="h-3 w-3" />
                                <span>
                                    {new Date(hoveredBooking.checkIn).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                                    {" → "}
                                    {new Date(hoveredBooking.checkOut).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <BedDouble className="h-3 w-3" />
                                <span className="capitalize">{hoveredBooking.roomType} • Room {hoveredBooking.roomNumber}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <User className="h-3 w-3" />
                                <span>{hoveredBooking.adults} Adults{hoveredBooking.children > 0 && `, ${hoveredBooking.children} Children`}</span>
                            </div>
                        </div>
                        <div className="mt-2 pt-2 border-t border-gray-100 dark:border-gray-800">
                            <Badge className={cn(
                                "text-[10px]",
                                hoveredBooking.status === "confirmed" && "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300",
                                hoveredBooking.status === "checked_in" && "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300",
                                hoveredBooking.status === "checked_out" && "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                            )}>
                                {hoveredBooking.status.replace("_", " ").toUpperCase()}
                            </Badge>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
