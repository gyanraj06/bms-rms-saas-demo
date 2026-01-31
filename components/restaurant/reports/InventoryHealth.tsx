"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";

const inventoryItems = [
    { name: "Tomatoes", status: "Low", stock: 15, max: 100 },
    { name: "Onions", status: "Good", stock: 65, max: 100 },
    { name: "Chicken Breast", status: "Low", stock: 8, max: 50 },
    { name: "Basmati Rice", status: "Good", stock: 80, max: 100 },
    { name: "Paneer", status: "Critical", stock: 2, max: 40 },
];

export function InventoryHealth({ isLoading }: { isLoading?: boolean }) {
    if (isLoading) {
        return (
            <Card className="col-span-3 h-[400px]">
                <CardHeader>
                    <Skeleton className="h-6 w-[150px]" />
                    <Skeleton className="h-4 w-[200px]" />
                </CardHeader>
                <CardContent className="space-y-4">
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-8 w-full" />
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="col-span-3 dark:bg-zinc-900 dark:border-zinc-800">
            <CardHeader>
                <CardTitle className="dark:text-white">Inventory Health</CardTitle>
                <CardDescription>Items requiring attention</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-6">
                    {inventoryItems.map((item) => (
                        <div key={item.name} className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                                <span className="font-medium dark:text-zinc-100">{item.name}</span>
                                <span className={
                                    item.status === "Critical" ? "text-red-500 font-bold" :
                                        item.status === "Low" ? "text-orange-500 font-bold" :
                                            "text-green-500"
                                }>
                                    {item.stock} / {item.max} kg
                                </span>
                            </div>
                            <Progress
                                value={(item.stock / item.max) * 100}
                                className="h-2"
                                indicatorClassName={
                                    item.status === "Critical" ? "bg-red-500" :
                                        item.status === "Low" ? "bg-orange-500" :
                                            "bg-emerald-500"
                                }
                            />
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
