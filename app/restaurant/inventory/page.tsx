"use client";

import React, { useState, useEffect } from "react";
import {
    Package,
    AlertTriangle,
    TrendingUp,
    Plus,
    Search,
    Edit2,
    Trash2,
    Save,
    X,
    ChefHat,
    ArrowRight,
    CheckCircle2,
    Info,
    History
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { Ingredient, INITIAL_INGREDIENTS, Unit, InventoryTransaction } from "@/lib/inventory-data";
import { MenuItem, INITIAL_ITEMS, INITIAL_MENUS, Menu } from "@/lib/menu-data";

export default function InventoryPage() {
    // --- State ---
    const [activeTab, setActiveTab] = useState("dashboard");
    const [ingredients, setIngredients] = useState<Ingredient[]>([]);
    const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
    const [menus, setMenus] = useState<Menu[]>([]);
    const [showAddIngredient, setShowAddIngredient] = useState(false);
    const [transactions, setTransactions] = useState<InventoryTransaction[]>([]);

    // Restock Modal State
    const [restockItem, setRestockItem] = useState<Ingredient | null>(null);

    // --- Data Loading ---
    useEffect(() => {
        const loadData = () => {
            if (typeof window === 'undefined') return;

            // Load Ingredients
            const savedIngredients = localStorage.getItem('restaurant_ingredients');
            if (savedIngredients) {
                setIngredients(JSON.parse(savedIngredients));
            } else {
                setIngredients(INITIAL_INGREDIENTS);
                localStorage.setItem('restaurant_ingredients', JSON.stringify(INITIAL_INGREDIENTS));
            }

            // Load Transactions (Demo Data Logic)
            const savedTx = localStorage.getItem('restaurant_inventory_transactions');
            if (savedTx) {
                setTransactions(JSON.parse(savedTx));
            } else {
                // Initialize with some DEMO transactions for the "Paneer" flow
                const demoTx: InventoryTransaction[] = [
                    { id: 'tx-1', ingredientId: 'ing-paneer', type: 'out', quantity: 3.00, itemName: 'Paneer Butter Masala', timestamp: Date.now() - 3600000, reason: 'Sale' },
                    { id: 'tx-2', ingredientId: 'ing-paneer', type: 'out', quantity: 1.80, itemName: 'Kadai Paneer', timestamp: Date.now() - 7200000, reason: 'Sale' },
                    { id: 'tx-3', ingredientId: 'ing-paneer', type: 'out', quantity: 1.80, itemName: 'Paneer Tikka', timestamp: Date.now() - 10800000, reason: 'Sale' },
                    { id: 'tx-4', ingredientId: 'ing-paneer', type: 'out', quantity: 0.14, itemName: 'Malai Kofta (Base)', timestamp: Date.now() - 14400000, reason: 'Sale' },
                ];
                setTransactions(demoTx);
                localStorage.setItem('restaurant_inventory_transactions', JSON.stringify(demoTx));
            }

            // Load Menu Items (needed for recipes)
            const savedItems = localStorage.getItem('restaurant_menu_items');
            setMenuItems(savedItems ? JSON.parse(savedItems) : INITIAL_ITEMS);

            // Load Menus
            const savedMenus = localStorage.getItem('restaurant_menus');
            setMenus(savedMenus ? JSON.parse(savedMenus) : INITIAL_MENUS);
        };
        loadData();
    }, []);

    // --- Persistence ---
    useEffect(() => {
        if (typeof window !== 'undefined' && ingredients.length > 0) {
            localStorage.setItem('restaurant_ingredients', JSON.stringify(ingredients));
        }
    }, [ingredients]);

    useEffect(() => {
        if (typeof window !== 'undefined' && transactions.length > 0) {
            localStorage.setItem('restaurant_inventory_transactions', JSON.stringify(transactions));
        }
    }, [transactions]);

    useEffect(() => {
        if (typeof window !== 'undefined' && menuItems.length > 0) {
            localStorage.setItem('restaurant_menu_items', JSON.stringify(menuItems));
        }
    }, [menuItems]);

    // --- derived stats ---
    const totalValue = ingredients.reduce((acc, ing) => acc + (ing.currentStock * ing.costPerUnit), 0);

    // DEMO DATA: If no real low stock items, show these static ones
    const realLowStock = ingredients.filter(ing => ing.currentStock <= ing.minStockLevel);
    const lowStockItems = realLowStock.length > 0 ? realLowStock : [
        {
            id: 'demo-1',
            name: 'Tomatoes',
            currentStock: 2.5,
            unit: 'kg',
            minStockLevel: 5,
            costPerUnit: 1.50,
            category: 'Produce',
            lastUpdated: Date.now()
        },
        {
            id: 'demo-2',
            name: 'Mozzarella Cheese',
            currentStock: 0.8,
            unit: 'kg',
            minStockLevel: 2,
            costPerUnit: 12.00,
            category: 'Dairy',
            lastUpdated: Date.now()
        },
        {
            id: 'demo-3',
            name: 'Basil Leaves',
            currentStock: 50,
            unit: 'g',
            minStockLevel: 100,
            costPerUnit: 0.10,
            category: 'Herbs',
            lastUpdated: Date.now()
        }
    ] as Ingredient[];

    // --- Handlers ---
    const handleAddIngredient = (newIngredient: Ingredient) => {
        setIngredients([...ingredients, newIngredient]);
        setShowAddIngredient(false);
    };

    const handleUpdateStock = (id: string, newStock: number) => {
        setIngredients(ingredients.map(ing =>
            ing.id === id ? { ...ing, currentStock: newStock, lastUpdated: Date.now() } : ing
        ));
    };

    const handleUpdateRecipe = (itemId: string, recipe: { ingredientId: string, quantity: number }[]) => {
        setMenuItems(prev => prev.map(item =>
            item.id === itemId ? { ...item, recipe } : item
        ));
    };

    const handleRestock = (qty: number, newCost: number, supplier: string) => {
        if (!restockItem) return;

        // Update Ingredient
        setIngredients(prev => prev.map(ing =>
            ing.id === restockItem.id
                ? { ...ing, currentStock: ing.currentStock + qty, costPerUnit: newCost, lastUpdated: Date.now() }
                : ing
        ));

        // Log Transaction
        const newTx: InventoryTransaction = {
            id: `tx-${Date.now()}`,
            ingredientId: restockItem.id,
            type: 'in',
            quantity: qty,
            itemName: supplier || 'Manual Restock',
            timestamp: Date.now(),
            reason: 'Restock'
        };
        setTransactions(prev => [newTx, ...prev]);
        setRestockItem(null);
    };

    return (
        <div className="space-y-6 max-w-[1400px] mx-auto pb-10">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                    <Package className="h-6 w-6 text-orange-600" />
                    Inventory Management
                </h1>
                <p className="text-zinc-500 dark:text-zinc-400">Track stock, manage ingredients, and set up recipes.</p>
            </div>

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full max-w-[400px] grid-cols-3">
                    <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
                    <TabsTrigger value="ingredients">Ingredients</TabsTrigger>
                    <TabsTrigger value="recipes">Recipes</TabsTrigger>
                </TabsList>

                {/* DASHBOARD TAB */}
                <TabsContent value="dashboard" className="space-y-6 mt-6">

                    {/* KPI Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg text-green-600">
                                    <TrendingUp className="h-6 w-6" />
                                </div>
                                <div>
                                    <p className="text-sm text-zinc-500">Total Inventory Value</p>
                                    <p className="text-2xl font-bold text-zinc-900 dark:text-white">${totalValue.toFixed(2)}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-lg text-red-600">
                                    <AlertTriangle className="h-6 w-6" />
                                </div>
                                <div>
                                    <p className="text-sm text-zinc-500">Low Stock Alerts</p>
                                    <p className="text-2xl font-bold text-zinc-900 dark:text-white">{lowStockItems.length}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600">
                                    <Package className="h-6 w-6" />
                                </div>
                                <div>
                                    <p className="text-sm text-zinc-500">Total Ingredients</p>
                                    <p className="text-2xl font-bold text-zinc-900 dark:text-white">{ingredients.length}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Low Stock Table */}
                        <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden flex flex-col">
                            <div className="p-6 border-b border-zinc-200 dark:border-zinc-800">
                                <h3 className="font-bold text-lg text-zinc-900 dark:text-white flex items-center gap-2">
                                    <AlertTriangle className="h-5 w-5 text-red-500" />
                                    Low Stock Alerts
                                </h3>
                            </div>
                            <div className="flex-1 overflow-auto max-h-[400px]">
                                {lowStockItems.length === 0 ? (
                                    <div className="p-8 text-center text-zinc-500 h-full flex flex-col justify-center items-center">
                                        <CheckCircle2 className="h-8 w-8 mb-2 text-green-500" />
                                        <p>All items are well stocked!</p>
                                    </div>
                                ) : (
                                    <table className="w-full text-sm text-left">
                                        <thead className="bg-zinc-50 dark:bg-zinc-950/50 text-zinc-500 sticky top-0">
                                            <tr>
                                                <th className="px-6 py-3 font-medium">Ingredient</th>
                                                <th className="px-6 py-3 font-medium">Stock</th>
                                                <th className="px-6 py-3 font-medium">Level</th>
                                                <th className="px-6 py-3 font-medium">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                                            {lowStockItems.map(ing => (
                                                <tr key={ing.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50">
                                                    <td className="px-6 py-4 font-medium">{ing.name}</td>
                                                    <td className="px-6 py-4 text-red-600 font-bold">{ing.currentStock} {ing.unit}</td>
                                                    <td className="px-6 py-4 text-xs">
                                                        <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
                                                            Low
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={() => setRestockItem(ing)}
                                                        >
                                                            Restock
                                                        </Button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                )}
                            </div>
                        </div>

                        {/* Recent Activity Table */}
                        <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden flex flex-col">
                            <div className="p-6 border-b border-zinc-200 dark:border-zinc-800">
                                <h3 className="font-bold text-lg text-zinc-900 dark:text-white flex items-center gap-2">
                                    <History className="h-5 w-5 text-blue-500" />
                                    Recent Activity
                                </h3>
                            </div>
                            <div className="flex-1 overflow-auto max-h-[400px]">
                                {transactions.length === 0 ? (
                                    <div className="p-8 text-center text-zinc-500 h-full flex flex-col justify-center items-center">
                                        <History className="h-8 w-8 mb-2 opacity-20" />
                                        <p>No recent activity recorded.</p>
                                    </div>
                                ) : (
                                    <table className="w-full text-sm text-left">
                                        <thead className="bg-zinc-50 dark:bg-zinc-950/50 text-zinc-500 sticky top-0">
                                            <tr>
                                                <th className="px-6 py-3 font-medium">Time</th>
                                                <th className="px-6 py-3 font-medium">Details</th>
                                                <th className="px-6 py-3 font-medium text-right">Change</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                                            {transactions.slice(0, 20).map(tx => {
                                                const ing = ingredients.find(i => i.id === tx.ingredientId);
                                                return (
                                                    <tr key={tx.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50">
                                                        <td className="px-6 py-4 text-zinc-500 text-xs">
                                                            {new Date(tx.timestamp).toLocaleString([], { hour: '2-digit', minute: '2-digit', month: 'short', day: 'numeric' })}
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <div className="font-medium text-zinc-900 dark:text-white">{ing?.name || "Unknown Item"}</div>
                                                            <div className="text-xs text-zinc-500">{tx.itemName}</div>
                                                        </td>
                                                        <td className={cn(
                                                            "px-6 py-4 font-bold text-right",
                                                            tx.type === 'in' ? "text-green-600" : "text-red-600"
                                                        )}>
                                                            {tx.type === 'in' ? '+' : '-'}{tx.quantity} {ing?.unit}
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                )}
                            </div>
                        </div>
                    </div>

                </TabsContent>

                {/* INGREDIENTS TAB */}
                <TabsContent value="ingredients" className="space-y-6 mt-6">
                    <div className="flex justify-between items-center">
                        <div className="relative w-72">
                            <Search className="absolute left-3 top-3 h-4 w-4 text-zinc-400" />
                            <Input placeholder="Search ingredients..." className="pl-9" />
                        </div>
                        <Button onClick={() => setShowAddIngredient(true)} className="gap-2 bg-orange-600 hover:bg-orange-700 text-white">
                            <Plus className="h-4 w-4" /> Add Ingredient
                        </Button>
                    </div>

                    <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-zinc-50 dark:bg-zinc-950/50 text-zinc-500 border-b border-zinc-200 dark:border-zinc-800">
                                <tr>
                                    <th className="px-6 py-3 font-medium">Name</th>
                                    <th className="px-6 py-3 font-medium">Category</th>
                                    <th className="px-6 py-3 font-medium">Stock Level</th>
                                    <th className="px-6 py-3 font-medium">Cost / Unit</th>
                                    <th className="px-6 py-3 font-medium text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                                {ingredients.map(ing => (
                                    <tr key={ing.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50">
                                        <td className="px-6 py-4 font-medium text-zinc-900 dark:text-white">{ing.name}</td>
                                        <td className="px-6 py-4 text-zinc-500">{ing.category}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <span className={cn(
                                                    "font-mono font-medium",
                                                    ing.currentStock <= ing.minStockLevel ? "text-red-600" : "text-zinc-700 dark:text-zinc-300"
                                                )}>
                                                    {ing.currentStock} {ing.unit}
                                                </span>
                                                <div className="flex flex-col gap-0.5">
                                                    <button onClick={() => setRestockItem(ing)} className="hover:text-green-600"><Plus className="h-3 w-3" /></button>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 font-medium text-zinc-700 dark:text-zinc-300">${ing.costPerUnit}</td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="h-8 text-xs bg-transparent border-zinc-200 dark:border-zinc-700 hover:bg-orange-50 hover:text-orange-600 hover:border-orange-200 dark:hover:bg-orange-900/20 dark:hover:text-orange-400 dark:hover:border-orange-800 transition-colors"
                                                    onClick={() => setRestockItem(ing)}
                                                >
                                                    Restock
                                                </Button>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20">
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </TabsContent>

                {/* RECIPES TAB */}
                <TabsContent value="recipes" className="space-y-6 mt-6">
                    <RecipeManager
                        ingredients={ingredients}
                        menuItems={menuItems}
                        menus={menus}
                        onUpdateRecipe={handleUpdateRecipe}
                    />
                </TabsContent>
            </Tabs>

            {/* Add Ingredient Modal */}
            {showAddIngredient && (
                <AddIngredientModal
                    onClose={() => setShowAddIngredient(false)}
                    onAdd={handleAddIngredient}
                />
            )}

            {/* Restock Modal */}
            {restockItem && (
                <RestockModal
                    ingredient={restockItem}
                    onClose={() => setRestockItem(null)}
                    onRestock={handleRestock}
                />
            )}
        </div>
    );
}

// --- SUB COMPONENTS ---

function RecipeManager({ ingredients, menuItems, menus, onUpdateRecipe }: {
    ingredients: Ingredient[],
    menuItems: MenuItem[],
    menus: Menu[],
    onUpdateRecipe: (itemId: string, recipe: { ingredientId: string, quantity: number }[]) => void
}) {
    const [selectedMenu, setSelectedMenu] = useState<string>(menus[0]?.id || "");
    const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);

    // Filter items based on selected menu
    const filteredItems = menuItems.filter(item => {
        const menu = menus.find(m => m.id === selectedMenu);
        if (!menu) return true;

        if (menu.itemIds.length > 0) return menu.itemIds.includes(item.id);
        return menu.categoryIds.includes(item.categoryId);
    });

    return (
        <div className="flex flex-col md:flex-row gap-6 h-[calc(100vh-250px)]">
            {/* Left: Item Selector */}
            <div className="w-full md:w-1/3 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 flex flex-col overflow-hidden">
                <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 space-y-3">
                    <h3 className="font-semibold text-zinc-900 dark:text-white flex items-center gap-2">
                        <ChefHat className="h-5 w-5 text-orange-600" />
                        Select Item
                    </h3>
                    <select
                        className="w-full h-10 px-3 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-sm"
                        value={selectedMenu}
                        onChange={(e) => setSelectedMenu(e.target.value)}
                    >
                        {menus.map(m => (
                            <option key={m.id} value={m.id}>{m.name}</option>
                        ))}
                    </select>
                </div>
                <div className="flex-1 overflow-y-auto p-2 space-y-1">
                    {filteredItems.map(item => (
                        <div
                            key={item.id}
                            onClick={() => setSelectedItem(item)}
                            className={cn(
                                "p-3 rounded-lg cursor-pointer transition-colors flex justify-between items-center group",
                                selectedItem?.id === item.id
                                    ? "bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800"
                                    : "hover:bg-zinc-50 dark:hover:bg-zinc-800 border border-transparent"
                            )}
                        >
                            <div>
                                <p className={cn("font-medium text-sm", selectedItem?.id === item.id ? "text-orange-700 dark:text-orange-400" : "text-zinc-700 dark:text-zinc-300")}>
                                    {item.name}
                                </p>
                                <p className="text-xs text-zinc-500">${item.price}</p>
                            </div>
                            {item.recipe && item.recipe.length > 0 && (
                                <span className="text-[10px] bg-green-100 dark:bg-green-900/30 text-green-700 px-2 py-0.5 rounded-full font-medium">
                                    Linked
                                </span>
                            )}
                            <ArrowRight className={cn("h-4 w-4 opacity-0 transition-opacity", selectedItem?.id === item.id ? "opacity-100 text-orange-600" : "group-hover:opacity-50")} />
                        </div>
                    ))}
                </div>
            </div>

            {/* Right: Recipe Editor */}
            <div className="flex-1 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 flex flex-col">
                {selectedItem ? (
                    <RecipeEditor
                        item={selectedItem}
                        ingredients={ingredients}
                        onSave={(recipe) => onUpdateRecipe(selectedItem.id, recipe)}
                    />
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-zinc-400 p-8 text-center">
                        <div className="p-4 bg-zinc-50 dark:bg-zinc-800 rounded-full mb-4">
                            <ChefHat className="h-8 w-8 opacity-50" />
                        </div>
                        <p className="font-medium">Select a menu item to configure its recipe</p>
                        <p className="text-sm">Link ingredients to automatically deduct stock on sale</p>
                    </div>
                )}
            </div>
        </div>
    );
}

function RecipeEditor({ item, ingredients, onSave }: {
    item: MenuItem,
    ingredients: Ingredient[],
    onSave: (recipe: { ingredientId: string, quantity: number }[]) => void
}) {
    const [recipe, setRecipe] = useState<{ ingredientId: string, quantity: number }[]>(item.recipe || []);

    // Sync when item changes
    useEffect(() => {
        setRecipe(item.recipe || []);
    }, [item]);

    const handleAddIngredient = () => {
        const available = ingredients.find(ing => !recipe.some(r => r.ingredientId === ing.id));
        if (available) {
            setRecipe([...recipe, { ingredientId: available.id, quantity: 1 }]);
        } else if (ingredients.length > 0) {
            setRecipe([...recipe, { ingredientId: ingredients[0].id, quantity: 1 }]);
        }
    };

    const handleRemove = (index: number) => {
        const newRecipe = [...recipe];
        newRecipe.splice(index, 1);
        setRecipe(newRecipe);
    };

    const handleChange = (index: number, field: 'ingredientId' | 'quantity', value: string | number) => {
        const newRecipe = [...recipe];
        newRecipe[index] = { ...newRecipe[index], [field]: value };
        setRecipe(newRecipe);
    };

    const totalCost = recipe.reduce((acc, curr) => {
        const ing = ingredients.find(i => i.id === curr.ingredientId);
        return acc + (ing ? ing.costPerUnit * curr.quantity : 0);
    }, 0);

    return (
        <div className="flex flex-col h-full">
            <div className="p-6 border-b border-zinc-200 dark:border-zinc-800">
                <div className="flex justify-between items-start">
                    <div>
                        <h2 className="text-xl font-bold text-zinc-900 dark:text-white">Recipe: {item.name}</h2>
                        <p className="text-sm text-zinc-500">Define ingredients deducted per 1 qty sold</p>
                    </div>
                    <Button onClick={() => onSave(recipe)} className="bg-orange-600 hover:bg-orange-700 text-white gap-2">
                        <Save className="h-4 w-4" /> Save Recipe
                    </Button>
                </div>
            </div>

            <div className="flex-1 p-6 overflow-y-auto space-y-4">
                {recipe.length === 0 ? (
                    <div className="p-8 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl text-center">
                        <p className="text-zinc-500 mb-2">No ingredients linked yet</p>
                        <Button variant="outline" onClick={handleAddIngredient}>Link First Ingredient</Button>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {recipe.map((r, idx) => {
                            const selectedIng = ingredients.find(i => i.id === r.ingredientId);
                            return (
                                <div key={idx} className="flex items-center gap-3 bg-zinc-50 dark:bg-zinc-800/50 p-3 rounded-lg border border-zinc-100 dark:border-zinc-700">
                                    <div className="flex-1">
                                        <label className="text-xs font-medium text-zinc-500 mb-1 block">Ingredient</label>
                                        <select
                                            className="w-full h-9 rounded-md border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 text-sm px-2"
                                            value={r.ingredientId}
                                            onChange={(e) => handleChange(idx, 'ingredientId', e.target.value)}
                                        >
                                            {ingredients.map(ing => (
                                                <option key={ing.id} value={ing.id}>{ing.name} ({ing.unit})</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="w-32">
                                        <label className="text-xs font-medium text-zinc-500 mb-1 block">Quantity ({selectedIng?.unit})</label>
                                        <Input
                                            type="number"
                                            min="0.1"
                                            step="0.01"
                                            value={r.quantity}
                                            onChange={(e) => handleChange(idx, 'quantity', parseFloat(e.target.value))}
                                            className="h-9"
                                        />
                                    </div>
                                    <div className="w-24 pt-5 text-sm font-medium text-zinc-600 dark:text-zinc-400">
                                        ${selectedIng ? (selectedIng.costPerUnit * r.quantity).toFixed(2) : "0.00"}
                                    </div>
                                    <div className="pt-5">
                                        <button onClick={() => handleRemove(idx)} className="p-2 text-zinc-400 hover:text-red-600">
                                            <X className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                        <Button variant="outline" onClick={handleAddIngredient} className="w-full border-dashed">
                            <Plus className="h-4 w-4 mr-2" /> Add Another Ingredient
                        </Button>
                    </div>
                )}
            </div>

            <div className="p-6 bg-zinc-50 dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-800">
                <div className="flex justify-between items-center text-sm">
                    <span className="text-zinc-500">Selling Price: <span className="font-semibold text-zinc-900 dark:text-white">${item.price}</span></span>
                    <span className="text-zinc-500">Est. Cost: <span className="font-semibold text-red-600">${totalCost.toFixed(2)}</span></span>
                    <span className="font-bold text-green-600">Profit: ${(item.price - totalCost).toFixed(2)}</span>
                </div>
            </div>
        </div>
    );
}

// --- Restock Modal ---
function RestockModal({ ingredient, onClose, onRestock }: { ingredient: Ingredient, onClose: () => void, onRestock: (qty: number, newCost: number, supplier: string) => void }) {
    const [qty, setQty] = useState("");
    const [cost, setCost] = useState(ingredient.costPerUnit.toString());
    const [supplier, setSupplier] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onRestock(parseFloat(qty), parseFloat(cost), supplier);
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-zinc-900 rounded-xl w-full max-w-md p-6 shadow-xl">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h3 className="text-lg font-bold text-zinc-900 dark:text-white">Restock: {ingredient.name}</h3>
                        <p className="text-sm text-zinc-500">Current Stock: {ingredient.currentStock} {ingredient.unit}</p>
                    </div>
                    <button onClick={onClose} className="text-zinc-400 hover:text-zinc-600"><X className="h-5 w-5" /></button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Quantity to Add ({ingredient.unit})</label>
                        <Input required type="number" step="0.01" value={qty} onChange={e => setQty(e.target.value)} placeholder="e.g. 10" autoFocus />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">New Cost per Unit ($)</label>
                        <Input required type="number" step="0.01" value={cost} onChange={e => setCost(e.target.value)} />
                        <p className="text-xs text-zinc-500 mt-1">Updating this will change the unit cost for future calculations.</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Supplier / Source (Optional)</label>
                        <Input value={supplier} onChange={e => setSupplier(e.target.value)} placeholder="e.g. Metro Wholesale" />
                    </div>

                    <div className="bg-zinc-50 dark:bg-zinc-800 p-3 rounded-lg flex justify-between items-center text-sm">
                        <span className="text-zinc-500">New Total Stock:</span>
                        <span className="font-bold">{(ingredient.currentStock + (parseFloat(qty) || 0)).toFixed(2)} {ingredient.unit}</span>
                    </div>

                    <div className="flex justify-end gap-2 pt-4">
                        <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
                        <Button type="submit" className="bg-green-600 hover:bg-green-700 text-white gap-2">
                            <TrendingUp className="h-4 w-4" /> Confirm Restock
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}

function AddIngredientModal({ onClose, onAdd }: { onClose: () => void, onAdd: (ing: Ingredient) => void }) {
    const [name, setName] = useState("");
    const [cost, setCost] = useState("");
    const [stock, setStock] = useState("");
    const [minStock, setMinStock] = useState("");
    const [unit, setUnit] = useState<Unit>("pcs");
    const [category, setCategory] = useState("General");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onAdd({
            id: `ing-${Date.now()}`,
            name,
            unit,
            costPerUnit: parseFloat(cost),
            currentStock: parseFloat(stock),
            minStockLevel: parseFloat(minStock),
            category,
            lastUpdated: Date.now()
        });
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-zinc-900 rounded-xl w-full max-w-md p-6 shadow-xl">
                <h3 className="text-lg font-bold mb-4">Add New Ingredient</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Name</label>
                        <Input required value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Flour" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Cost per Unit</label>
                            <Input type="number" required step="0.01" value={cost} onChange={e => setCost(e.target.value)} placeholder="0.00" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Unit</label>
                            <select
                                className="w-full h-10 px-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950"
                                value={unit}
                                onChange={(e: any) => setUnit(e.target.value)}
                            >
                                <option value="pcs">Pieces (pcs)</option>
                                <option value="kg">Kilogram (kg)</option>
                                <option value="g">Gram (g)</option>
                                <option value="l">Liter (l)</option>
                                <option value="ml">Milliliter (ml)</option>
                            </select>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Current Stock</label>
                            <Input type="number" required step="0.1" value={stock} onChange={e => setStock(e.target.value)} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Min Alert Level</label>
                            <Input type="number" required step="0.1" value={minStock} onChange={e => setMinStock(e.target.value)} />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Category</label>
                        <Input value={category} onChange={e => setCategory(e.target.value)} placeholder="e.g. Produce" />
                    </div>
                    <div className="flex justify-end gap-2 pt-4">
                        <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
                        <Button type="submit" className="bg-orange-600 hover:bg-orange-700 text-white">Add Ingredient</Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
