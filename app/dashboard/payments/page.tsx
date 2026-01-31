"use client";

import React, { useState, useEffect } from "react";
import {
    CreditCard,
    Wallet,
    Banknote,
    Smartphone,
    Building2,
    TrendingUp,
    TrendingDown,
    ArrowUpRight,
    ArrowDownRight,
    Search,
    Filter,
    Download,
    Eye,
    CheckCircle2,
    Clock,
    XCircle,
    AlertCircle,
    ReceiptText,
    IndianRupee,
    Calendar,
    User,
    FileText,
    MoreVertical,
    RefreshCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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

// Payment interface
export interface Payment {
    id: string;
    createdAt: number;

    // Guest & Booking Reference
    guestName: string;
    guestPhone: string;
    bookingId: string;
    roomNumber: string;

    // Payment Details
    amount: number;
    paymentMethod: "cash" | "card" | "upi" | "bank_transfer" | "cheque";
    paymentType: "advance" | "full_payment" | "partial" | "refund" | "settlement";

    // Status
    status: "completed" | "pending" | "failed" | "refunded";

    // Transaction Details
    transactionId?: string;
    upiId?: string;
    cardLast4?: string;
    bankName?: string;
    chequeNumber?: string;

    // Invoice
    invoiceNumber: string;
    gstAmount: number;
    cgst: number;
    sgst: number;

    // Notes
    notes?: string;
}

// Indian demo payment data
const DEMO_PAYMENTS: Payment[] = [
    {
        id: "PAY-001",
        createdAt: Date.now() - 1800000, // 30 mins ago
        guestName: "Rajesh Sharma",
        guestPhone: "+91 98765 43210",
        bookingId: "BK-DEMO001",
        roomNumber: "301",
        amount: 5000,
        paymentMethod: "upi",
        paymentType: "advance",
        status: "completed",
        transactionId: "UPI/431267890123/2026",
        upiId: "rajesh.sharma@okaxis",
        invoiceNumber: "INV-2026-0001",
        gstAmount: 900,
        cgst: 450,
        sgst: 450,
    },
    {
        id: "PAY-002",
        createdAt: Date.now() - 3600000, // 1 hour ago
        guestName: "Priya Patel",
        guestPhone: "+91 87654 32109",
        bookingId: "BK-DEMO002",
        roomNumber: "501",
        amount: 22500,
        paymentMethod: "card",
        paymentType: "full_payment",
        status: "completed",
        transactionId: "TXN78901234567890",
        cardLast4: "4532",
        invoiceNumber: "INV-2026-0002",
        gstAmount: 4050,
        cgst: 2025,
        sgst: 2025,
        notes: "Corporate booking - GST invoice required",
    },
    {
        id: "PAY-003",
        createdAt: Date.now() - 7200000, // 2 hours ago
        guestName: "Amit Kumar Singh",
        guestPhone: "+91 99887 76655",
        bookingId: "BK-DEMO003",
        roomNumber: "102",
        amount: 2500,
        paymentMethod: "cash",
        paymentType: "full_payment",
        status: "completed",
        invoiceNumber: "INV-2026-0003",
        gstAmount: 450,
        cgst: 225,
        sgst: 225,
    },
    {
        id: "PAY-004",
        createdAt: Date.now() - 10800000, // 3 hours ago
        guestName: "Sunita Verma",
        guestPhone: "+91 77889 99001",
        bookingId: "BK-DEMO004",
        roomNumber: "205",
        amount: 8000,
        paymentMethod: "upi",
        paymentType: "advance",
        status: "completed",
        transactionId: "UPI/567890123456/2026",
        upiId: "sunita.verma@ybl",
        invoiceNumber: "INV-2026-0004",
        gstAmount: 1440,
        cgst: 720,
        sgst: 720,
    },
    {
        id: "PAY-005",
        createdAt: Date.now() - 14400000, // 4 hours ago
        guestName: "Karthik Rajan",
        guestPhone: "+91 94433 22110",
        bookingId: "BK-DEMO005",
        roomNumber: "304",
        amount: 8000,
        paymentMethod: "card",
        paymentType: "refund",
        status: "refunded",
        transactionId: "REF12345678901234",
        cardLast4: "7891",
        invoiceNumber: "INV-2026-0005",
        gstAmount: 1440,
        cgst: 720,
        sgst: 720,
        notes: "Booking cancelled - Full refund processed",
    },
    {
        id: "PAY-006",
        createdAt: Date.now() - 18000000, // 5 hours ago
        guestName: "Anjali Deshmukh",
        guestPhone: "+91 92234 55677",
        bookingId: "BK-DEMO006",
        roomNumber: "401",
        amount: 15000,
        paymentMethod: "bank_transfer",
        paymentType: "full_payment",
        status: "pending",
        bankName: "HDFC Bank",
        transactionId: "NEFT/HDFC/2026020143210",
        invoiceNumber: "INV-2026-0006",
        gstAmount: 2700,
        cgst: 1350,
        sgst: 1350,
        notes: "Corporate booking - Awaiting bank confirmation",
    },
    {
        id: "PAY-007",
        createdAt: Date.now() - 21600000, // 6 hours ago
        guestName: "Mohammed Ismail",
        guestPhone: "+91 81234 56789",
        bookingId: "BK-DEMO007",
        roomNumber: "302",
        amount: 12000,
        paymentMethod: "upi",
        paymentType: "settlement",
        status: "completed",
        transactionId: "UPI/789012345678/2026",
        upiId: "ismail.m@paytm",
        invoiceNumber: "INV-2026-0007",
        gstAmount: 2160,
        cgst: 1080,
        sgst: 1080,
    },
    {
        id: "PAY-008",
        createdAt: Date.now() - 43200000, // 12 hours ago
        guestName: "Deepika Nair",
        guestPhone: "+91 94456 78901",
        bookingId: "BK-DEMO008",
        roomNumber: "203",
        amount: 9500,
        paymentMethod: "card",
        paymentType: "partial",
        status: "completed",
        transactionId: "TXN23456789012345",
        cardLast4: "2156",
        invoiceNumber: "INV-2026-0008",
        gstAmount: 1710,
        cgst: 855,
        sgst: 855,
    },
    {
        id: "PAY-009",
        createdAt: Date.now() - 86400000, // 1 day ago
        guestName: "Vikram Chauhan",
        guestPhone: "+91 98123 45678",
        bookingId: "BK-DEMO009",
        roomNumber: "701",
        amount: 45000,
        paymentMethod: "bank_transfer",
        paymentType: "full_payment",
        status: "completed",
        bankName: "ICICI Bank",
        transactionId: "RTGS/ICIC/2026013154321",
        invoiceNumber: "INV-2026-0009",
        gstAmount: 8100,
        cgst: 4050,
        sgst: 4050,
        notes: "VIP Guest - Adani Group corporate booking",
    },
    {
        id: "PAY-010",
        createdAt: Date.now() - 90000000, // ~25 hours ago
        guestName: "Meera Iyer",
        guestPhone: "+91 96785 43210",
        bookingId: "BK-DEMO010",
        roomNumber: "104",
        amount: 7500,
        paymentMethod: "upi",
        paymentType: "advance",
        status: "failed",
        upiId: "meera.iyer@oksbi",
        invoiceNumber: "INV-2026-0010",
        gstAmount: 1350,
        cgst: 675,
        sgst: 675,
        notes: "UPI transaction failed - Retry initiated",
    },
    {
        id: "PAY-011",
        createdAt: Date.now() - 129600000, // 1.5 days ago
        guestName: "Arjun Malhotra",
        guestPhone: "+91 88990 11223",
        bookingId: "BK-DEMO011",
        roomNumber: "405",
        amount: 18500,
        paymentMethod: "cheque",
        paymentType: "full_payment",
        status: "pending",
        chequeNumber: "123456",
        bankName: "State Bank of India",
        invoiceNumber: "INV-2026-0011",
        gstAmount: 3330,
        cgst: 1665,
        sgst: 1665,
        notes: "Cheque clearing in progress - 2-3 business days",
    },
    {
        id: "PAY-012",
        createdAt: Date.now() - 172800000, // 2 days ago
        guestName: "Sneha Kapoor",
        guestPhone: "+91 97654 32100",
        bookingId: "BK-DEMO012",
        roomNumber: "503",
        amount: 28000,
        paymentMethod: "card",
        paymentType: "full_payment",
        status: "completed",
        transactionId: "TXN34567890123456",
        cardLast4: "8234",
        invoiceNumber: "INV-2026-0012",
        gstAmount: 5040,
        cgst: 2520,
        sgst: 2520,
        notes: "TCS corporate card payment",
    },
    {
        id: "PAY-013",
        createdAt: Date.now() - 259200000, // 3 days ago
        guestName: "Rohit Bansal",
        guestPhone: "+91 85432 10987",
        bookingId: "BK-DEMO013",
        roomNumber: "201",
        amount: 11000,
        paymentMethod: "cash",
        paymentType: "settlement",
        status: "completed",
        invoiceNumber: "INV-2026-0013",
        gstAmount: 1980,
        cgst: 990,
        sgst: 990,
    },
    {
        id: "PAY-014",
        createdAt: Date.now() - 345600000, // 4 days ago
        guestName: "Lakshmi Venkatesh",
        guestPhone: "+91 93456 78012",
        bookingId: "BK-DEMO014",
        roomNumber: "106",
        amount: 14000,
        paymentMethod: "upi",
        paymentType: "full_payment",
        status: "completed",
        transactionId: "UPI/890123456789/2026",
        upiId: "lakshmi.v@icici",
        invoiceNumber: "INV-2026-0014",
        gstAmount: 2520,
        cgst: 1260,
        sgst: 1260,
        notes: "Wipro employee - Corporate rate applied",
    },
    {
        id: "PAY-015",
        createdAt: Date.now() - 432000000, // 5 days ago
        guestName: "Sanjay Gupta",
        guestPhone: "+91 99001 22334",
        bookingId: "BK-DEMO015",
        roomNumber: "801",
        amount: 75000,
        paymentMethod: "bank_transfer",
        paymentType: "full_payment",
        status: "completed",
        bankName: "HDFC Bank",
        transactionId: "RTGS/HDFC/2026012765432",
        invoiceNumber: "INV-2026-0015",
        gstAmount: 13500,
        cgst: 6750,
        sgst: 6750,
        notes: "HDFC Senior VP - Penthouse Suite - VIP treatment",
    },
];

const PAYMENT_METHOD_CONFIG = {
    cash: { label: "Cash", icon: Banknote, color: "text-green-600 bg-green-50 dark:bg-green-950/50" },
    card: { label: "Card", icon: CreditCard, color: "text-blue-600 bg-blue-50 dark:bg-blue-950/50" },
    upi: { label: "UPI", icon: Smartphone, color: "text-purple-600 bg-purple-50 dark:bg-purple-950/50" },
    bank_transfer: { label: "Bank Transfer", icon: Building2, color: "text-orange-600 bg-orange-50 dark:bg-orange-950/50" },
    cheque: { label: "Cheque", icon: FileText, color: "text-amber-600 bg-amber-50 dark:bg-amber-950/50" },
};

const PAYMENT_TYPE_LABELS = {
    advance: "Advance",
    full_payment: "Full Payment",
    partial: "Partial",
    refund: "Refund",
    settlement: "Settlement",
};

const STATUS_CONFIG = {
    completed: { label: "Completed", icon: CheckCircle2, color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" },
    pending: { label: "Pending", icon: Clock, color: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400" },
    failed: { label: "Failed", icon: XCircle, color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" },
    refunded: { label: "Refunded", icon: RefreshCcw, color: "bg-gray-100 text-gray-700 dark:bg-gray-800/50 dark:text-gray-400" },
};

export default function PaymentsPage() {
    const [payments, setPayments] = useState<Payment[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [filterStatus, setFilterStatus] = useState<"all" | "completed" | "pending" | "failed" | "refunded">("all");
    const [filterMethod, setFilterMethod] = useState<"all" | "cash" | "card" | "upi" | "bank_transfer" | "cheque">("all");
    const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);

    useEffect(() => {
        const saved = localStorage.getItem("hotel_payments");
        if (saved) {
            const parsed = JSON.parse(saved);
            if (parsed.length > 0) {
                setPayments(parsed);
            } else {
                setPayments(DEMO_PAYMENTS);
                localStorage.setItem("hotel_payments", JSON.stringify(DEMO_PAYMENTS));
            }
        } else {
            setPayments(DEMO_PAYMENTS);
            localStorage.setItem("hotel_payments", JSON.stringify(DEMO_PAYMENTS));
        }
    }, []);

    // Filter payments
    const filteredPayments = payments.filter((payment) => {
        const matchesSearch =
            payment.guestName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            payment.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
            payment.bookingId.toLowerCase().includes(searchQuery.toLowerCase()) ||
            payment.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesStatus = filterStatus === "all" || payment.status === filterStatus;
        const matchesMethod = filterMethod === "all" || payment.paymentMethod === filterMethod;

        return matchesSearch && matchesStatus && matchesMethod;
    });

    // Calculate stats
    const stats = {
        totalRevenue: payments
            .filter((p) => p.status === "completed" && p.paymentType !== "refund")
            .reduce((sum, p) => sum + p.amount, 0),
        todayRevenue: payments
            .filter((p) => p.status === "completed" && p.paymentType !== "refund" && p.createdAt > Date.now() - 86400000)
            .reduce((sum, p) => sum + p.amount, 0),
        pendingAmount: payments
            .filter((p) => p.status === "pending")
            .reduce((sum, p) => sum + p.amount, 0),
        refundedAmount: payments
            .filter((p) => p.status === "refunded")
            .reduce((sum, p) => sum + p.amount, 0),
        totalGst: payments
            .filter((p) => p.status === "completed")
            .reduce((sum, p) => sum + p.gstAmount, 0),
    };

    // Payment method breakdown
    const methodBreakdown = {
        upi: payments.filter((p) => p.paymentMethod === "upi" && p.status === "completed").reduce((sum, p) => sum + p.amount, 0),
        card: payments.filter((p) => p.paymentMethod === "card" && p.status === "completed").reduce((sum, p) => sum + p.amount, 0),
        cash: payments.filter((p) => p.paymentMethod === "cash" && p.status === "completed").reduce((sum, p) => sum + p.amount, 0),
        bank_transfer: payments.filter((p) => p.paymentMethod === "bank_transfer" && p.status === "completed").reduce((sum, p) => sum + p.amount, 0),
    };

    const openPaymentDetail = (payment: Payment) => {
        setSelectedPayment(payment);
        setIsDetailOpen(true);
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 0,
        }).format(amount);
    };

    const formatDateTime = (timestamp: number) => {
        return new Date(timestamp).toLocaleString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const getRelativeTime = (timestamp: number) => {
        const diff = Date.now() - timestamp;
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (minutes < 60) return `${minutes}m ago`;
        if (hours < 24) return `${hours}h ago`;
        return `${days}d ago`;
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-serif text-gray-900 dark:text-white">Payments</h1>
                    <p className="text-gray-500 dark:text-gray-400">Track and manage all payment transactions</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="gap-2">
                        <Download className="h-4 w-4" />
                        Export
                    </Button>
                    <Button className="gap-2">
                        <ReceiptText className="h-4 w-4" />
                        New Payment
                    </Button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-black p-5 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div className="rounded-lg bg-green-50 dark:bg-green-950/50 p-2.5">
                            <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />
                        </div>
                        <div className="flex items-center gap-1 text-xs font-medium text-green-600">
                            <ArrowUpRight className="h-3 w-3" />
                            +12.5%
                        </div>
                    </div>
                    <div className="mt-3">
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Revenue</p>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{formatCurrency(stats.totalRevenue)}</h3>
                    </div>
                </div>
                <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-black p-5 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div className="rounded-lg bg-blue-50 dark:bg-blue-950/50 p-2.5">
                            <IndianRupee className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <span className="text-xs font-medium text-blue-600">Today</span>
                    </div>
                    <div className="mt-3">
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Today's Collection</p>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{formatCurrency(stats.todayRevenue)}</h3>
                    </div>
                </div>
                <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-black p-5 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div className="rounded-lg bg-yellow-50 dark:bg-yellow-950/50 p-2.5">
                            <Clock className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                        </div>
                        <span className="text-xs font-medium text-yellow-600">Pending</span>
                    </div>
                    <div className="mt-3">
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Pending Payments</p>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{formatCurrency(stats.pendingAmount)}</h3>
                    </div>
                </div>
                <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-black p-5 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div className="rounded-lg bg-purple-50 dark:bg-purple-950/50 p-2.5">
                            <Wallet className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                        </div>
                        <span className="text-xs font-medium text-purple-600">GST</span>
                    </div>
                    <div className="mt-3">
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">GST Collected</p>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{formatCurrency(stats.totalGst)}</h3>
                    </div>
                </div>
            </div>

            {/* Payment Method Breakdown */}
            <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-black p-6 shadow-sm">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Payment Method Breakdown</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 dark:border-gray-800">
                        <div className="p-2 rounded-lg bg-purple-50 dark:bg-purple-950/50">
                            <Smartphone className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">UPI</p>
                            <p className="font-semibold text-gray-900 dark:text-white">{formatCurrency(methodBreakdown.upi)}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 dark:border-gray-800">
                        <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/50">
                            <CreditCard className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Card</p>
                            <p className="font-semibold text-gray-900 dark:text-white">{formatCurrency(methodBreakdown.card)}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 dark:border-gray-800">
                        <div className="p-2 rounded-lg bg-green-50 dark:bg-green-950/50">
                            <Banknote className="h-5 w-5 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Cash</p>
                            <p className="font-semibold text-gray-900 dark:text-white">{formatCurrency(methodBreakdown.cash)}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 dark:border-gray-800">
                        <div className="p-2 rounded-lg bg-orange-50 dark:bg-orange-950/50">
                            <Building2 className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Bank Transfer</p>
                            <p className="font-semibold text-gray-900 dark:text-white">{formatCurrency(methodBreakdown.bank_transfer)}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col lg:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                        placeholder="Search by guest name, payment ID, booking ID, or invoice..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                    />
                </div>
                <div className="flex gap-2 flex-wrap">
                    {/* Status Filter */}
                    <DropdownMenu>
                        <DropdownMenuTrigger className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium h-9 px-3 gap-2 border border-gray-200 bg-white hover:bg-gray-100 hover:text-gray-900 dark:border-gray-800 dark:bg-gray-950 dark:hover:bg-gray-800 dark:hover:text-gray-50">
                            <Filter className="h-3.5 w-3.5" />
                            Status: {filterStatus === "all" ? "All" : STATUS_CONFIG[filterStatus].label}
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuItem onClick={() => setFilterStatus("all")}>All Status</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => setFilterStatus("completed")}>Completed</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setFilterStatus("pending")}>Pending</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setFilterStatus("failed")}>Failed</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setFilterStatus("refunded")}>Refunded</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    {/* Method Filter */}
                    <DropdownMenu>
                        <DropdownMenuTrigger className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium h-9 px-3 gap-2 border border-gray-200 bg-white hover:bg-gray-100 hover:text-gray-900 dark:border-gray-800 dark:bg-gray-950 dark:hover:bg-gray-800 dark:hover:text-gray-50">
                            <Wallet className="h-3.5 w-3.5" />
                            Method: {filterMethod === "all" ? "All" : PAYMENT_METHOD_CONFIG[filterMethod].label}
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuItem onClick={() => setFilterMethod("all")}>All Methods</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => setFilterMethod("upi")}>UPI</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setFilterMethod("card")}>Card</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setFilterMethod("cash")}>Cash</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setFilterMethod("bank_transfer")}>Bank Transfer</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setFilterMethod("cheque")}>Cheque</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            {/* Payments Table */}
            <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-black shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 dark:bg-white/5 text-xs uppercase text-gray-700 dark:text-gray-300 border-b border-gray-100 dark:border-gray-800">
                            <tr>
                                <th className="px-6 py-4 font-medium">Payment ID</th>
                                <th className="px-6 py-4 font-medium">Guest</th>
                                <th className="px-6 py-4 font-medium">Amount</th>
                                <th className="px-6 py-4 font-medium">Method</th>
                                <th className="px-6 py-4 font-medium">Type</th>
                                <th className="px-6 py-4 font-medium">Status</th>
                                <th className="px-6 py-4 font-medium">Date</th>
                                <th className="px-6 py-4 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                            {filteredPayments.map((payment) => {
                                const methodConfig = PAYMENT_METHOD_CONFIG[payment.paymentMethod];
                                const statusConfig = STATUS_CONFIG[payment.status];
                                const MethodIcon = methodConfig.icon;
                                const StatusIcon = statusConfig.icon;

                                return (
                                    <tr
                                        key={payment.id}
                                        className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors cursor-pointer"
                                        onClick={() => openPaymentDetail(payment)}
                                    >
                                        <td className="px-6 py-4">
                                            <div className="font-mono text-xs text-gray-500 dark:text-gray-400">{payment.id}</div>
                                            <div className="text-[10px] text-gray-400">{payment.invoiceNumber}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-gray-900 dark:text-white">{payment.guestName}</div>
                                            <div className="text-xs text-gray-500 dark:text-gray-400">Room {payment.roomNumber}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className={cn(
                                                "font-semibold",
                                                payment.paymentType === "refund" ? "text-red-600" : "text-gray-900 dark:text-white"
                                            )}>
                                                {payment.paymentType === "refund" ? "-" : ""}{formatCurrency(payment.amount)}
                                            </div>
                                            <div className="text-[10px] text-gray-400">+{formatCurrency(payment.gstAmount)} GST</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className={cn("inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium", methodConfig.color)}>
                                                <MethodIcon className="h-3 w-3" />
                                                {methodConfig.label}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-xs text-gray-600 dark:text-gray-400">{PAYMENT_TYPE_LABELS[payment.paymentType]}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <Badge className={cn("gap-1", statusConfig.color)}>
                                                <StatusIcon className="h-3 w-3" />
                                                {statusConfig.label}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-gray-900 dark:text-white text-xs">{getRelativeTime(payment.createdAt)}</div>
                                            <div className="text-[10px] text-gray-400">{formatDateTime(payment.createdAt).split(",")[0]}</div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger className="inline-flex items-center justify-center h-8 w-8 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800" onClick={(e) => e.stopPropagation()}>
                                                    <MoreVertical className="h-4 w-4" />
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent>
                                                    <DropdownMenuItem onClick={(e) => { e.stopPropagation(); openPaymentDetail(payment); }}>
                                                        <Eye className="h-4 w-4 mr-2" />
                                                        View Details
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem>
                                                        <Download className="h-4 w-4 mr-2" />
                                                        Download Invoice
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem>
                                                        <ReceiptText className="h-4 w-4 mr-2" />
                                                        Print Receipt
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {filteredPayments.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                        <CreditCard className="h-12 w-12 text-gray-300 dark:text-gray-700 mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">No payments found</h3>
                        <p className="text-gray-500 dark:text-gray-400 mt-1">Try adjusting your search or filter criteria</p>
                    </div>
                )}
            </div>

            {/* Payment Detail Modal */}
            <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-3">
                            <div className={cn(
                                "p-2 rounded-lg",
                                selectedPayment && PAYMENT_METHOD_CONFIG[selectedPayment.paymentMethod].color
                            )}>
                                {selectedPayment && React.createElement(PAYMENT_METHOD_CONFIG[selectedPayment.paymentMethod].icon, { className: "h-5 w-5" })}
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <span>Payment {selectedPayment?.id}</span>
                                    {selectedPayment && (
                                        <Badge className={STATUS_CONFIG[selectedPayment.status].color}>
                                            {STATUS_CONFIG[selectedPayment.status].label}
                                        </Badge>
                                    )}
                                </div>
                                <p className="text-sm font-normal text-gray-500 dark:text-gray-400">
                                    Invoice: {selectedPayment?.invoiceNumber}
                                </p>
                            </div>
                        </DialogTitle>
                    </DialogHeader>

                    {selectedPayment && (
                        <div className="space-y-6 mt-4">
                            {/* Amount Summary */}
                            <div className="rounded-lg border border-gray-200 dark:border-gray-800 p-4 bg-gray-50 dark:bg-gray-900">
                                <div className="grid grid-cols-3 gap-4 text-center">
                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Base Amount</p>
                                        <p className="text-xl font-bold text-gray-900 dark:text-white">
                                            {formatCurrency(selectedPayment.amount - selectedPayment.gstAmount)}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">GST (18%)</p>
                                        <p className="text-xl font-bold text-gray-900 dark:text-white">
                                            {formatCurrency(selectedPayment.gstAmount)}
                                        </p>
                                        <p className="text-[10px] text-gray-400">CGST: {formatCurrency(selectedPayment.cgst)} | SGST: {formatCurrency(selectedPayment.sgst)}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Total Amount</p>
                                        <p className="text-xl font-bold text-green-600 dark:text-green-400">
                                            {formatCurrency(selectedPayment.amount)}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Guest & Booking Info */}
                            <div className="rounded-lg border border-gray-200 dark:border-gray-800 p-4">
                                <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                                    <User className="h-4 w-4" />
                                    Guest & Booking Details
                                </h4>
                                <div className="grid sm:grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <p className="text-gray-500 dark:text-gray-400">Guest Name</p>
                                        <p className="font-medium text-gray-900 dark:text-white">{selectedPayment.guestName}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500 dark:text-gray-400">Phone</p>
                                        <p className="font-medium text-gray-900 dark:text-white">{selectedPayment.guestPhone}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500 dark:text-gray-400">Booking ID</p>
                                        <p className="font-medium text-gray-900 dark:text-white">{selectedPayment.bookingId}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500 dark:text-gray-400">Room Number</p>
                                        <p className="font-medium text-gray-900 dark:text-white">{selectedPayment.roomNumber}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Transaction Details */}
                            <div className="rounded-lg border border-gray-200 dark:border-gray-800 p-4">
                                <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                                    <CreditCard className="h-4 w-4" />
                                    Transaction Details
                                </h4>
                                <div className="grid sm:grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <p className="text-gray-500 dark:text-gray-400">Payment Method</p>
                                        <p className="font-medium text-gray-900 dark:text-white">{PAYMENT_METHOD_CONFIG[selectedPayment.paymentMethod].label}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500 dark:text-gray-400">Payment Type</p>
                                        <p className="font-medium text-gray-900 dark:text-white">{PAYMENT_TYPE_LABELS[selectedPayment.paymentType]}</p>
                                    </div>
                                    {selectedPayment.transactionId && (
                                        <div className="sm:col-span-2">
                                            <p className="text-gray-500 dark:text-gray-400">Transaction ID</p>
                                            <p className="font-mono text-xs text-gray-900 dark:text-white">{selectedPayment.transactionId}</p>
                                        </div>
                                    )}
                                    {selectedPayment.upiId && (
                                        <div>
                                            <p className="text-gray-500 dark:text-gray-400">UPI ID</p>
                                            <p className="font-medium text-gray-900 dark:text-white">{selectedPayment.upiId}</p>
                                        </div>
                                    )}
                                    {selectedPayment.cardLast4 && (
                                        <div>
                                            <p className="text-gray-500 dark:text-gray-400">Card Number</p>
                                            <p className="font-medium text-gray-900 dark:text-white">**** **** **** {selectedPayment.cardLast4}</p>
                                        </div>
                                    )}
                                    {selectedPayment.bankName && (
                                        <div>
                                            <p className="text-gray-500 dark:text-gray-400">Bank</p>
                                            <p className="font-medium text-gray-900 dark:text-white">{selectedPayment.bankName}</p>
                                        </div>
                                    )}
                                    {selectedPayment.chequeNumber && (
                                        <div>
                                            <p className="text-gray-500 dark:text-gray-400">Cheque Number</p>
                                            <p className="font-medium text-gray-900 dark:text-white">{selectedPayment.chequeNumber}</p>
                                        </div>
                                    )}
                                    <div>
                                        <p className="text-gray-500 dark:text-gray-400">Date & Time</p>
                                        <p className="font-medium text-gray-900 dark:text-white">{formatDateTime(selectedPayment.createdAt)}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Notes */}
                            {selectedPayment.notes && (
                                <div className="rounded-lg border border-gray-200 dark:border-gray-800 p-4">
                                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                                        <AlertCircle className="h-4 w-4" />
                                        Notes
                                    </h4>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">{selectedPayment.notes}</p>
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className="flex gap-3 pt-2">
                                <Button className="flex-1 gap-2" variant="outline">
                                    <Download className="h-4 w-4" />
                                    Download Invoice
                                </Button>
                                <Button className="flex-1 gap-2" variant="outline">
                                    <ReceiptText className="h-4 w-4" />
                                    Print Receipt
                                </Button>
                                {selectedPayment.status === "pending" && (
                                    <Button className="flex-1 gap-2">
                                        <CheckCircle2 className="h-4 w-4" />
                                        Mark as Paid
                                    </Button>
                                )}
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
