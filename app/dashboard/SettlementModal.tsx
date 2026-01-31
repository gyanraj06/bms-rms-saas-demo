"use client";

import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Printer, CreditCard, Banknote, QrCode, Split } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

interface Order {
    id: string;
    customer: string;
    items: string;
    total: number;
    status: string;
    table: string;
    timestamp: number;
}

interface SettlementModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    order: Order | null;
    onSettle: (orderId: string, method: string) => void;
}

export function SettlementModal({ open, onOpenChange, order, onSettle }: SettlementModalProps) {
    const [method, setMethod] = useState<"Cash" | "Card" | "UPI" | "Split" | null>(null);
    const [splitAmounts, setSplitAmounts] = useState({ cash: 0, card: 0, upi: 0 });

    // Ensure order exists before rendering content
    if (!order) return null;

    const remaining = order.total - (splitAmounts.cash + splitAmounts.card + splitAmounts.upi);

    const handlePrint = () => {
        const style = document.createElement('style');
        style.innerHTML = `
            @media print {
                body * { visibility: hidden; }
                .bill-content, .bill-content * { visibility: visible; }
                .bill-content { position: absolute; left: 0; top: 0; width: 100%; padding: 20px; }
            }
        `;
        document.head.appendChild(style);
        window.print();
        document.head.removeChild(style);
    };

    const handleConfirm = () => {
        if (method === "Split") {
            if (Math.abs(remaining) < 0.01) {
                const parts = [];
                if (splitAmounts.cash > 0) parts.push(`Cash: ${splitAmounts.cash.toFixed(2)}`);
                if (splitAmounts.card > 0) parts.push(`Card: ${splitAmounts.card.toFixed(2)}`);
                if (splitAmounts.upi > 0) parts.push(`UPI: ${splitAmounts.upi.toFixed(2)}`);
                onSettle(order.id, `Split (${parts.join(", ")})`);
                onOpenChange(false);
                setMethod(null);
                setSplitAmounts({ cash: 0, card: 0, upi: 0 });
            }
        } else if (method) {
            onSettle(order.id, method);
            onOpenChange(false);
            setMethod(null);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            {/* Added a DialogClose button for the top-right X */}
            <DialogContent className="sm:max-w-md">
                <DialogClose onClick={() => onOpenChange(false)} />
                <DialogHeader>
                    <DialogTitle>Settle Order {order.id}</DialogTitle>
                </DialogHeader>

                <div className="bill-content space-y-4">
                    <div className="flex justify-between items-center bg-zinc-50 dark:bg-zinc-900 p-3 rounded-lg border">
                        <div>
                            <p className="text-sm font-semibold">{order.customer}</p>
                            <p className="text-xs text-zinc-500">Table: {order.table}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-xl font-bold">${order.total.toFixed(2)}</p>
                            <p className="text-xs text-zinc-500">{new Date(order.timestamp).toLocaleString()}</p>
                        </div>
                    </div>

                    <div className="text-sm text-zinc-600 dark:text-zinc-400">
                        <p className="font-semibold mb-1">Items Summary:</p>
                        <p>{order.items}</p>
                    </div>

                    <hr className="my-4 border-zinc-200 dark:border-zinc-800" />

                    <div className="space-y-4 print:hidden">
                        <Label>Select Payment Method</Label>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                            <Button
                                variant={method === "Cash" ? "default" : "outline"}
                                className={cn("px-2", method === "Cash" && "bg-green-600 hover:bg-green-700")}
                                onClick={() => setMethod("Cash")}
                            >
                                <Banknote className="h-4 w-4 mr-1.5" />
                                Cash
                            </Button>
                            <Button
                                variant={method === "Card" ? "default" : "outline"}
                                className={cn("px-2", method === "Card" && "bg-blue-600 hover:bg-blue-700")}
                                onClick={() => setMethod("Card")}
                            >
                                <CreditCard className="h-4 w-4 mr-1.5" />
                                Card
                            </Button>
                            <Button
                                variant={method === "UPI" ? "default" : "outline"}
                                className={cn("px-2", method === "UPI" && "bg-purple-600 hover:bg-purple-700")}
                                onClick={() => setMethod("UPI")}
                            >
                                <QrCode className="h-4 w-4 mr-1.5" />
                                UPI
                            </Button>
                            <Button
                                variant={method === "Split" ? "default" : "outline"}
                                className={cn("px-2", method === "Split" && "bg-orange-600 hover:bg-orange-700")}
                                onClick={() => {
                                    setMethod("Split");
                                    setSplitAmounts({ cash: order.total / 2, card: order.total / 2, upi: 0 });
                                }}
                            >
                                <Split className="h-4 w-4 mr-1.5" />
                                Split
                            </Button>
                        </div>

                        {method === "Split" && (
                            <div className="p-4 bg-zinc-50 dark:bg-zinc-900/50 rounded-lg border border-zinc-200 dark:border-zinc-800 space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
                                <div className="grid grid-cols-3 gap-3">
                                    <div className="space-y-1.5">
                                        <div className="flex justify-between">
                                            <Label className="text-[10px] uppercase font-bold text-zinc-500">Cash</Label>
                                            {remaining > 0.01 && (
                                                <button
                                                    type="button"
                                                    onClick={() => setSplitAmounts(prev => ({ ...prev, cash: prev.cash + remaining }))}
                                                    className="text-[10px] text-orange-600 font-bold hover:underline"
                                                >
                                                    Fill
                                                </button>
                                            )}
                                        </div>
                                        <div className="relative">
                                            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-zinc-400 text-xs">$</span>
                                            <Input
                                                type="number"
                                                className="h-8 pl-5 text-xs text-right pr-2"
                                                value={splitAmounts.cash || ""}
                                                onChange={(e) => setSplitAmounts({ ...splitAmounts, cash: parseFloat(e.target.value) || 0 })}
                                                onFocus={(e) => e.target.select()}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <div className="flex justify-between">
                                            <Label className="text-[10px] uppercase font-bold text-zinc-500">Card</Label>
                                            {remaining > 0.01 && (
                                                <button
                                                    type="button"
                                                    onClick={() => setSplitAmounts(prev => ({ ...prev, card: prev.card + remaining }))}
                                                    className="text-[10px] text-orange-600 font-bold hover:underline"
                                                >
                                                    Fill
                                                </button>
                                            )}
                                        </div>
                                        <div className="relative">
                                            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-zinc-400 text-xs">$</span>
                                            <Input
                                                type="number"
                                                className="h-8 pl-5 text-xs text-right pr-2"
                                                value={splitAmounts.card || ""}
                                                onChange={(e) => setSplitAmounts({ ...splitAmounts, card: parseFloat(e.target.value) || 0 })}
                                                onFocus={(e) => e.target.select()}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <div className="flex justify-between">
                                            <Label className="text-[10px] uppercase font-bold text-zinc-500">UPI</Label>
                                            {remaining > 0.01 && (
                                                <button
                                                    type="button"
                                                    onClick={() => setSplitAmounts(prev => ({ ...prev, upi: prev.upi + remaining }))}
                                                    className="text-[10px] text-orange-600 font-bold hover:underline"
                                                >
                                                    Fill
                                                </button>
                                            )}
                                        </div>
                                        <div className="relative">
                                            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-zinc-400 text-xs">$</span>
                                            <Input
                                                type="number"
                                                className="h-8 pl-5 text-xs text-right pr-2"
                                                value={splitAmounts.upi || ""}
                                                onChange={(e) => setSplitAmounts({ ...splitAmounts, upi: parseFloat(e.target.value) || 0 })}
                                                onFocus={(e) => e.target.select()}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between pt-2 border-t border-zinc-200 dark:border-zinc-800">
                                    <span className="text-xs text-zinc-500 font-medium">Remaining to Settle:</span>
                                    <span className={cn(
                                        "text-sm font-bold",
                                        Math.abs(remaining) < 0.01 ? "text-green-600" : "text-red-600"
                                    )}>
                                        ${Math.abs(remaining).toFixed(2)}
                                        {remaining > 0 ? " short" : remaining < 0 ? " over" : ""}
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex flex-col-reverse sm:flex-row sm:justify-between gap-2 mt-4 print:hidden">
                    <Button variant="ghost" onClick={handlePrint} className="gap-2">
                        <Printer className="h-4 w-4" />
                        Print Bill
                    </Button>
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>
                        <Button
                            onClick={handleConfirm}
                            disabled={!method || (method === "Split" && Math.abs(remaining) > 0.01)}
                            className="bg-zinc-900 dark:bg-zinc-100 text-white dark:text-black"
                        >
                            Confirm Payment
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
