"use client";

import { useState } from "react";
import { Plus, Search, Filter, MoreHorizontal, Edit, Trash, Utensils, IndianRupee, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { MenuItem, Category } from "@/lib/menu-data"; // Ensure path is correct
import { ItemForm } from "./ItemForm"; // We'll keep ItemForm as is for now or update it separately if needed
import { motion, AnimatePresence } from "framer-motion";

interface MenuItemListProps {
    items: MenuItem[];
    categories: Category[];
    setItems: React.Dispatch<React.SetStateAction<MenuItem[]>>;
}

export function MenuItemList({
    items,
    categories,
    setItems,
}: MenuItemListProps) {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<string>("all");
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<MenuItem | undefined>(undefined);

    const filteredItems = items.filter((item) => {
        const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === "all" || item.categoryId === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const handleSaveItem = (item: MenuItem) => {
        if (editingItem) {
            setItems(items.map((i) => (i.id === item.id ? item : i)));
        } else {
            setItems([...items, item]);
        }
        closeDialog();
    };

    const handleDeleteItem = (id: string) => {
        if (confirm("Are you sure you want to delete this item?")) {
            setItems(items.filter((i) => i.id !== id));
        }
    };

    const openAddDialog = () => {
        setEditingItem(undefined);
        setIsDialogOpen(true);
    };

    const openEditDialog = (item: MenuItem) => {
        setEditingItem(item);
        setIsDialogOpen(true);
    };

    const closeDialog = () => {
        setIsDialogOpen(false);
        setTimeout(() => setEditingItem(undefined), 300);
    };

    const getCategoryName = (id: string) => {
        return categories.find(c => c.id === id)?.name || "Unknown";
    }

    return (
        <div className="space-y-6">
            {/* Toolbar */}
            <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white dark:bg-zinc-900/50 p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
                <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto flex-1">
                    <div className="relative w-full sm:w-[320px]">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                        <Input
                            placeholder="Search menu items..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 h-11 bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 focus:ring-orange-500/20 rounded-xl"
                        />
                    </div>
                </div>
                <DropdownMenu>
                    <DropdownMenuTrigger className="h-11 px-4 gap-2 inline-flex items-center justify-center rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-700 text-zinc-600 dark:text-zinc-300 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-950">
                        <Filter className="h-4 w-4" />
                        {selectedCategory === 'all' ? 'All Categories' : getCategoryName(selectedCategory)}
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56 mt-2">
                        <DropdownMenuItem onClick={() => setSelectedCategory('all')}>
                            All Categories
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {categories.map(c => (
                            <DropdownMenuItem key={c.id} onClick={() => setSelectedCategory(c.id)}>
                                {c.name}
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            <Button onClick={openAddDialog} className="w-full md:w-auto h-11 bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 shadow-lg shadow-zinc-900/10 rounded-xl px-6">
                <Plus className="mr-2 h-4 w-4" /> Add New Item
            </Button>


            {/* Grid View */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                <AnimatePresence mode="popLayout">
                    {filteredItems.map((item, index) => (
                        <motion.div
                            key={item.id}
                            layout
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.2, delay: index * 0.03 }}
                            className="group"
                        >
                            <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden hover:shadow-xl hover:shadow-orange-500/10 dark:hover:shadow-orange-900/5 transition-all duration-300 h-full flex flex-col">
                                {/* Image / Placeholder */}
                                <div className="h-40 bg-zinc-100 dark:bg-zinc-800 relative flex items-center justify-center overflow-hidden">
                                    {/* In a real app, we'd utilize item.image here */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-10" />

                                    <Utensils className="h-10 w-10 text-zinc-300 dark:text-zinc-600" />

                                    <div className="absolute top-3 right-3 z-20">
                                        <Badge
                                            className={cn(
                                                "shadow-sm backdrop-blur-md",
                                                item.isVeg
                                                    ? "bg-emerald-100/90 text-emerald-700 hover:bg-emerald-200"
                                                    : "bg-red-100/90 text-red-700 hover:bg-red-200"
                                            )}
                                        >
                                            <div className={cn("w-1.5 h-1.5 rounded-full mr-1.5", item.isVeg ? "bg-emerald-600" : "bg-red-600")} />
                                            {item.isVeg ? "Veg" : "Non-Veg"}
                                        </Badge>
                                    </div>

                                    <div className="absolute top-3 left-3 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <div className="flex gap-2">
                                            <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full bg-white/90 shadow-sm hover:bg-zinc-100" onClick={() => openEditDialog(item)}>
                                                <Edit className="h-3.5 w-3.5" />
                                            </Button>
                                            <Button size="icon" variant="destructive" className="h-8 w-8 rounded-full shadow-sm" onClick={() => handleDeleteItem(item.id)}>
                                                <Trash className="h-3.5 w-3.5" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-4 flex flex-col flex-1">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <span className="text-[10px] uppercase font-bold text-orange-600 tracking-wider mb-1 block">
                                                {getCategoryName(item.categoryId)}
                                            </span>
                                            <h3 className="font-bold text-zinc-900 dark:text-white text-lg leading-tight group-hover:text-orange-600 transition-colors">
                                                {item.name}
                                            </h3>
                                        </div>
                                        <div className="font-bold text-zinc-900 dark:text-white bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded-lg text-sm tabular-nums">
                                            ₹{item.price}
                                        </div>
                                    </div>

                                    <p className="text-zinc-500 text-sm line-clamp-2 mb-4 flex-1">
                                        {item.description || "No description available."}
                                    </p>

                                    <div className="flex items-center justify-between pt-3 border-t border-zinc-100 dark:border-zinc-800">
                                        <div className="flex items-center gap-2">
                                            <div className={cn("w-2 h-2 rounded-full", item.available ? "bg-green-500" : "bg-zinc-300")} />
                                            <span className="text-xs font-medium text-zinc-500">
                                                {item.available ? "Available" : "Unavailable"}
                                            </span>
                                        </div>
                                        {item.modifierGroups && item.modifierGroups.length > 0 && (
                                            <Badge variant="outline" className="text-[10px] h-5 border-zinc-200">
                                                {item.modifierGroups.length} Add-ons
                                            </Badge>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {filteredItems.length === 0 && (
                    <div className="col-span-full py-16 text-center text-zinc-500">
                        <div className="w-16 h-16 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Search className="h-8 w-8 text-zinc-300" />
                        </div>
                        <p className="font-medium text-lg">No items found</p>
                        <p className="text-sm">Try adjusting your search or category filter</p>
                    </div>
                )}
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>{editingItem ? "Edit Item" : "Add New Item"}</DialogTitle>
                    </DialogHeader>
                    <ItemForm
                        item={editingItem}
                        categories={categories}
                        onSave={handleSaveItem}
                        onCancel={closeDialog}
                    />
                </DialogContent>
            </Dialog>
        </div >
    );
}
