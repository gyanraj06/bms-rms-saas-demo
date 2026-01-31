"use client";

import { useState } from "react";
import { Plus, Edit2, Trash2, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Menu, Category, MenuItem } from "@/lib/menu-data";
import { cn } from "@/lib/utils";

interface MenuConfiguratorProps {
    menus: Menu[];
    setMenus: (menus: Menu[]) => void;
    categories: Category[];
    items: MenuItem[];
}

export function MenuConfigurator({ menus, setMenus, categories, items }: MenuConfiguratorProps) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingMenu, setEditingMenu] = useState<Menu | null>(null);
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        categoryIds: [] as string[],
        itemIds: [] as string[],
        active: true,
    });

    const openCreateDialog = () => {
        setEditingMenu(null);
        setFormData({
            name: "",
            description: "",
            categoryIds: [],
            itemIds: [],
            active: true,
        });
        setIsDialogOpen(true);
    };

    const openEditDialog = (menu: Menu) => {
        setEditingMenu(menu);
        setFormData({
            name: menu.name,
            description: menu.description || "",
            categoryIds: menu.categoryIds,
            itemIds: menu.itemIds,
            active: menu.active,
        });
        setIsDialogOpen(true);
    };

    const handleSave = () => {
        if (!formData.name.trim()) return;

        if (editingMenu) {
            // Update existing menu
            setMenus(
                menus.map((m) =>
                    m.id === editingMenu.id
                        ? { ...m, ...formData }
                        : m
                )
            );
        } else {
            // Create new menu
            const newMenu: Menu = {
                id: `menu-${Date.now()}`,
                ...formData,
                createdAt: Date.now(),
            };
            setMenus([...menus, newMenu]);
        }

        setIsDialogOpen(false);
    };

    const handleDelete = (menuId: string) => {
        if (confirm("Are you sure you want to delete this menu?")) {
            setMenus(menus.filter((m) => m.id !== menuId));
        }
    };

    const toggleCategory = (categoryId: string) => {
        setFormData((prev) => ({
            ...prev,
            categoryIds: prev.categoryIds.includes(categoryId)
                ? prev.categoryIds.filter((id) => id !== categoryId)
                : [...prev.categoryIds, categoryId],
        }));
    };

    const toggleItem = (itemId: string) => {
        setFormData((prev) => ({
            ...prev,
            itemIds: prev.itemIds.includes(itemId)
                ? prev.itemIds.filter((id) => id !== itemId)
                : [...prev.itemIds, itemId],
        }));
    };

    const getMenuItemCount = (menu: Menu) => {
        if (menu.itemIds.length > 0) {
            return menu.itemIds.length;
        }
        return items.filter((item) => menu.categoryIds.includes(item.categoryId)).length;
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div />
                <Button onClick={openCreateDialog} className="bg-orange-600 hover:bg-orange-700 text-white gap-2">
                    <Plus className="h-4 w-4" />
                    Create Menu
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {menus.map((menu) => (
                    <div
                        key={menu.id}
                        className={cn(
                            "bg-white dark:bg-zinc-900 rounded-lg border p-4 transition-all hover:shadow-md",
                            menu.active
                                ? "border-zinc-200 dark:border-zinc-800"
                                : "border-zinc-200 dark:border-zinc-800 opacity-60"
                        )}
                    >
                        <div className="flex justify-between items-start mb-3">
                            <div className="flex-1">
                                <h4 className="font-semibold text-zinc-900 dark:text-white flex items-center gap-2">
                                    {menu.name}
                                    {menu.active && (
                                        <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-[10px] px-2 py-0.5 rounded-full font-medium">
                                            Active
                                        </span>
                                    )}
                                </h4>
                                {menu.description && (
                                    <p className="text-xs text-zinc-500 mt-1">{menu.description}</p>
                                )}
                            </div>
                            <div className="flex gap-1">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8"
                                    onClick={() => openEditDialog(menu)}
                                >
                                    <Edit2 className="h-3.5 w-3.5" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                                    onClick={() => handleDelete(menu.id)}
                                >
                                    <Trash2 className="h-3.5 w-3.5" />
                                </Button>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-zinc-500">Categories:</span>
                                <span className="font-medium text-zinc-900 dark:text-white">
                                    {menu.categoryIds.length}
                                </span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-zinc-500">Items:</span>
                                <span className="font-medium text-zinc-900 dark:text-white">
                                    {getMenuItemCount(menu)}
                                </span>
                            </div>
                        </div>

                        <div className="mt-3 pt-3 border-t border-zinc-100 dark:border-zinc-800">
                            <div className="flex flex-wrap gap-1">
                                {menu.categoryIds.slice(0, 3).map((catId) => {
                                    const cat = categories.find((c) => c.id === catId);
                                    return cat ? (
                                        <span
                                            key={catId}
                                            className="bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-[10px] px-2 py-1 rounded"
                                        >
                                            {cat.name}
                                        </span>
                                    ) : null;
                                })}
                                {menu.categoryIds.length > 3 && (
                                    <span className="text-[10px] text-zinc-400">
                                        +{menu.categoryIds.length - 3} more
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Create/Edit Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>{editingMenu ? "Edit Menu" : "Create New Menu"}</DialogTitle>
                    </DialogHeader>

                    <div className="space-y-6 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="menu-name">Menu Name *</Label>
                            <Input
                                id="menu-name"
                                placeholder="e.g., Breakfast Menu, Lunch Special"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="menu-description">Description</Label>
                            <Textarea
                                id="menu-description"
                                placeholder="Brief description of this menu"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                rows={2}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Categories to Include</Label>
                            <div className="grid grid-cols-2 gap-2">
                                {categories.map((category) => (
                                    <button
                                        key={category.id}
                                        type="button"
                                        onClick={() => toggleCategory(category.id)}
                                        className={cn(
                                            "flex items-center justify-between p-3 rounded-lg border transition-all",
                                            formData.categoryIds.includes(category.id)
                                                ? "bg-orange-50 dark:bg-orange-900/20 border-orange-500 text-orange-700 dark:text-orange-400"
                                                : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700"
                                        )}
                                    >
                                        <div className="text-left">
                                            <div className="font-medium text-sm">{category.name}</div>
                                            <div className="text-xs text-zinc-500">{category.itemsCount} items</div>
                                        </div>
                                        {formData.categoryIds.includes(category.id) && (
                                            <Check className="h-4 w-4" />
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Specific Items (Optional)</Label>
                            <p className="text-xs text-zinc-500">
                                Leave empty to include all items from selected categories, or choose specific items
                            </p>
                            <div className="grid grid-cols-1 gap-2 max-h-60 overflow-y-auto p-2 bg-zinc-50 dark:bg-zinc-900/50 rounded-lg">
                                {items
                                    .filter((item) => formData.categoryIds.includes(item.categoryId))
                                    .map((item) => (
                                        <button
                                            key={item.id}
                                            type="button"
                                            onClick={() => toggleItem(item.id)}
                                            className={cn(
                                                "flex items-center justify-between p-2 rounded border transition-all text-left",
                                                formData.itemIds.includes(item.id)
                                                    ? "bg-orange-50 dark:bg-orange-900/20 border-orange-500"
                                                    : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 hover:border-zinc-300"
                                            )}
                                        >
                                            <div className="flex-1">
                                                <div className="font-medium text-sm">{item.name}</div>
                                                <div className="text-xs text-zinc-500">
                                                    {categories.find((c) => c.id === item.categoryId)?.name} • ${item.price}
                                                </div>
                                            </div>
                                            {formData.itemIds.includes(item.id) && (
                                                <Check className="h-4 w-4 text-orange-600" />
                                            )}
                                        </button>
                                    ))}
                            </div>
                        </div>

                        <div className="flex items-center justify-between p-3 bg-zinc-50 dark:bg-zinc-900/50 rounded-lg">
                            <div>
                                <Label className="text-sm font-medium">Active Status</Label>
                                <p className="text-xs text-zinc-500">Enable this menu for use in POS</p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, active: !formData.active })}
                                className={cn(
                                    "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
                                    formData.active ? "bg-orange-600" : "bg-zinc-300 dark:bg-zinc-700"
                                )}
                            >
                                <span
                                    className={cn(
                                        "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
                                        formData.active ? "translate-x-6" : "translate-x-1"
                                    )}
                                />
                            </button>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button
                            onClick={handleSave}
                            disabled={!formData.name.trim() || formData.categoryIds.length === 0}
                            className="bg-orange-600 hover:bg-orange-700 text-white"
                        >
                            {editingMenu ? "Update Menu" : "Create Menu"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
