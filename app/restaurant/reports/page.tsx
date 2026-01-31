"use client";

import React, { useState, useEffect } from "react";
import { Download, Calendar, DollarSign, CreditCard, Activity, ShoppingCart, TrendingUp, TrendingDown, Package, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SalesChart } from "@/components/restaurant/reports/SalesChart";
import { PopularItems } from "@/components/restaurant/reports/PopularItems";
import { InventoryHealth } from "@/components/restaurant/reports/InventoryHealth";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

const summaryData = [
    {
        title: "Total Revenue",
        value: "$45,231.89",
        description: "+20.1% from last month",
        icon: DollarSign,
    },
    {
        title: "Total Orders",
        value: "2,350",
        description: "+180.1% from last month",
        icon: ShoppingCart,
    },
    {
        title: "Sales Today",
        value: "$12,234",
        description: "+19% from yesterday",
        icon: CreditCard,
    },
    {
        title: "Net Profit",
        value: "$14,342",
        description: "+8% from last month",
        icon: Activity,
    },
];

// Sales Report Data
const salesByPaymentMethod = [
    { method: "Cash", amount: 18500, percentage: 41, color: "bg-emerald-500" },
    { method: "Card", amount: 15200, percentage: 34, color: "bg-blue-500" },
    { method: "UPI", amount: 11531, percentage: 25, color: "bg-purple-500" },
];

const dailySales = [
    { day: "Monday", orders: 145, revenue: 5420 },
    { day: "Tuesday", orders: 132, revenue: 4890 },
    { day: "Wednesday", orders: 168, revenue: 6230 },
    { day: "Thursday", orders: 156, revenue: 5780 },
    { day: "Friday", orders: 198, revenue: 7450 },
    { day: "Saturday", orders: 234, revenue: 8920 },
    { day: "Sunday", orders: 187, revenue: 6542 },
];

// Inventory Report Data
const inventoryAlerts = [
    { item: "Paneer", current: 2, min: 10, unit: "kg", status: "critical" },
    { item: "Tomatoes", current: 15, min: 20, unit: "kg", status: "low" },
    { item: "Chicken Breast", current: 8, min: 15, unit: "kg", status: "low" },
    { item: "Basmati Rice", current: 45, min: 20, unit: "kg", status: "good" },
    { item: "Onions", current: 65, min: 30, unit: "kg", status: "good" },
];

const consumptionTrend = [
    { item: "Chicken", consumed: 45, unit: "kg", trend: "up", change: 12 },
    { item: "Paneer", consumed: 28, unit: "kg", trend: "up", change: 8 },
    { item: "Rice", consumed: 120, unit: "kg", trend: "stable", change: 2 },
    { item: "Vegetables", consumed: 85, unit: "kg", trend: "down", change: -5 },
];

export default function ReportsPage() {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 1200);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight dark:text-white">Reports</h2>
                <div className="flex items-center space-x-2">
                    <Button variant="outline" className="hidden sm:flex dark:border-zinc-700 dark:text-zinc-300">
                        <Calendar className="mr-2 h-4 w-4" />
                        Jan 20, 2024 - Feb 09, 2024
                    </Button>
                    <Button className="bg-orange-600 hover:bg-orange-700 text-white">
                        <Download className="mr-2 h-4 w-4" />
                        Download
                    </Button>
                </div>
            </div>

            <Tabs defaultValue="overview" className="space-y-4">
                <TabsList className="bg-zinc-100 dark:bg-zinc-900">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="sales">Sales</TabsTrigger>
                    <TabsTrigger value="inventory">Inventory</TabsTrigger>
                </TabsList>

                {/* Overview Tab */}
                <TabsContent value="overview" className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        {summaryData.map((item) => (
                            <Card key={item.title} className="dark:bg-zinc-900 dark:border-zinc-800">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium dark:text-zinc-300">
                                        {item.title}
                                    </CardTitle>
                                    <item.icon className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold dark:text-white">{item.value}</div>
                                    <p className="text-xs text-muted-foreground">
                                        {item.description}
                                    </p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                        <SalesChart isLoading={isLoading} />
                        <PopularItems isLoading={isLoading} />
                    </div>

                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                        <div className="col-span-4">
                            <Card className="h-full dark:bg-zinc-900 dark:border-zinc-800">
                                <CardHeader>
                                    <CardTitle className="dark:text-white">Recent Transactions</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {[1, 2, 3, 4, 5].map((_, i) => (
                                            <div key={i} className="flex items-center">
                                                <div className="ml-4 space-y-1">
                                                    <p className="text-sm font-medium leading-none dark:text-zinc-200">Order #{2390 + i}</p>
                                                    <p className="text-sm text-muted-foreground">Table {i + 1} • Dine-in</p>
                                                </div>
                                                <div className="ml-auto font-medium dark:text-zinc-200">+$124.00</div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                        <InventoryHealth isLoading={isLoading} />
                    </div>
                </TabsContent>

                {/* Sales Tab */}
                <TabsContent value="sales" className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {/* Payment Method Breakdown */}
                        <Card className="dark:bg-zinc-900 dark:border-zinc-800">
                            <CardHeader>
                                <CardTitle className="dark:text-white">Payment Methods</CardTitle>
                                <CardDescription>Revenue by payment type</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {isLoading ? (
                                    <>
                                        <Skeleton className="h-8 w-full" />
                                        <Skeleton className="h-8 w-full" />
                                        <Skeleton className="h-8 w-full" />
                                    </>
                                ) : (
                                    salesByPaymentMethod.map((item) => (
                                        <div key={item.method} className="space-y-2">
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="font-medium dark:text-zinc-200">{item.method}</span>
                                                <span className="text-muted-foreground">${item.amount.toLocaleString()} ({item.percentage}%)</span>
                                            </div>
                                            <Progress value={item.percentage} className="h-2" indicatorClassName={item.color} />
                                        </div>
                                    ))
                                )}
                            </CardContent>
                        </Card>

                        {/* Daily Sales Breakdown */}
                        <Card className="lg:col-span-2 dark:bg-zinc-900 dark:border-zinc-800">
                            <CardHeader>
                                <CardTitle className="dark:text-white">Daily Sales</CardTitle>
                                <CardDescription>Orders and revenue by day</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {isLoading ? (
                                    <div className="space-y-3">
                                        {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                                            <Skeleton key={i} className="h-10 w-full" />
                                        ))}
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {dailySales.map((day) => (
                                            <div key={day.day} className="flex items-center justify-between p-3 rounded-lg bg-zinc-50 dark:bg-zinc-800/50">
                                                <div>
                                                    <p className="font-medium dark:text-zinc-200">{day.day}</p>
                                                    <p className="text-sm text-muted-foreground">{day.orders} orders</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-bold text-lg dark:text-white">${day.revenue.toLocaleString()}</p>
                                                    <p className="text-xs text-muted-foreground">Avg: ${Math.round(day.revenue / day.orders)}/order</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Weekly Summary */}
                    <Card className="dark:bg-zinc-900 dark:border-zinc-800">
                        <CardHeader>
                            <CardTitle className="dark:text-white">Weekly Summary</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-4 md:grid-cols-4">
                                <div className="p-4 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800">
                                    <p className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">Total Revenue</p>
                                    <p className="text-2xl font-bold text-emerald-700 dark:text-emerald-300">$45,232</p>
                                </div>
                                <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800">
                                    <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">Total Orders</p>
                                    <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">1,220</p>
                                </div>
                                <div className="p-4 rounded-lg bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800">
                                    <p className="text-sm text-purple-600 dark:text-purple-400 font-medium">Avg Order Value</p>
                                    <p className="text-2xl font-bold text-purple-700 dark:text-purple-300">$37.08</p>
                                </div>
                                <div className="p-4 rounded-lg bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-800">
                                    <p className="text-sm text-orange-600 dark:text-orange-400 font-medium">Peak Day</p>
                                    <p className="text-2xl font-bold text-orange-700 dark:text-orange-300">Saturday</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Inventory Tab */}
                <TabsContent value="inventory" className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                        {/* Stock Alerts */}
                        <Card className="dark:bg-zinc-900 dark:border-zinc-800">
                            <CardHeader>
                                <CardTitle className="dark:text-white flex items-center gap-2">
                                    <AlertTriangle className="h-5 w-5 text-orange-500" />
                                    Stock Alerts
                                </CardTitle>
                                <CardDescription>Items requiring attention</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {isLoading ? (
                                    <div className="space-y-3">
                                        {[1, 2, 3, 4, 5].map((i) => (
                                            <Skeleton key={i} className="h-12 w-full" />
                                        ))}
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {inventoryAlerts.map((item) => (
                                            <div key={item.item} className="flex items-center justify-between p-3 rounded-lg bg-zinc-50 dark:bg-zinc-800/50">
                                                <div className="flex items-center gap-3">
                                                    <Package className={`h-5 w-5 ${item.status === 'critical' ? 'text-red-500' :
                                                            item.status === 'low' ? 'text-orange-500' : 'text-emerald-500'
                                                        }`} />
                                                    <div>
                                                        <p className="font-medium dark:text-zinc-200">{item.item}</p>
                                                        <p className="text-xs text-muted-foreground">Min: {item.min} {item.unit}</p>
                                                    </div>
                                                </div>
                                                <div className="text-right flex items-center gap-2">
                                                    <span className="font-bold dark:text-white">{item.current} {item.unit}</span>
                                                    <Badge className={
                                                        item.status === 'critical' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                                                            item.status === 'low' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' :
                                                                'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                                                    }>
                                                        {item.status}
                                                    </Badge>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Consumption Trends */}
                        <Card className="dark:bg-zinc-900 dark:border-zinc-800">
                            <CardHeader>
                                <CardTitle className="dark:text-white">Consumption Trends</CardTitle>
                                <CardDescription>Weekly ingredient usage</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {isLoading ? (
                                    <div className="space-y-3">
                                        {[1, 2, 3, 4].map((i) => (
                                            <Skeleton key={i} className="h-12 w-full" />
                                        ))}
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {consumptionTrend.map((item) => (
                                            <div key={item.item} className="flex items-center justify-between p-3 rounded-lg bg-zinc-50 dark:bg-zinc-800/50">
                                                <div>
                                                    <p className="font-medium dark:text-zinc-200">{item.item}</p>
                                                    <p className="text-sm text-muted-foreground">{item.consumed} {item.unit} used</p>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    {item.trend === 'up' && <TrendingUp className="h-4 w-4 text-red-500" />}
                                                    {item.trend === 'down' && <TrendingDown className="h-4 w-4 text-emerald-500" />}
                                                    {item.trend === 'stable' && <Activity className="h-4 w-4 text-zinc-500" />}
                                                    <span className={`text-sm font-medium ${item.change > 0 ? 'text-red-500' : item.change < 0 ? 'text-emerald-500' : 'text-zinc-500'
                                                        }`}>
                                                        {item.change > 0 ? '+' : ''}{item.change}%
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Inventory Summary */}
                    <Card className="dark:bg-zinc-900 dark:border-zinc-800">
                        <CardHeader>
                            <CardTitle className="dark:text-white">Inventory Summary</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-4 md:grid-cols-4">
                                <div className="p-4 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800">
                                    <p className="text-sm text-red-600 dark:text-red-400 font-medium">Critical Items</p>
                                    <p className="text-2xl font-bold text-red-700 dark:text-red-300">1</p>
                                </div>
                                <div className="p-4 rounded-lg bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-800">
                                    <p className="text-sm text-orange-600 dark:text-orange-400 font-medium">Low Stock</p>
                                    <p className="text-2xl font-bold text-orange-700 dark:text-orange-300">2</p>
                                </div>
                                <div className="p-4 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800">
                                    <p className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">In Stock</p>
                                    <p className="text-2xl font-bold text-emerald-700 dark:text-emerald-300">42</p>
                                </div>
                                <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800">
                                    <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">Total Value</p>
                                    <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">$8,450</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
