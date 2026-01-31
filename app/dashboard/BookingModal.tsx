"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogClose,
} from "@/components/ui/dialog"

interface BookingModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function BookingModal({ open, onOpenChange }: BookingModalProps) {
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000))

        setIsLoading(false)
        onOpenChange(false)
        // Here you would typically trigger a toast or refresh data
        alert("Booking created successfully (Mock)")
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogClose onClick={() => onOpenChange(false)} />
                <DialogHeader>
                    <DialogTitle>New Booking</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="checkIn">Check In</Label>
                            <Input id="checkIn" type="date" required />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="checkOut">Check Out</Label>
                            <Input id="checkOut" type="date" required />
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="name">Guest Name</Label>
                        <Input id="name" placeholder="John Doe" required />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" placeholder="john@example.com" required />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="guests">Guests</Label>
                            <Input id="guests" type="number" min="1" defaultValue="2" required />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="roomType">Room Type</Label>
                            <Select>
                                <SelectTrigger id="roomType">
                                    <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="standard">Standard King</SelectItem>
                                    <SelectItem value="deluxe">Deluxe Suite</SelectItem>
                                    <SelectItem value="family">Family Room</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 mt-4">
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? "Creating..." : "Create Booking"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
