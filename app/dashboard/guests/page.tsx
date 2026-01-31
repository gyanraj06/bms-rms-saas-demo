"use client";

import React, { useState, useEffect } from "react";
import {
    Users,
    Crown,
    Repeat,
    TrendingUp,
    Search,
    Filter,
    UserPlus,
    Phone,
    Mail,
    MapPin,
    Calendar,
    CreditCard,
    Star,
    MoreVertical,
    ExternalLink,
    X,
    Building2,
    FileText,
    Clock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogClose,
} from "@/components/ui/dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

// Guest interface
export interface Guest {
    id: string;
    createdAt: number;

    // Personal Details
    name: string;
    phone: string;
    email: string;
    address: string;
    city: string;
    state: string;
    pincode: string;

    // ID Verification
    idType: "aadhar" | "pan" | "passport" | "driving_license" | "voter_id";
    idNumber: string;

    // Guest Stats
    totalVisits: number;
    totalSpent: number;
    lastVisit: string;

    // VIP Status
    isVip: boolean;
    vipSince?: string;

    // Preferences
    preferredRoom?: string;
    specialNotes?: string;

    // Company Details (for business travelers)
    companyName?: string;
    gstNumber?: string;
}

// Indian demo guest data
const DEMO_GUESTS: Guest[] = [
    {
        id: "GST-001",
        createdAt: Date.now() - 30 * 86400000,
        name: "Rajesh Sharma",
        phone: "+91 98765 43210",
        email: "rajesh.sharma@gmail.com",
        address: "42, MG Road, Andheri West",
        city: "Mumbai",
        state: "Maharashtra",
        pincode: "400058",
        idType: "aadhar",
        idNumber: "1234 5678 9012",
        totalVisits: 12,
        totalSpent: 145000,
        lastVisit: new Date(Date.now() - 2 * 86400000).toISOString().split("T")[0],
        isVip: true,
        vipSince: "2024-06-15",
        preferredRoom: "Deluxe Suite",
        specialNotes: "Prefers high floor rooms. Vegetarian meals only.",
    },
    {
        id: "GST-002",
        createdAt: Date.now() - 60 * 86400000,
        name: "Priya Patel",
        phone: "+91 87654 32109",
        email: "priya.patel@outlook.com",
        address: "15, Satellite Road, Bodakdev",
        city: "Ahmedabad",
        state: "Gujarat",
        pincode: "380054",
        idType: "pan",
        idNumber: "ABCDE1234F",
        totalVisits: 8,
        totalSpent: 98500,
        lastVisit: new Date(Date.now() - 5 * 86400000).toISOString().split("T")[0],
        isVip: true,
        vipSince: "2024-09-20",
        companyName: "TechSoft Solutions Pvt Ltd",
        gstNumber: "24AABCT1234E1ZH",
        preferredRoom: "Business Suite",
    },
    {
        id: "GST-003",
        createdAt: Date.now() - 90 * 86400000,
        name: "Amit Kumar Singh",
        phone: "+91 99887 76655",
        email: "amit.singh@yahoo.com",
        address: "78, Connaught Place",
        city: "New Delhi",
        state: "Delhi",
        pincode: "110001",
        idType: "driving_license",
        idNumber: "DL-1420110012345",
        totalVisits: 3,
        totalSpent: 22500,
        lastVisit: new Date(Date.now() - 30 * 86400000).toISOString().split("T")[0],
        isVip: false,
    },
    {
        id: "GST-004",
        createdAt: Date.now() - 120 * 86400000,
        name: "Sunita Verma",
        phone: "+91 77889 99001",
        email: "sunita.verma@rediffmail.com",
        address: "23, Brigade Road",
        city: "Bengaluru",
        state: "Karnataka",
        pincode: "560025",
        idType: "passport",
        idNumber: "J8765432",
        totalVisits: 5,
        totalSpent: 67000,
        lastVisit: new Date(Date.now() - 10 * 86400000).toISOString().split("T")[0],
        isVip: false,
        preferredRoom: "Family Suite",
        specialNotes: "Needs extra beds for children. Early check-in preferred.",
    },
    {
        id: "GST-005",
        createdAt: Date.now() - 45 * 86400000,
        name: "Karthik Rajan",
        phone: "+91 94433 22110",
        email: "karthik.rajan@gmail.com",
        address: "56, Anna Salai",
        city: "Chennai",
        state: "Tamil Nadu",
        pincode: "600002",
        idType: "voter_id",
        idNumber: "ABC1234567",
        totalVisits: 15,
        totalSpent: 189000,
        lastVisit: new Date(Date.now() - 1 * 86400000).toISOString().split("T")[0],
        isVip: true,
        vipSince: "2024-03-10",
        preferredRoom: "Presidential Suite",
        specialNotes: "Loyalty program gold member. Complimentary upgrade when available.",
    },
    {
        id: "GST-006",
        createdAt: Date.now() - 75 * 86400000,
        name: "Anjali Deshmukh",
        phone: "+91 92234 55677",
        email: "anjali.d@hotmail.com",
        address: "12, FC Road, Shivaji Nagar",
        city: "Pune",
        state: "Maharashtra",
        pincode: "411005",
        idType: "aadhar",
        idNumber: "9876 5432 1098",
        totalVisits: 6,
        totalSpent: 54000,
        lastVisit: new Date(Date.now() - 15 * 86400000).toISOString().split("T")[0],
        isVip: false,
        companyName: "Infosys Ltd",
        gstNumber: "27AABCI1234B1ZC",
    },
    {
        id: "GST-007",
        createdAt: Date.now() - 180 * 86400000,
        name: "Mohammed Ismail",
        phone: "+91 81234 56789",
        email: "m.ismail@gmail.com",
        address: "34, Charminar Road",
        city: "Hyderabad",
        state: "Telangana",
        pincode: "500002",
        idType: "pan",
        idNumber: "FGHIJ5678K",
        totalVisits: 9,
        totalSpent: 112000,
        lastVisit: new Date(Date.now() - 7 * 86400000).toISOString().split("T")[0],
        isVip: true,
        vipSince: "2024-07-01",
        specialNotes: "Halal food only. Late checkout requested.",
    },
    {
        id: "GST-008",
        createdAt: Date.now() - 200 * 86400000,
        name: "Deepika Nair",
        phone: "+91 94456 78901",
        email: "deepika.nair@yahoo.co.in",
        address: "89, Marine Drive",
        city: "Kochi",
        state: "Kerala",
        pincode: "682001",
        idType: "aadhar",
        idNumber: "5678 9012 3456",
        totalVisits: 4,
        totalSpent: 38000,
        lastVisit: new Date(Date.now() - 25 * 86400000).toISOString().split("T")[0],
        isVip: false,
        preferredRoom: "Sea View Room",
    },
    {
        id: "GST-009",
        createdAt: Date.now() - 150 * 86400000,
        name: "Vikram Chauhan",
        phone: "+91 98123 45678",
        email: "vikram.c@corporation.in",
        address: "101, CG Road",
        city: "Ahmedabad",
        state: "Gujarat",
        pincode: "380006",
        idType: "driving_license",
        idNumber: "GJ-0120150098765",
        totalVisits: 18,
        totalSpent: 245000,
        lastVisit: new Date().toISOString().split("T")[0],
        isVip: true,
        vipSince: "2023-12-01",
        companyName: "Adani Group",
        gstNumber: "24AABCA1234D1ZE",
        preferredRoom: "Executive Suite",
        specialNotes: "Board member. VIP treatment required. Personal butler service.",
    },
    {
        id: "GST-010",
        createdAt: Date.now() - 100 * 86400000,
        name: "Meera Iyer",
        phone: "+91 96785 43210",
        email: "meera.iyer@infosys.com",
        address: "45, Residency Road",
        city: "Bengaluru",
        state: "Karnataka",
        pincode: "560025",
        idType: "passport",
        idNumber: "K9876543",
        totalVisits: 2,
        totalSpent: 15000,
        lastVisit: new Date(Date.now() - 45 * 86400000).toISOString().split("T")[0],
        isVip: false,
    },
    {
        id: "GST-011",
        createdAt: Date.now() - 85 * 86400000,
        name: "Arjun Malhotra",
        phone: "+91 88990 11223",
        email: "arjun.malhotra@gmail.com",
        address: "67, Civil Lines",
        city: "Jaipur",
        state: "Rajasthan",
        pincode: "302006",
        idType: "aadhar",
        idNumber: "3456 7890 1234",
        totalVisits: 7,
        totalSpent: 78500,
        lastVisit: new Date(Date.now() - 12 * 86400000).toISOString().split("T")[0],
        isVip: false,
        specialNotes: "Prefers rooms with balcony. Wine enthusiast.",
    },
    {
        id: "GST-012",
        createdAt: Date.now() - 50 * 86400000,
        name: "Sneha Kapoor",
        phone: "+91 97654 32100",
        email: "sneha.kapoor@outlook.com",
        address: "23, Park Street",
        city: "Kolkata",
        state: "West Bengal",
        pincode: "700016",
        idType: "pan",
        idNumber: "KLMNO6789P",
        totalVisits: 11,
        totalSpent: 134000,
        lastVisit: new Date(Date.now() - 3 * 86400000).toISOString().split("T")[0],
        isVip: true,
        vipSince: "2024-08-15",
        companyName: "TATA Consultancy Services",
        gstNumber: "19AABCT1234F1ZG",
        preferredRoom: "Club Room",
    },
    {
        id: "GST-013",
        createdAt: Date.now() - 130 * 86400000,
        name: "Rohit Bansal",
        phone: "+91 85432 10987",
        email: "rohit.b@snapdeal.com",
        address: "156, Sector 62",
        city: "Noida",
        state: "Uttar Pradesh",
        pincode: "201301",
        idType: "voter_id",
        idNumber: "DEF4567890",
        totalVisits: 4,
        totalSpent: 42000,
        lastVisit: new Date(Date.now() - 20 * 86400000).toISOString().split("T")[0],
        isVip: false,
        companyName: "Snapdeal",
    },
    {
        id: "GST-014",
        createdAt: Date.now() - 220 * 86400000,
        name: "Lakshmi Venkatesh",
        phone: "+91 93456 78012",
        email: "lakshmi.v@wipro.com",
        address: "78, Sarjapur Road, Marathahalli",
        city: "Bengaluru",
        state: "Karnataka",
        pincode: "560037",
        idType: "aadhar",
        idNumber: "7890 1234 5678",
        totalVisits: 6,
        totalSpent: 56000,
        lastVisit: new Date(Date.now() - 8 * 86400000).toISOString().split("T")[0],
        isVip: false,
        companyName: "Wipro Limited",
        gstNumber: "29AABCW1234H1ZI",
        preferredRoom: "Standard Double",
    },
    {
        id: "GST-015",
        createdAt: Date.now() - 40 * 86400000,
        name: "Sanjay Gupta",
        phone: "+91 99001 22334",
        email: "sanjay.gupta@hdfcbank.com",
        address: "12, Linking Road, Bandra",
        city: "Mumbai",
        state: "Maharashtra",
        pincode: "400050",
        idType: "pan",
        idNumber: "PQRST9012U",
        totalVisits: 20,
        totalSpent: 320000,
        lastVisit: new Date().toISOString().split("T")[0],
        isVip: true,
        vipSince: "2023-06-01",
        companyName: "HDFC Bank",
        gstNumber: "27AABCH1234J1ZK",
        preferredRoom: "Penthouse Suite",
        specialNotes: "Senior VP. Airport pickup required. Premium services.",
    },
];

const ID_TYPE_LABELS: Record<string, string> = {
    aadhar: "Aadhar Card",
    pan: "PAN Card",
    passport: "Passport",
    driving_license: "Driving License",
    voter_id: "Voter ID",
};

export default function GuestsPage() {
    const [guests, setGuests] = useState<Guest[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [filterVip, setFilterVip] = useState<"all" | "vip" | "regular">("all");
    const [selectedGuest, setSelectedGuest] = useState<Guest | null>(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);

    useEffect(() => {
        const saved = localStorage.getItem("hotel_guests");
        if (saved) {
            const parsed = JSON.parse(saved);
            if (parsed.length > 0) {
                setGuests(parsed);
            } else {
                setGuests(DEMO_GUESTS);
                localStorage.setItem("hotel_guests", JSON.stringify(DEMO_GUESTS));
            }
        } else {
            setGuests(DEMO_GUESTS);
            localStorage.setItem("hotel_guests", JSON.stringify(DEMO_GUESTS));
        }
    }, []);

    // Filter guests
    const filteredGuests = guests.filter((guest) => {
        const matchesSearch =
            guest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            guest.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            guest.phone.includes(searchQuery) ||
            guest.city.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesVip =
            filterVip === "all" ||
            (filterVip === "vip" && guest.isVip) ||
            (filterVip === "regular" && !guest.isVip);

        return matchesSearch && matchesVip;
    });

    // Calculate stats
    const stats = {
        totalGuests: guests.length,
        vipGuests: guests.filter((g) => g.isVip).length,
        returningGuests: guests.filter((g) => g.totalVisits > 1).length,
        totalRevenue: guests.reduce((sum, g) => sum + g.totalSpent, 0),
    };

    const openGuestDetail = (guest: Guest) => {
        setSelectedGuest(guest);
        setIsDetailOpen(true);
    };

    const getInitials = (name: string) => {
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 0,
        }).format(amount);
    };

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
        });
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-serif text-gray-900 dark:text-white">Guests</h1>
                    <p className="text-gray-500 dark:text-gray-400">Manage your guest database and profiles</p>
                </div>
                <Button className="gap-2">
                    <UserPlus className="h-4 w-4" />
                    Add Guest
                </Button>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-black p-5 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div className="rounded-lg bg-blue-50 dark:bg-blue-950/50 p-2.5">
                            <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <span className="text-xs font-medium text-green-600">Active</span>
                    </div>
                    <div className="mt-3">
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Guests</p>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stats.totalGuests}</h3>
                    </div>
                </div>
                <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-black p-5 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div className="rounded-lg bg-amber-50 dark:bg-amber-950/50 p-2.5">
                            <Crown className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                        </div>
                        <span className="text-xs font-medium text-amber-600">Premium</span>
                    </div>
                    <div className="mt-3">
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">VIP Guests</p>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stats.vipGuests}</h3>
                    </div>
                </div>
                <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-black p-5 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div className="rounded-lg bg-purple-50 dark:bg-purple-950/50 p-2.5">
                            <Repeat className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                        </div>
                        <span className="text-xs font-medium text-purple-600">Loyal</span>
                    </div>
                    <div className="mt-3">
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Returning Guests</p>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stats.returningGuests}</h3>
                    </div>
                </div>
                <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-black p-5 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div className="rounded-lg bg-green-50 dark:bg-green-950/50 p-2.5">
                            <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />
                        </div>
                        <span className="text-xs font-medium text-green-600">Revenue</span>
                    </div>
                    <div className="mt-3">
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Revenue</p>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{formatCurrency(stats.totalRevenue)}</h3>
                    </div>
                </div>
            </div>

            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                        placeholder="Search by name, email, phone, or city..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                    />
                </div>
                <div className="flex gap-2">
                    <Button
                        variant={filterVip === "all" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setFilterVip("all")}
                    >
                        All
                    </Button>
                    <Button
                        variant={filterVip === "vip" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setFilterVip("vip")}
                        className="gap-1.5"
                    >
                        <Crown className="h-3.5 w-3.5" />
                        VIP
                    </Button>
                    <Button
                        variant={filterVip === "regular" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setFilterVip("regular")}
                    >
                        Regular
                    </Button>
                </div>
            </div>

            {/* Guests Grid */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filteredGuests.map((guest) => (
                    <div
                        key={guest.id}
                        onClick={() => openGuestDetail(guest)}
                        className="group rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-black p-5 shadow-sm hover:border-blue-500 dark:hover:border-blue-500 hover:shadow-md cursor-pointer transition-all"
                    >
                        <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                                <div className={cn(
                                    "h-12 w-12 rounded-full flex items-center justify-center font-semibold text-lg",
                                    guest.isVip
                                        ? "bg-gradient-to-br from-amber-400 to-amber-600 text-white"
                                        : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                                )}>
                                    {getInitials(guest.name)}
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h3 className="font-semibold text-gray-900 dark:text-white">{guest.name}</h3>
                                        {guest.isVip && (
                                            <Badge className="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-0 text-[10px] px-1.5">
                                                <Crown className="h-2.5 w-2.5 mr-0.5" />
                                                VIP
                                            </Badge>
                                        )}
                                    </div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">{guest.city}, {guest.state}</p>
                                </div>
                            </div>
                            <DropdownMenu>
                                <DropdownMenuTrigger className="inline-flex items-center justify-center h-8 w-8 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800" onClick={(e) => e.stopPropagation()}>
                                    <MoreVertical className="h-4 w-4" />
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    <DropdownMenuItem onClick={(e) => { e.stopPropagation(); window.location.href = `tel:${guest.phone}`; }}>
                                        <Phone className="h-4 w-4 mr-2" />
                                        Call
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={(e) => { e.stopPropagation(); window.location.href = `mailto:${guest.email}`; }}>
                                        <Mail className="h-4 w-4 mr-2" />
                                        Email
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={(e) => { e.stopPropagation(); openGuestDetail(guest); }}>
                                        <ExternalLink className="h-4 w-4 mr-2" />
                                        View Profile
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>

                        <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                            <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                                <Phone className="h-3.5 w-3.5" />
                                <span className="truncate">{guest.phone}</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                                <Mail className="h-3.5 w-3.5" />
                                <span className="truncate">{guest.email.split("@")[0]}@...</span>
                            </div>
                        </div>

                        <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800 grid grid-cols-3 gap-2 text-center">
                            <div>
                                <p className="text-xs text-gray-500 dark:text-gray-400">Visits</p>
                                <p className="font-semibold text-gray-900 dark:text-white">{guest.totalVisits}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 dark:text-gray-400">Spent</p>
                                <p className="font-semibold text-gray-900 dark:text-white">{formatCurrency(guest.totalSpent)}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 dark:text-gray-400">Last Visit</p>
                                <p className="font-semibold text-gray-900 dark:text-white text-xs">
                                    {formatDate(guest.lastVisit).replace(", ", "\n")}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {filteredGuests.length === 0 && (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                    <Users className="h-12 w-12 text-gray-300 dark:text-gray-700 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">No guests found</h3>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">Try adjusting your search or filter criteria</p>
                </div>
            )}

            {/* Guest Detail Modal */}
            <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-3">
                            <div className={cn(
                                "h-12 w-12 rounded-full flex items-center justify-center font-semibold text-lg",
                                selectedGuest?.isVip
                                    ? "bg-gradient-to-br from-amber-400 to-amber-600 text-white"
                                    : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                            )}>
                                {selectedGuest && getInitials(selectedGuest.name)}
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <span>{selectedGuest?.name}</span>
                                    {selectedGuest?.isVip && (
                                        <Badge className="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-0">
                                            <Crown className="h-3 w-3 mr-1" />
                                            VIP since {selectedGuest.vipSince && formatDate(selectedGuest.vipSince)}
                                        </Badge>
                                    )}
                                </div>
                                <p className="text-sm font-normal text-gray-500 dark:text-gray-400">
                                    Guest ID: {selectedGuest?.id}
                                </p>
                            </div>
                        </DialogTitle>
                    </DialogHeader>

                    {selectedGuest && (
                        <div className="space-y-6 mt-4">
                            {/* Contact Information */}
                            <div className="rounded-lg border border-gray-200 dark:border-gray-800 p-4">
                                <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                                    <Phone className="h-4 w-4" />
                                    Contact Information
                                </h4>
                                <div className="grid sm:grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <p className="text-gray-500 dark:text-gray-400">Phone</p>
                                        <p className="font-medium text-gray-900 dark:text-white">{selectedGuest.phone}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500 dark:text-gray-400">Email</p>
                                        <p className="font-medium text-gray-900 dark:text-white">{selectedGuest.email}</p>
                                    </div>
                                    <div className="sm:col-span-2">
                                        <p className="text-gray-500 dark:text-gray-400">Address</p>
                                        <p className="font-medium text-gray-900 dark:text-white">
                                            {selectedGuest.address}, {selectedGuest.city}, {selectedGuest.state} - {selectedGuest.pincode}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* ID Verification */}
                            <div className="rounded-lg border border-gray-200 dark:border-gray-800 p-4">
                                <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                                    <FileText className="h-4 w-4" />
                                    ID Verification
                                </h4>
                                <div className="grid sm:grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <p className="text-gray-500 dark:text-gray-400">ID Type</p>
                                        <p className="font-medium text-gray-900 dark:text-white">{ID_TYPE_LABELS[selectedGuest.idType]}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500 dark:text-gray-400">ID Number</p>
                                        <p className="font-medium text-gray-900 dark:text-white">{selectedGuest.idNumber}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Company Details (if available) */}
                            {selectedGuest.companyName && (
                                <div className="rounded-lg border border-gray-200 dark:border-gray-800 p-4">
                                    <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                                        <Building2 className="h-4 w-4" />
                                        Company Details
                                    </h4>
                                    <div className="grid sm:grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <p className="text-gray-500 dark:text-gray-400">Company Name</p>
                                            <p className="font-medium text-gray-900 dark:text-white">{selectedGuest.companyName}</p>
                                        </div>
                                        {selectedGuest.gstNumber && (
                                            <div>
                                                <p className="text-gray-500 dark:text-gray-400">GST Number</p>
                                                <p className="font-medium text-gray-900 dark:text-white">{selectedGuest.gstNumber}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Stay Statistics */}
                            <div className="rounded-lg border border-gray-200 dark:border-gray-800 p-4">
                                <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                                    <Star className="h-4 w-4" />
                                    Stay Statistics
                                </h4>
                                <div className="grid grid-cols-3 gap-4 text-center">
                                    <div className="rounded-lg bg-gray-50 dark:bg-gray-900 p-3">
                                        <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{selectedGuest.totalVisits}</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">Total Visits</p>
                                    </div>
                                    <div className="rounded-lg bg-gray-50 dark:bg-gray-900 p-3">
                                        <p className="text-2xl font-bold text-green-600 dark:text-green-400">{formatCurrency(selectedGuest.totalSpent)}</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">Total Spent</p>
                                    </div>
                                    <div className="rounded-lg bg-gray-50 dark:bg-gray-900 p-3">
                                        <p className="text-sm font-bold text-gray-900 dark:text-white">{formatDate(selectedGuest.lastVisit)}</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">Last Visit</p>
                                    </div>
                                </div>
                            </div>

                            {/* Preferences & Notes */}
                            {(selectedGuest.preferredRoom || selectedGuest.specialNotes) && (
                                <div className="rounded-lg border border-gray-200 dark:border-gray-800 p-4">
                                    <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                                        <Clock className="h-4 w-4" />
                                        Preferences & Notes
                                    </h4>
                                    <div className="space-y-3 text-sm">
                                        {selectedGuest.preferredRoom && (
                                            <div>
                                                <p className="text-gray-500 dark:text-gray-400">Preferred Room Type</p>
                                                <p className="font-medium text-gray-900 dark:text-white">{selectedGuest.preferredRoom}</p>
                                            </div>
                                        )}
                                        {selectedGuest.specialNotes && (
                                            <div>
                                                <p className="text-gray-500 dark:text-gray-400">Special Notes</p>
                                                <p className="font-medium text-gray-900 dark:text-white">{selectedGuest.specialNotes}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className="flex gap-3 pt-2">
                                <Button className="flex-1 gap-2" variant="outline" onClick={() => window.location.href = `tel:${selectedGuest.phone}`}>
                                    <Phone className="h-4 w-4" />
                                    Call Guest
                                </Button>
                                <Button className="flex-1 gap-2" variant="outline" onClick={() => window.location.href = `mailto:${selectedGuest.email}`}>
                                    <Mail className="h-4 w-4" />
                                    Send Email
                                </Button>
                                <Button className="flex-1 gap-2">
                                    <Calendar className="h-4 w-4" />
                                    New Booking
                                </Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
