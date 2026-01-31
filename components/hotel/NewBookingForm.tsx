"use client";

import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    User,
    Phone,
    Mail,
    MapPin,
    Calendar,
    Building2,
    FileText,
    Camera,
    Check,
    ChevronRight,
    ChevronLeft,
    CheckCircle2,
    CreditCard,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Booking } from "@/app/dashboard/bookings/page";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";

interface NewBookingFormProps {
    onSubmit: (booking: Omit<Booking, "id" | "createdAt" | "status">) => void;
}

const STATES = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
    "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
    "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
    "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
    "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
    "Delhi", "Jammu & Kashmir", "Ladakh"
];

const ID_TYPES = [
    { value: "aadhar", label: "Aadhar Card" },
    { value: "pan", label: "PAN Card" },
    { value: "passport", label: "Passport" },
    { value: "driving_license", label: "Driving License" },
    { value: "voter_id", label: "Voter ID" },
];

const ROOM_TYPES = [
    { value: "standard", label: "Standard", price: 2500 },
    { value: "deluxe", label: "Deluxe", price: 4000 },
    { value: "suite", label: "Suite", price: 7500 },
    { value: "family", label: "Family", price: 5500 },
    { value: "presidential", label: "Presidential", price: 15000 },
];

const PURPOSES = ["Leisure", "Business", "Wedding", "Medical", "Family Visit", "Transit", "Other"];

export function NewBookingForm({ onSubmit }: NewBookingFormProps) {
    const [step, setStep] = useState(1);
    const [showPaymentSuccess, setShowPaymentSuccess] = useState(false);
    const fileRef = useRef<HTMLInputElement>(null);
    const idFrontRef = useRef<HTMLInputElement>(null);
    const idBackRef = useRef<HTMLInputElement>(null);

    const [form, setForm] = useState({
        guestName: "", phone: "", email: "", address: "", city: "", state: "Maharashtra", pincode: "",
        idType: "aadhar" as Booking["idType"], idNumber: "",
        guestPhoto: "", idFrontPhoto: "", idBackPhoto: "",
        checkIn: "", checkOut: "", roomType: "standard", roomNumber: "",
        adults: 1, children: 0, extraBeds: 0,
        purpose: "Leisure", companyName: "", gstNumber: "",
        totalAmount: 2500, advanceAmount: 0, paymentMode: "cash" as Booking["paymentMode"],
        specialRequests: "",
    });

    const set = (k: string, v: any) => {
        setForm((p) => {
            const u = { ...p, [k]: v };
            if (k === "roomType" || k === "checkIn" || k === "checkOut") {
                const room = ROOM_TYPES.find(r => r.value === (k === "roomType" ? v : p.roomType));
                const ci = k === "checkIn" ? v : p.checkIn;
                const co = k === "checkOut" ? v : p.checkOut;
                if (room && ci && co) {
                    const nights = Math.max(1, Math.ceil((new Date(co).getTime() - new Date(ci).getTime()) / 86400000));
                    u.totalAmount = room.price * nights;
                }
            }
            return u;
        });
    };

    const upload = (field: string, ref: React.RefObject<HTMLInputElement | null>) => {
        const file = ref.current?.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => set(field, reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    const nights = form.checkIn && form.checkOut
        ? Math.max(1, Math.ceil((new Date(form.checkOut).getTime() - new Date(form.checkIn).getTime()) / 86400000))
        : 1;

    const [rooms, setRooms] = useState<any[]>([]);

    useEffect(() => {
        const stored = localStorage.getItem("hotel_rooms");
        if (stored) {
            try {
                setRooms(JSON.parse(stored));
            } catch (e) {
                console.error("Failed to parse rooms", e);
            }
        }
    }, []);

    const availableRooms = rooms.filter(r =>
        r.type === form.roomType &&
        r.status === "available"
    );

    const steps = ["Guest", "ID Proof", "Stay", "Payment"];

    return (
        <div className="max-w-2xl mx-auto">
            {/* Steps */}
            <div className="flex items-center justify-between mb-8">
                {steps.map((s, i) => (
                    <div key={s} className="flex items-center">
                        <button
                            onClick={() => {
                                if (step > i + 1) setStep(i + 1);
                            }}
                            disabled={step <= i + 1}
                            className={cn(
                                "w-8 h-8 rounded-full text-xs font-medium flex items-center justify-center transition-all",
                                step === i + 1 ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900" :
                                    step > i + 1 ? "bg-emerald-500 text-white" :
                                        "bg-slate-100 text-slate-400 dark:bg-slate-800"
                            )}
                        >
                            {step > i + 1 ? <Check className="h-4 w-4" /> : i + 1}
                        </button>
                        <span className={cn("ml-2 text-xs font-medium hidden sm:block", step === i + 1 ? "text-slate-900 dark:text-white" : "text-slate-400")}>
                            {s}
                        </span>
                        {i < 3 && <div className="w-8 sm:w-16 h-px bg-slate-200 dark:bg-slate-700 mx-3" />}
                    </div>
                ))}
            </div>

            {/* Form */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6">
                {step === 1 && (
                    <div className="space-y-4">
                        <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Guest Information</h3>
                        <div>
                            <Label className="text-xs">Full Name *</Label>
                            <Input value={form.guestName} onChange={e => set("guestName", e.target.value)} className="mt-1" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label className="text-xs">Phone *</Label>
                                <Input value={form.phone} onChange={e => set("phone", e.target.value)} className="mt-1" placeholder="+91" />
                            </div>
                            <div>
                                <Label className="text-xs">Email</Label>
                                <Input type="email" value={form.email} onChange={e => set("email", e.target.value)} className="mt-1" />
                            </div>
                        </div>
                        <div>
                            <Label className="text-xs">Address</Label>
                            <Textarea value={form.address} onChange={e => set("address", e.target.value)} className="mt-1 min-h-[60px]" />
                        </div>
                        <div className="grid grid-cols-3 gap-3">
                            <div>
                                <Label className="text-xs">City *</Label>
                                <Input value={form.city} onChange={e => set("city", e.target.value)} className="mt-1" />
                            </div>
                            <div>
                                <Label className="text-xs">State *</Label>
                                <select value={form.state} onChange={e => set("state", e.target.value)}
                                    className="mt-1 w-full h-10 px-3 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-sm">
                                    {STATES.map(s => <option key={s}>{s}</option>)}
                                </select>
                            </div>
                            <div>
                                <Label className="text-xs">PIN</Label>
                                <Input value={form.pincode} onChange={e => set("pincode", e.target.value)} className="mt-1" />
                            </div>
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div className="space-y-4">
                        <h3 className="font-semibold text-slate-900 dark:text-white mb-4">ID Verification</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label className="text-xs">ID Type *</Label>
                                <select value={form.idType} onChange={e => set("idType", e.target.value)}
                                    className="mt-1 w-full h-10 px-3 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-sm">
                                    {ID_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                                </select>
                            </div>
                            <div>
                                <Label className="text-xs">ID Number *</Label>
                                <Input value={form.idNumber} onChange={e => set("idNumber", e.target.value)} className="mt-1" />
                            </div>
                        </div>
                        <div className="grid grid-cols-3 gap-3 pt-2">
                            {[
                                { label: "Photo", field: "guestPhoto", ref: fileRef, icon: Camera },
                                { label: "ID Front", field: "idFrontPhoto", ref: idFrontRef, icon: FileText },
                                { label: "ID Back", field: "idBackPhoto", ref: idBackRef, icon: FileText },
                            ].map(({ label, field, ref, icon: Icon }) => (
                                <div key={field}>
                                    <Label className="text-xs">{label}</Label>
                                    <div
                                        onClick={() => ref.current?.click()}
                                        className={cn(
                                            "mt-1 aspect-square rounded-lg border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-colors",
                                            (form as any)[field] ? "border-emerald-400 bg-emerald-50 dark:bg-emerald-950/20" : "border-slate-200 dark:border-slate-700 hover:border-slate-300"
                                        )}
                                    >
                                        {(form as any)[field] ? (
                                            <img src={(form as any)[field]} className="w-full h-full object-cover rounded-lg" />
                                        ) : (
                                            <Icon className="h-6 w-6 text-slate-300" />
                                        )}
                                    </div>
                                    <input ref={ref} type="file" accept="image/*" className="hidden" onChange={() => upload(field, ref)} />
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div className="space-y-4">
                        <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Stay Details</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label className="text-xs">Check-in *</Label>
                                <Input type="date" value={form.checkIn} onChange={e => set("checkIn", e.target.value)} className="mt-1" />
                            </div>
                            <div>
                                <Label className="text-xs">Check-out *</Label>
                                <Input type="date" value={form.checkOut} onChange={e => set("checkOut", e.target.value)} className="mt-1" />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label className="text-xs">Room Type</Label>
                                <select value={form.roomType} onChange={e => set("roomType", e.target.value)}
                                    className="mt-1 w-full h-10 px-3 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-sm">
                                    {ROOM_TYPES.map(r => <option key={r.value} value={r.value}>{r.label} — ₹{r.price}</option>)}
                                </select>
                            </div>
                            <div>
                                <Label className="text-xs">Room # *</Label>
                                {availableRooms.length > 0 ? (
                                    <select
                                        value={form.roomNumber}
                                        onChange={e => set("roomNumber", e.target.value)}
                                        className="mt-1 w-full h-10 px-3 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-sm"
                                    >
                                        <option value="">Select Room</option>
                                        {availableRooms.map(r => (
                                            <option key={r.id} value={r.id}>{r.roomNumber} ({r.name})</option>
                                        ))}
                                    </select>
                                ) : (
                                    <Input
                                        value={form.roomNumber}
                                        onChange={e => set("roomNumber", e.target.value)}
                                        className="mt-1"
                                        placeholder="Enter manually or select type"
                                    />
                                )}
                            </div>
                        </div>
                        <div className="grid grid-cols-3 gap-3">
                            <div>
                                <Label className="text-xs">Adults</Label>
                                <Input type="number" min={1} value={form.adults} onChange={e => set("adults", +e.target.value || 1)} className="mt-1" />
                            </div>
                            <div>
                                <Label className="text-xs">Children</Label>
                                <Input type="number" min={0} value={form.children} onChange={e => set("children", +e.target.value || 0)} className="mt-1" />
                            </div>
                            <div>
                                <Label className="text-xs">Extra Beds</Label>
                                <Input type="number" min={0} max={3} value={form.extraBeds} onChange={e => set("extraBeds", +e.target.value || 0)} className="mt-1" />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label className="text-xs">Purpose</Label>
                                <select value={form.purpose} onChange={e => set("purpose", e.target.value)}
                                    className="mt-1 w-full h-10 px-3 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-sm">
                                    {PURPOSES.map(p => <option key={p}>{p}</option>)}
                                </select>
                            </div>
                            <div>
                                <Label className="text-xs">Company</Label>
                                <Input value={form.companyName} onChange={e => set("companyName", e.target.value)} className="mt-1" />
                            </div>
                        </div>
                    </div>
                )}

                {step === 4 && (
                    <div className="space-y-4">
                        <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Payment</h3>
                        <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                            <div className="flex justify-between text-sm mb-2">
                                <span className="text-slate-500">{ROOM_TYPES.find(r => r.value === form.roomType)?.label} × {nights} night(s)</span>
                                <span className="font-semibold">₹{form.totalAmount.toLocaleString()}</span>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label className="text-xs">Advance</Label>
                                <Input type="number" min={0} value={form.advanceAmount} onChange={e => set("advanceAmount", +e.target.value || 0)} className="mt-1" />
                            </div>
                            <div>
                                <Label className="text-xs">Payment Mode</Label>
                                <select value={form.paymentMode} onChange={e => set("paymentMode", e.target.value)}
                                    className="mt-1 w-full h-10 px-3 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-sm">
                                    <option value="cash">Cash</option>
                                    <option value="card">Card</option>
                                    <option value="upi">UPI</option>
                                    <option value="bank_transfer">Bank Transfer</option>
                                </select>
                            </div>
                        </div>
                        <div>
                            <Label className="text-xs">Special Requests</Label>
                            <Textarea value={form.specialRequests} onChange={e => set("specialRequests", e.target.value)} className="mt-1 min-h-[80px]" />
                        </div>
                    </div>
                )}

                {/* Nav */}
                <div className="flex justify-between mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
                    <Button variant="ghost" onClick={() => setStep(Math.max(1, step - 1))} disabled={step === 1}>
                        <ChevronLeft className="h-4 w-4 mr-1" /> Back
                    </Button>
                    {step < 4 ? (
                        <Button onClick={() => setStep(step + 1)} className="bg-slate-900 hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100">
                            Next <ChevronRight className="h-4 w-4 ml-1" />
                        </Button>
                    ) : (
                        <Button
                            onClick={() => setShowPaymentSuccess(true)}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white"
                        >
                            <CreditCard className="h-4 w-4 mr-1" /> Make Payment
                        </Button>
                    )}
                </div>
            </div>

            {/* Payment Success Dialog */}
            <Dialog open={showPaymentSuccess} onOpenChange={setShowPaymentSuccess}>
                <DialogContent className="sm:max-w-md">
                    <div className="flex flex-col items-center justify-center py-6 text-center">
                        <div className="h-16 w-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mb-4">
                            <CheckCircle2 className="h-10 w-10 text-emerald-600 dark:text-emerald-500" />
                        </div>
                        <DialogTitle className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                            Payment Successful!
                        </DialogTitle>
                        <p className="text-slate-500 dark:text-slate-400 mb-6 text-sm text-center">
                            Payment of <span className="font-semibold text-slate-900 dark:text-white">₹{form.totalAmount.toLocaleString()}</span> has been processed successfully. The booking has been confirmed.
                        </p>
                        <DialogFooter className="w-full">
                            <Button
                                className="w-full bg-slate-900 text-white hover:bg-slate-800"
                                onClick={() => {
                                    setShowPaymentSuccess(false);
                                    onSubmit(form);
                                }}
                            >
                                Done
                            </Button>
                        </DialogFooter>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
