"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { NewBookingForm } from "@/components/hotel/NewBookingForm";
import { BookingsList } from "@/components/hotel/BookingsList";

export interface Booking {
    id: string;
    createdAt: number;

    // Guest Details
    guestName: string;
    phone: string;
    email: string;
    address: string;
    city: string;
    state: string;
    pincode: string;

    // ID Verification
    idType: "aadhar" | "pan" | "passport" | "driving_license" | "voter_id";
    idNumber: string;

    // Documents (base64)
    guestPhoto?: string;
    idFrontPhoto?: string;
    idBackPhoto?: string;

    // Stay Details
    checkIn: string;
    checkOut: string;
    roomType: string;
    roomNumber: string;

    // Occupancy
    adults: number;
    children: number;
    extraBeds: number;

    // Purpose
    purpose: string;
    companyName?: string;
    gstNumber?: string;

    // Payment
    totalAmount: number;
    advanceAmount: number;
    paymentMode: "cash" | "card" | "upi" | "bank_transfer";

    // Special Requests
    specialRequests?: string;

    // Status
    status: "confirmed" | "checked_in" | "checked_out" | "cancelled";
}

// Sample bookings data for demo
const SAMPLE_BOOKINGS: Booking[] = [
    {
        id: "BK-DEMO001",
        createdAt: Date.now() - 3600000, // 1 hour ago
        guestName: "Rajesh Sharma",
        phone: "+91 98765 43210",
        email: "rajesh.sharma@gmail.com",
        address: "42, MG Road, Andheri West",
        city: "Mumbai",
        state: "Maharashtra",
        pincode: "400058",
        idType: "aadhar",
        idNumber: "1234 5678 9012",
        checkIn: new Date().toISOString().split("T")[0],
        checkOut: new Date(Date.now() + 3 * 86400000).toISOString().split("T")[0],
        roomType: "deluxe",
        roomNumber: "301",
        adults: 2,
        children: 1,
        extraBeds: 0,
        purpose: "Leisure / Tourism",
        totalAmount: 12000,
        advanceAmount: 5000,
        paymentMode: "upi",
        status: "checked_in",
    },
    {
        id: "BK-DEMO002",
        createdAt: Date.now() - 7200000, // 2 hours ago
        guestName: "Priya Patel",
        phone: "+91 87654 32109",
        email: "priya.patel@outlook.com",
        address: "15, Satellite Road, Bodakdev",
        city: "Ahmedabad",
        state: "Gujarat",
        pincode: "380054",
        idType: "pan",
        idNumber: "ABCDE1234F",
        checkIn: new Date(Date.now() + 86400000).toISOString().split("T")[0],
        checkOut: new Date(Date.now() + 4 * 86400000).toISOString().split("T")[0],
        roomType: "suite",
        roomNumber: "501",
        adults: 2,
        children: 0,
        extraBeds: 0,
        purpose: "Business Trip",
        companyName: "TechSoft Solutions Pvt Ltd",
        gstNumber: "24AABCT1234E1ZH",
        totalAmount: 22500,
        advanceAmount: 22500,
        paymentMode: "card",
        status: "confirmed",
    },
    {
        id: "BK-DEMO003",
        createdAt: Date.now() - 86400000, // 1 day ago
        guestName: "Amit Kumar",
        phone: "+91 99887 76655",
        email: "amit.kumar@yahoo.com",
        address: "78, Connaught Place",
        city: "New Delhi",
        state: "Delhi",
        pincode: "110001",
        idType: "driving_license",
        idNumber: "DL-1420110012345",
        checkIn: new Date(Date.now() - 2 * 86400000).toISOString().split("T")[0],
        checkOut: new Date(Date.now() - 86400000).toISOString().split("T")[0],
        roomType: "standard",
        roomNumber: "102",
        adults: 1,
        children: 0,
        extraBeds: 0,
        purpose: "Transit / Stopover",
        totalAmount: 2500,
        advanceAmount: 2500,
        paymentMode: "cash",
        status: "checked_out",
    },
    {
        id: "BK-DEMO004",
        createdAt: Date.now() - 172800000, // 2 days ago
        guestName: "Sunita Verma",
        phone: "+91 77889 99001",
        email: "sunita.verma@rediffmail.com",
        address: "23, Brigade Road",
        city: "Bengaluru",
        state: "Karnataka",
        pincode: "560025",
        idType: "passport",
        idNumber: "J8765432",
        checkIn: new Date(Date.now() + 2 * 86400000).toISOString().split("T")[0],
        checkOut: new Date(Date.now() + 5 * 86400000).toISOString().split("T")[0],
        roomType: "family",
        roomNumber: "205",
        adults: 2,
        children: 2,
        extraBeds: 1,
        purpose: "Family Visit",
        totalAmount: 16500,
        advanceAmount: 8000,
        paymentMode: "upi",
        specialRequests: "Need a crib for infant. Vegetarian meals preferred.",
        status: "confirmed",
    },
    {
        id: "BK-DEMO005",
        createdAt: Date.now() - 259200000, // 3 days ago
        guestName: "Karthik Rajan",
        phone: "+91 94433 22110",
        email: "karthik.r@gmail.com",
        address: "56, Anna Salai",
        city: "Chennai",
        state: "Tamil Nadu",
        pincode: "600002",
        idType: "voter_id",
        idNumber: "ABC1234567",
        checkIn: new Date(Date.now() - 5 * 86400000).toISOString().split("T")[0],
        checkOut: new Date(Date.now() - 3 * 86400000).toISOString().split("T")[0],
        roomType: "deluxe",
        roomNumber: "304",
        adults: 2,
        children: 0,
        extraBeds: 0,
        purpose: "Wedding / Event",
        companyName: "",
        totalAmount: 8000,
        advanceAmount: 8000,
        paymentMode: "card",
        status: "cancelled",
    },
];

export default function BookingsPage() {
    const searchParams = useSearchParams();
    const [activeTab, setActiveTab] = useState(() => {
        const tab = searchParams.get("tab");
        return tab === "new" ? "new" : "all";
    });
    const [bookings, setBookings] = useState<Booking[]>([]);

    useEffect(() => {
        const saved = localStorage.getItem("hotel_bookings");
        if (saved) {
            const parsed = JSON.parse(saved);
            if (parsed.length > 0) {
                setBookings(parsed);
            } else {
                // Load sample data if empty
                setBookings(SAMPLE_BOOKINGS);
                localStorage.setItem("hotel_bookings", JSON.stringify(SAMPLE_BOOKINGS));
            }
        } else {
            // Load sample data if no saved bookings
            setBookings(SAMPLE_BOOKINGS);
            localStorage.setItem("hotel_bookings", JSON.stringify(SAMPLE_BOOKINGS));
        }
    }, []);

    const saveBookings = (newBookings: Booking[]) => {
        setBookings(newBookings);
        localStorage.setItem("hotel_bookings", JSON.stringify(newBookings));
    };

    const handleNewBooking = (booking: Omit<Booking, "id" | "createdAt" | "status">) => {
        const newBooking: Booking = {
            ...booking,
            id: `BK-${Date.now().toString(36).toUpperCase()}`,
            createdAt: Date.now(),
            status: "confirmed",
        };
        saveBookings([newBooking, ...bookings]);
        setActiveTab("all");
    };

    const handleStatusChange = (bookingId: string, newStatus: Booking["status"]) => {
        const updated = bookings.map((b) =>
            b.id === bookingId ? { ...b, status: newStatus } : b
        );
        saveBookings(updated);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-semibold text-slate-900 dark:text-white">Bookings</h1>
                    <p className="text-sm text-slate-500 mt-0.5">Manage reservations</p>
                </div>
                <div className="flex bg-slate-100 dark:bg-slate-800 rounded-lg p-0.5">
                    <button
                        onClick={() => setActiveTab("all")}
                        className={cn(
                            "px-4 py-1.5 text-sm font-medium rounded-md transition-all",
                            activeTab === "all"
                                ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm"
                                : "text-slate-500 hover:text-slate-700"
                        )}
                    >
                        All Bookings
                    </button>
                    <button
                        onClick={() => setActiveTab("new")}
                        className={cn(
                            "px-4 py-1.5 text-sm font-medium rounded-md transition-all",
                            activeTab === "new"
                                ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm"
                                : "text-slate-500 hover:text-slate-700"
                        )}
                    >
                        + New Booking
                    </button>
                </div>
            </div>

            {activeTab === "all" && (
                <BookingsList bookings={bookings} onStatusChange={handleStatusChange} />
            )}

            {activeTab === "new" && (
                <NewBookingForm onSubmit={handleNewBooking} />
            )}
        </div>
    );
}
