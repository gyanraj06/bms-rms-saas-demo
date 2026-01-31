"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const popularItems = [
    { name: "Chicken Tikka Masala", sales: 124, revenue: 1860 },
    { name: "Butter Naan", sales: 340, revenue: 850 },
    { name: "Paneer Butter Masala", sales: 98, revenue: 1176 },
    { name: "Vegetable Biryani", sales: 85, revenue: 1020 },
    { name: "Mango Lassi", sales: 156, revenue: 624 },
];

export function PopularItems({ isLoading }: { isLoading?: boolean }) {
    if (isLoading) {
        return (
            <Card className="col-span-3 h-[400px]">
                <CardHeader>
                    <Skeleton className="h-6 w-[150px]" />
                    <Skeleton className="h-4 w-[200px]" />
                </CardHeader>
                <CardContent className="space-y-4">
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="col-span-3 dark:bg-zinc-900 dark:border-zinc-800">
            <CardHeader>
                <CardTitle className="dark:text-white">Popular Items</CardTitle>
                <CardDescription>Top selling items this month</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {popularItems.map((item) => (
                        <div key={item.name} className="flex items-center justify-between">
                            <div className="space-y-1">
                                <p className="text-sm font-medium leading-none dark:text-zinc-100">{item.name}</p>
                                <p className="text-sm text-muted-foreground">{item.sales} sold</p>
                            </div>
                            <div className="font-medium dark:text-zinc-100">${item.revenue}</div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
