"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Search,
    Phone,
    Calendar,
    BedDouble,
    MoreHorizontal,
    LogIn,
    LogOut,
    XCircle,
    Eye,
    Users,
    FileText,
    ChevronDown
} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import type { Booking } from "@/app/dashboard/bookings/page";

interface BookingsListProps {
    bookings: Booking[];
    onStatusChange: (bookingId: string, newStatus: Booking["status"]) => void;
}

const STATUS_STYLES = {
    confirmed: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    checked_in: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    checked_out: "bg-slate-500/10 text-slate-600 dark:text-slate-400",
    cancelled: "bg-red-500/10 text-red-600 dark:text-red-400",
};

const STATUS_LABELS = {
    confirmed: "Confirmed",
    checked_in: "Checked In",
    checked_out: "Checked Out",
    cancelled: "Cancelled",
};

const ID_LABELS: Record<string, string> = {
    aadhar: "Aadhar",
    pan: "PAN",
    passport: "Passport",
    driving_license: "DL",
    voter_id: "Voter ID",
};

export function BookingsList({ bookings, onStatusChange }: BookingsListProps) {
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState<string>("all");
    const [selected, setSelected] = useState<Booking | null>(null);

    const filtered = bookings.filter((b) => {
        const matchSearch = b.guestName.toLowerCase().includes(search.toLowerCase()) ||
            b.id.toLowerCase().includes(search.toLowerCase()) ||
            b.phone.includes(search) ||
            b.roomNumber.includes(search);
        const matchFilter = filter === "all" || b.status === filter;
        return matchSearch && matchFilter;
    });

    const counts = {
        all: bookings.length,
        confirmed: bookings.filter(b => b.status === "confirmed").length,
        checked_in: bookings.filter(b => b.status === "checked_in").length,
        checked_out: bookings.filter(b => b.status === "checked_out").length,
        cancelled: bookings.filter(b => b.status === "cancelled").length,
    };

    const formatDate = (d: string) => new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short" });

    return (
        <div className="space-y-4">
            {/* Filters */}
            <div className="flex items-center gap-3">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                        placeholder="Search..."
                        className="pl-9 h-9 bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <div className="flex bg-slate-100 dark:bg-slate-800/50 rounded-lg p-0.5">
                    {(["all", "confirmed", "checked_in", "checked_out", "cancelled"] as const).map((s) => (
                        <button
                            key={s}
                            onClick={() => setFilter(s)}
                            className={cn(
                                "px-3 py-1.5 text-xs font-medium rounded-md transition-all",
                                filter === s
                                    ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm"
                                    : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                            )}
                        >
                            {s === "all" ? "All" : STATUS_LABELS[s]} ({counts[s]})
                        </button>
                    ))}
                </div>
            </div>

            {/* Table */}
            <div className="border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden">
                <table className="w-full">
                    <thead>
                        <tr className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800">
                            <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-4 py-3">Guest</th>
                            <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-4 py-3">Room</th>
                            <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-4 py-3">Stay</th>
                            <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-4 py-3">Amount</th>
                            <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-4 py-3">Status</th>
                            <th className="text-right text-xs font-medium text-slate-500 uppercase tracking-wider px-4 py-3"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {filtered.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="text-center py-12 text-slate-400">
                                    No bookings found
                                </td>
                            </tr>
                        ) : (
                            filtered.map((b) => (
                                <tr key={b.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-colors">
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center text-white text-sm font-medium">
                                                {b.guestName.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-medium text-slate-900 dark:text-white text-sm">{b.guestName}</p>
                                                <p className="text-xs text-slate-500">{b.phone}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <p className="text-sm font-medium text-slate-900 dark:text-white">#{b.roomNumber}</p>
                                        <p className="text-xs text-slate-500 capitalize">{b.roomType.replace("_", " ")}</p>
                                    </td>
                                    <td className="px-4 py-3">
                                        <p className="text-sm text-slate-700 dark:text-slate-300">
                                            {formatDate(b.checkIn)} → {formatDate(b.checkOut)}
                                        </p>
                                        <p className="text-xs text-slate-500">{b.adults + b.children} guests</p>
                                    </td>
                                    <td className="px-4 py-3">
                                        <p className="text-sm font-semibold text-slate-900 dark:text-white">₹{b.totalAmount.toLocaleString()}</p>
                                        {b.advanceAmount > 0 && b.advanceAmount < b.totalAmount && (
                                            <p className="text-xs text-slate-500">₹{b.advanceAmount.toLocaleString()} paid</p>
                                        )}
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className={cn("inline-flex px-2 py-0.5 rounded text-xs font-medium", STATUS_STYLES[b.status])}>
                                            {STATUS_LABELS[b.status]}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                                                <MoreHorizontal className="h-4 w-4 text-slate-400" />
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent>
                                                <DropdownMenuItem onClick={() => setSelected(b)}>
                                                    <Eye className="h-4 w-4 mr-2" /> View
                                                </DropdownMenuItem>
                                                {b.status === "confirmed" && (
                                                    <DropdownMenuItem onClick={() => onStatusChange(b.id, "checked_in")}>
                                                        <LogIn className="h-4 w-4 mr-2 text-emerald-500" /> Check In
                                                    </DropdownMenuItem>
                                                )}
                                                {b.status === "checked_in" && (
                                                    <DropdownMenuItem onClick={() => onStatusChange(b.id, "checked_out")}>
                                                        <LogOut className="h-4 w-4 mr-2 text-blue-500" /> Check Out
                                                    </DropdownMenuItem>
                                                )}
                                                {(b.status === "confirmed" || b.status === "checked_in") && (
                                                    <>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem onClick={() => onStatusChange(b.id, "cancelled")} className="text-red-600">
                                                            <XCircle className="h-4 w-4 mr-2" /> Cancel
                                                        </DropdownMenuItem>
                                                    </>
                                                )}
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Detail Modal */}
            <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
                <DialogContent className="max-w-lg">
                    {selected && (
                        <>
                            <DialogHeader className="pb-4 border-b border-slate-100 dark:border-slate-800">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <DialogTitle className="text-lg">{selected.guestName}</DialogTitle>
                                        <p className="text-xs text-slate-500 mt-0.5 font-mono">{selected.id}</p>
                                    </div>
                                    <span className={cn("px-2.5 py-1 rounded text-xs font-medium", STATUS_STYLES[selected.status])}>
                                        {STATUS_LABELS[selected.status]}
                                    </span>
                                </div>
                            </DialogHeader>

                            <div className="py-4 space-y-4">
                                {/* Contact */}
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <p className="text-slate-500 text-xs mb-1">Phone</p>
                                        <p className="font-medium">{selected.phone}</p>
                                    </div>
                                    <div>
                                        <p className="text-slate-500 text-xs mb-1">Email</p>
                                        <p className="font-medium truncate">{selected.email || "—"}</p>
                                    </div>
                                </div>

                                {/* Address */}
                                <div className="text-sm">
                                    <p className="text-slate-500 text-xs mb-1">Address</p>
                                    <p className="font-medium">
                                        {selected.address && `${selected.address}, `}{selected.city}, {selected.state} {selected.pincode}
                                    </p>
                                </div>

                                {/* ID */}
                                <div className="flex items-center gap-3 p-3 bg-amber-50 dark:bg-amber-950/20 rounded-lg text-sm">
                                    <FileText className="h-4 w-4 text-amber-600" />
                                    <div>
                                        <span className="text-amber-800 dark:text-amber-400 font-medium">{ID_LABELS[selected.idType]}</span>
                                        <span className="text-amber-700 dark:text-amber-500 ml-2 font-mono">{selected.idNumber}</span>
                                    </div>
                                </div>

                                {/* Stay */}
                                <div className="grid grid-cols-3 gap-3">
                                    <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg text-center">
                                        <p className="text-[10px] text-slate-400 uppercase tracking-wider">Check In</p>
                                        <p className="font-semibold text-sm mt-1">{formatDate(selected.checkIn)}</p>
                                    </div>
                                    <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg text-center">
                                        <p className="text-[10px] text-slate-400 uppercase tracking-wider">Check Out</p>
                                        <p className="font-semibold text-sm mt-1">{formatDate(selected.checkOut)}</p>
                                    </div>
                                    <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg text-center">
                                        <p className="text-[10px] text-slate-400 uppercase tracking-wider">Room</p>
                                        <p className="font-semibold text-sm mt-1">#{selected.roomNumber}</p>
                                    </div>
                                </div>

                                {/* Payment */}
                                <div className="flex items-center justify-between p-3 bg-emerald-50 dark:bg-emerald-950/20 rounded-lg">
                                    <div>
                                        <p className="text-xs text-emerald-600 dark:text-emerald-400">Total Amount</p>
                                        <p className="text-lg font-bold text-emerald-700 dark:text-emerald-300">₹{selected.totalAmount.toLocaleString()}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs text-slate-500">Advance Paid</p>
                                        <p className="font-semibold">₹{selected.advanceAmount.toLocaleString()}</p>
                                    </div>
                                </div>

                                {/* Special Requests */}
                                {selected.specialRequests && (
                                    <div className="text-sm">
                                        <p className="text-slate-500 text-xs mb-1">Special Requests</p>
                                        <p className="text-slate-700 dark:text-slate-300">{selected.specialRequests}</p>
                                    </div>
                                )}
                            </div>

                            {/* Actions */}
                            {(selected.status === "confirmed" || selected.status === "checked_in") && (
                                <div className="flex gap-2 pt-4 border-t border-slate-100 dark:border-slate-800">
                                    {selected.status === "confirmed" && (
                                        <Button
                                            onClick={() => { onStatusChange(selected.id, "checked_in"); setSelected(null); }}
                                            className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
                                        >
                                            <LogIn className="h-4 w-4 mr-2" /> Check In
                                        </Button>
                                    )}
                                    {selected.status === "checked_in" && (
                                        <Button
                                            onClick={() => { onStatusChange(selected.id, "checked_out"); setSelected(null); }}
                                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                                        >
                                            <LogOut className="h-4 w-4 mr-2" /> Check Out
                                        </Button>
                                    )}
                                    <Button
                                        variant="outline"
                                        onClick={() => { onStatusChange(selected.id, "cancelled"); setSelected(null); }}
                                        className="text-red-600 border-red-200 hover:bg-red-50 dark:border-red-900 dark:hover:bg-red-950/30"
                                    >
                                        Cancel
                                    </Button>
                                </div>
                            )}
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
