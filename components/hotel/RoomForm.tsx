"use client";

import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Check,
    ChevronRight,
    ChevronLeft,
    X,
    Camera,
    Wifi,
    AirVent,
    Tv,
    Car,
    Coffee,
    Bath,
    Dumbbell,
    Refrigerator,
    Wind,
    Shirt,
    Phone,
    Lock,
    Maximize2,
    IndianRupee,
    Users,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Room } from "@/app/dashboard/rooms/page";

interface RoomFormProps {
    initialData?: Room | null;
    onSubmit: (data: Omit<Room, "id" | "createdAt">) => void;
    onCancel: () => void;
}

const ROOM_TYPES = [
    { value: "standard", label: "Standard", basePrice: 2500 },
    { value: "deluxe", label: "Deluxe", basePrice: 4000 },
    { value: "suite", label: "Suite", basePrice: 7500 },
    { value: "family", label: "Family", basePrice: 5500 },
    { value: "presidential", label: "Presidential", basePrice: 15000 },
];

const BED_TYPES = [
    { value: "single", label: "Single" },
    { value: "double", label: "Double" },
    { value: "queen", label: "Queen" },
    { value: "king", label: "King" },
    { value: "twin", label: "Twin" },
];

const VIEWS = [
    { value: "city", label: "City View" },
    { value: "garden", label: "Garden View" },
    { value: "pool", label: "Pool View" },
    { value: "mountain", label: "Mountain View" },
    { value: "sea", label: "Sea View" },
    { value: "none", label: "No View" },
];

const AMENITIES = [
    { id: "WiFi", label: "WiFi", icon: Wifi },
    { id: "AC", label: "Air Conditioning", icon: AirVent },
    { id: "TV", label: "Television", icon: Tv },
    { id: "Parking", label: "Parking", icon: Car },
    { id: "Coffee Maker", label: "Coffee Maker", icon: Coffee },
    { id: "Bathtub", label: "Bathtub", icon: Bath },
    { id: "Gym Access", label: "Gym Access", icon: Dumbbell },
    { id: "Mini Bar", label: "Mini Bar", icon: Refrigerator },
    { id: "Balcony", label: "Balcony", icon: Wind },
    { id: "Laundry", label: "Laundry Service", icon: Shirt },
    { id: "Room Service", label: "Room Service", icon: Phone },
    { id: "Safe", label: "In-room Safe", icon: Lock },
];

export function RoomForm({ initialData, onSubmit, onCancel }: RoomFormProps) {
    const [step, setStep] = useState(1);
    const photoInputRef = useRef<HTMLInputElement>(null);

    const [form, setForm] = useState({
        name: initialData?.name || "",
        roomNumber: initialData?.roomNumber || "",
        floor: initialData?.floor || 1,
        type: initialData?.type || "standard" as Room["type"],
        bedType: initialData?.bedType || "double" as Room["bedType"],
        view: initialData?.view || "city" as Room["view"],
        basePrice: initialData?.basePrice || 2500,
        weekendPrice: initialData?.weekendPrice || 3000,
        adults: initialData?.capacity?.adults || 2,
        children: initialData?.capacity?.children || 1,
        extraBeds: initialData?.capacity?.extraBeds || 1,
        size: initialData?.size || 300,
        amenities: initialData?.amenities || ["WiFi", "AC", "TV"],
        photos: initialData?.photos || [] as string[],
        description: initialData?.description || "",
        status: initialData?.status || "available" as Room["status"],
    });

    const set = (key: string, value: any) => {
        setForm((prev) => {
            const updated = { ...prev, [key]: value };
            if (key === "type") {
                const roomType = ROOM_TYPES.find((r) => r.value === value);
                if (roomType) {
                    updated.basePrice = roomType.basePrice;
                    updated.weekendPrice = Math.round(roomType.basePrice * 1.2);
                }
            }
            return updated;
        });
    };

    const toggleAmenity = (amenityId: string) => {
        setForm((prev) => ({
            ...prev,
            amenities: prev.amenities.includes(amenityId)
                ? prev.amenities.filter((a) => a !== amenityId)
                : [...prev.amenities, amenityId],
        }));
    };

    const handlePhotoUpload = () => {
        const files = photoInputRef.current?.files;
        if (files) {
            Array.from(files).forEach((file) => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setForm((prev) => ({
                        ...prev,
                        photos: [...prev.photos, reader.result as string],
                    }));
                };
                reader.readAsDataURL(file);
            });
        }
    };

    const removePhoto = (index: number) => {
        setForm((prev) => ({
            ...prev,
            photos: prev.photos.filter((_, i) => i !== index),
        }));
    };

    const handleSubmit = () => {
        onSubmit({
            name: form.name,
            roomNumber: form.roomNumber,
            floor: form.floor,
            type: form.type,
            basePrice: form.basePrice,
            weekendPrice: form.weekendPrice,
            capacity: {
                adults: form.adults,
                children: form.children,
                extraBeds: form.extraBeds,
            },
            size: form.size,
            bedType: form.bedType,
            view: form.view,
            amenities: form.amenities,
            photos: form.photos,
            status: form.status,
            description: form.description,
        });
    };

    // Compact layout with optimized grid
    return (
        <div className="flex flex-col h-full">
            {/* Header Steps - More compact */}
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2 mb-4">
                <div className="flex gap-2">
                    {["Details", "Amenities", "Photos"].map((s, i) => (
                        <button
                            key={s}
                            onClick={() => setStep(i + 1)}
                            className={cn(
                                "flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors",
                                step === i + 1
                                    ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
                                    : "text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800"
                            )}
                        >
                            <div className={cn(
                                "w-4 h-4 rounded-full flex items-center justify-center text-[9px]",
                                step === i + 1 ? "bg-white/20 text-white" : "bg-slate-200 dark:bg-slate-700 text-slate-500"
                            )}>
                                {i + 1}
                            </div>
                            {s}
                        </button>
                    ))}
                </div>
                <div className="text-xs text-slate-400">
                    Step {step} of 3
                </div>
            </div>

            {/* Content Form - Scrollable but minimized */}
            <div className="flex-1 overflow-y-auto pr-2">
                {step === 1 && (
                    <div className="space-y-5">
                        {/* Section 1: Basic Info & Status */}
                        <div className="grid grid-cols-12 gap-4">
                            <div className="col-span-8">
                                <Label className="text-xs text-slate-500">Room Name *</Label>
                                <Input
                                    value={form.name}
                                    onChange={(e) => set("name", e.target.value)}
                                    placeholder="e.g., Deluxe Garden View"
                                    className="mt-1 h-8"
                                />
                            </div>
                            <div className="col-span-4">
                                <Label className="text-xs text-slate-500">Status</Label>
                                <select
                                    value={form.status}
                                    onChange={(e) => set("status", e.target.value)}
                                    className="mt-1 w-full h-8 px-2 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-xs"
                                >
                                    <option value="available">Available</option>
                                    <option value="occupied">Occupied</option>
                                    <option value="maintenance">Maintenance</option>
                                    <option value="cleaning">Cleaning</option>
                                </select>
                            </div>
                        </div>

                        {/* Section 2: Physical Specs */}
                        <div className="p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-100 dark:border-slate-800">
                            <h4 className="text-xs font-semibold text-slate-900 dark:text-white mb-3 flex items-center">
                                <Maximize2 className="w-3 h-3 mr-1" /> Room Specifications
                            </h4>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                <div>
                                    <Label className="text-[10px] uppercase tracking-wider text-slate-500">Room # *</Label>
                                    <Input
                                        value={form.roomNumber}
                                        onChange={(e) => set("roomNumber", e.target.value)}
                                        placeholder="301"
                                        className="mt-1 h-8"
                                    />
                                </div>
                                <div>
                                    <Label className="text-[10px] uppercase tracking-wider text-slate-500">Floor</Label>
                                    <Input
                                        type="number"
                                        min={1}
                                        value={form.floor}
                                        onChange={(e) => set("floor", parseInt(e.target.value) || 1)}
                                        className="mt-1 h-8"
                                    />
                                </div>
                                <div>
                                    <Label className="text-[10px] uppercase tracking-wider text-slate-500">Type</Label>
                                    <select
                                        value={form.type}
                                        onChange={(e) => set("type", e.target.value)}
                                        className="mt-1 w-full h-8 px-2 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-xs"
                                    >
                                        {ROOM_TYPES.map((t) => (
                                            <option key={t.value} value={t.value}>{t.label}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <Label className="text-[10px] uppercase tracking-wider text-slate-500">Size (sq ft)</Label>
                                    <Input
                                        type="number"
                                        min={100}
                                        value={form.size}
                                        onChange={(e) => set("size", parseInt(e.target.value) || 200)}
                                        className="mt-1 h-8"
                                    />
                                </div>
                                <div>
                                    <Label className="text-[10px] uppercase tracking-wider text-slate-500">Bed Type</Label>
                                    <select
                                        value={form.bedType}
                                        onChange={(e) => set("bedType", e.target.value)}
                                        className="mt-1 w-full h-8 px-2 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-xs"
                                    >
                                        {BED_TYPES.map((t) => (
                                            <option key={t.value} value={t.value}>{t.label}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <Label className="text-[10px] uppercase tracking-wider text-slate-500">View</Label>
                                    <select
                                        value={form.view}
                                        onChange={(e) => set("view", e.target.value)}
                                        className="mt-1 w-full h-8 px-2 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-xs"
                                    >
                                        {VIEWS.map((v) => (
                                            <option key={v.value} value={v.value}>{v.label}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Section 3: Pricing & Capacity */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Pricing */}
                            <div className="p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-100 dark:border-slate-800">
                                <h4 className="text-xs font-semibold text-slate-900 dark:text-white mb-3 flex items-center">
                                    <IndianRupee className="w-3 h-3 mr-1" /> Pricing
                                </h4>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <Label className="text-[10px] uppercase tracking-wider text-slate-500">Base Price</Label>
                                        <Input
                                            type="number"
                                            value={form.basePrice}
                                            onChange={(e) => set("basePrice", parseInt(e.target.value) || 0)}
                                            className="mt-1 h-8"
                                        />
                                    </div>
                                    <div>
                                        <Label className="text-[10px] uppercase tracking-wider text-slate-500">Weekend</Label>
                                        <Input
                                            type="number"
                                            value={form.weekendPrice}
                                            onChange={(e) => set("weekendPrice", parseInt(e.target.value) || 0)}
                                            className="mt-1 h-8"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Capacity */}
                            <div className="p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-100 dark:border-slate-800">
                                <h4 className="text-xs font-semibold text-slate-900 dark:text-white mb-3 flex items-center">
                                    <Users className="w-3 h-3 mr-1" /> Capacity
                                </h4>
                                <div className="grid grid-cols-3 gap-3">
                                    <div>
                                        <Label className="text-[10px] uppercase tracking-wider text-slate-500">Adults</Label>
                                        <Input
                                            type="number"
                                            min={1}
                                            value={form.adults}
                                            onChange={(e) => set("adults", parseInt(e.target.value) || 1)}
                                            className="mt-1 h-8"
                                        />
                                    </div>
                                    <div>
                                        <Label className="text-[10px] uppercase tracking-wider text-slate-500">Kids</Label>
                                        <Input
                                            type="number"
                                            min={0}
                                            value={form.children}
                                            onChange={(e) => set("children", parseInt(e.target.value) || 0)}
                                            className="mt-1 h-8"
                                        />
                                    </div>
                                    <div>
                                        <Label className="text-[10px] uppercase tracking-wider text-slate-500">Extra</Label>
                                        <Input
                                            type="number"
                                            min={0}
                                            value={form.extraBeds}
                                            onChange={(e) => set("extraBeds", parseInt(e.target.value) || 0)}
                                            className="mt-1 h-8"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        <div>
                            <Label className="text-xs text-slate-500">Description</Label>
                            <Textarea
                                value={form.description}
                                onChange={(e) => set("description", e.target.value)}
                                placeholder="Room features and highlight..."
                                className="mt-1 h-14 min-h-[56px] text-xs resize-none"
                            />
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div className="space-y-4">
                        <div className="text-center mb-4">
                            <h3 className="font-semibold text-slate-900 dark:text-white">Room Amenities</h3>
                            <p className="text-sm text-slate-500">Select what this room offers</p>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                            {AMENITIES.map((amenity) => {
                                const isSelected = form.amenities.includes(amenity.id);
                                return (
                                    <button
                                        key={amenity.id}
                                        type="button"
                                        onClick={() => toggleAmenity(amenity.id)}
                                        className={cn(
                                            "flex flex-col items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all",
                                            isSelected
                                                ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400"
                                                : "border-slate-100 dark:border-slate-800 hover:border-slate-200 bg-white dark:bg-slate-900"
                                        )}
                                    >
                                        <amenity.icon className={cn("h-6 w-6", isSelected ? "text-emerald-500" : "text-slate-400")} />
                                        <span className="text-xs font-medium">{amenity.label}</span>
                                        {isSelected && (
                                            <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-emerald-500" />
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div className="space-y-6">
                        <div className="text-center">
                            <h3 className="font-semibold text-slate-900 dark:text-white">Room Photos</h3>
                            <p className="text-sm text-slate-500">Add detailed photos of the room</p>
                        </div>

                        {/* Upload Area */}
                        <div
                            onClick={() => photoInputRef.current?.click()}
                            className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl p-10 text-center cursor-pointer hover:border-slate-300 dark:hover:border-slate-600 transition-colors bg-slate-50 dark:bg-slate-800/50"
                        >
                            <Camera className="h-10 w-10 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
                            <p className="font-medium text-slate-700 dark:text-slate-200">
                                Click to upload photos
                            </p>
                            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                                Supports JPG, PNG, WebP (Max 5MB)
                            </p>
                            <input
                                ref={photoInputRef}
                                type="file"
                                accept="image/*"
                                multiple
                                className="hidden"
                                onChange={handlePhotoUpload}
                            />
                        </div>

                        {/* Photo Grid */}
                        {form.photos.length > 0 && (
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                {form.photos.map((photo, index) => (
                                    <div key={index} className="relative aspect-[4/3] rounded-lg overflow-hidden group border border-slate-200 dark:border-slate-700">
                                        <img
                                            src={photo}
                                            alt={`Room photo ${index + 1}`}
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <button
                                                onClick={() => removePhoto(index)}
                                                className="p-2 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors"
                                            >
                                                <X className="h-4 w-4" />
                                            </button>
                                        </div>
                                        {index === 0 && (
                                            <span className="absolute bottom-2 left-2 px-2 py-0.5 bg-black/60 text-white text-[10px] font-medium rounded uppercase tracking-wider backdrop-blur-sm">
                                                Cover
                                            </span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Footer Actions */}
            <div className="flex justify-between mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
                <Button
                    variant="outline"
                    onClick={() => (step === 1 ? onCancel() : setStep(step - 1))}
                >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    {step === 1 ? "Cancel" : "Back"}
                </Button>
                {step < 3 ? (
                    <Button
                        onClick={() => setStep(step + 1)}
                        className="bg-slate-900 hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
                    >
                        Next <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                ) : (
                    <Button
                        onClick={handleSubmit}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white"
                        disabled={!form.name || !form.roomNumber}
                    >
                        <Check className="h-4 w-4 mr-1" />
                        {initialData ? "Update Room" : "Create Room"}
                    </Button>
                )}
            </div>
        </div>
    );
}
