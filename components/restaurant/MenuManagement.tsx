"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
    Settings,
    Upload,
    FileSpreadsheet,
    X,
    ChevronDown,
    LayoutGrid,
    List,
    ChefHat,
    UtensilsCrossed
} from "lucide-react";
import { CategoryList } from "./menu/CategoryList";
import { MenuItemList } from "./menu/MenuItemList";
import { ModifierBuilder } from "./menu/ModifierBuilder";
import { MenuConfigurator } from "./menu/MenuConfigurator";
import {
    INITIAL_CATEGORIES,
    INITIAL_ITEMS,
    INITIAL_MODIFIER_GROUPS,
    INITIAL_MENUS,
    Category,
    MenuItem,
    ModifierGroup,
    Menu
} from "@/lib/menu-data";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export function MenuManagement() {
    // Initial state with lazy initialization from LocalStorage
    const [categories, setCategories] = useState<Category[]>(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('restaurant_categories');
            if (saved) return JSON.parse(saved);
        }
        return INITIAL_CATEGORIES;
    });

    const [items, setItems] = useState<MenuItem[]>(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('restaurant_menu_items');
            if (saved) return JSON.parse(saved);
        }
        return INITIAL_ITEMS;
    });

    const [modifierGroups, setModifierGroups] = useState<ModifierGroup[]>(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('restaurant_modifier_groups');
            if (saved) return JSON.parse(saved);
        }
        return INITIAL_MODIFIER_GROUPS;
    });

    const [menus, setMenus] = useState<Menu[]>(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('restaurant_menus');
            if (saved) return JSON.parse(saved);
        }
        return INITIAL_MENUS;
    });

    const [selectedMenuId, setSelectedMenuId] = useState<string>(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('restaurant_management_selected_menu');
            if (saved) {
                // Check if saved ID actually exists in menus
                if (typeof window !== 'undefined') {
                    const currentMenus = JSON.parse(localStorage.getItem('restaurant_menus') || '[]');
                    if (currentMenus.some((m: any) => m.id === saved)) {
                        return saved;
                    }
                }
            }
        }
        return menus.length > 0 ? menus[0].id : "";
    });

    const [activeTab, setActiveTab] = useState("categories");
    const [showMenuConfig, setShowMenuConfig] = useState(false);
    const [showCSVUpload, setShowCSVUpload] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    // Persist changes
    useEffect(() => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('restaurant_categories', JSON.stringify(categories));
        }
    }, [categories]);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('restaurant_menu_items', JSON.stringify(items));
        }
    }, [items]);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('restaurant_modifier_groups', JSON.stringify(modifierGroups));
        }
    }, [modifierGroups]);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('restaurant_menus', JSON.stringify(menus));
        }
    }, [menus]);

    useEffect(() => {
        if (selectedMenuId && typeof window !== 'undefined') {
            localStorage.setItem('restaurant_management_selected_menu', selectedMenuId);
        }
    }, [selectedMenuId]);

    const selectedMenu = menus.find(m => m.id === selectedMenuId);

    const filteredCategories = selectedMenu
        ? categories.filter(cat => selectedMenu.categoryIds.includes(cat.id))
        : categories;

    const filteredItems = selectedMenu
        ? items.filter(item => {
            if (selectedMenu.itemIds.length > 0) {
                return selectedMenu.itemIds.includes(item.id);
            }
            return selectedMenu.categoryIds.includes(item.categoryId);
        })
        : items;

    const handleImport = async () => {
        if (!selectedFile) return;

        const reader = new FileReader();
        reader.onload = async (e) => {
            const text = e.target?.result as string;
            const lines = text.split('\n');
            const headers = lines[0].split(',').map(h => h.trim().toLowerCase());

            const newItems: MenuItem[] = [];
            const newCategories: Category[] = [...categories];
            const updatedItemsInMenu: string[] = selectedMenu ? [...selectedMenu.itemIds] : [];
            const updatedCategoriesInMenu: string[] = selectedMenu ? [...selectedMenu.categoryIds] : [];

            for (let i = 1; i < lines.length; i++) {
                const line = lines[i].trim();
                if (!line) continue;

                const values = line.split(',').map(v => v.trim());
                const itemData: any = {};
                headers.forEach((header, index) => {
                    itemData[header] = values[index];
                });

                if (!itemData.name || !itemData.price || !itemData.category) continue;

                let categoryObj = newCategories.find(c => c.name.toLowerCase() === itemData.category.toLowerCase());
                if (!categoryObj) {
                    categoryObj = {
                        id: `cat-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                        name: itemData.category,
                        description: "",
                        itemsCount: 0
                    };
                    newCategories.push(categoryObj);
                    if (selectedMenu && !updatedCategoriesInMenu.includes(categoryObj.id)) {
                        updatedCategoriesInMenu.push(categoryObj.id);
                    }
                }

                const currentCategory = categoryObj;

                const newItem: MenuItem = {
                    id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                    name: itemData.name,
                    description: itemData.description || "",
                    price: parseFloat(itemData.price),
                    categoryId: currentCategory.id,
                    isVeg: itemData.isveg?.toLowerCase() === 'true',
                    available: itemData.available?.toLowerCase() !== 'false',
                    modifierGroups: []
                };

                newItems.push(newItem);
                if (selectedMenu && !updatedItemsInMenu.includes(newItem.id)) {
                    updatedItemsInMenu.push(newItem.id);
                }

                currentCategory.itemsCount = (currentCategory.itemsCount || 0) + 1;
            }

            if (newItems.length > 0) {
                setCategories(newCategories);
                setItems([...items, ...newItems]);

                if (selectedMenu) {
                    const newMenus = menus.map(m =>
                        m.id === selectedMenu.id
                            ? { ...m, categoryIds: updatedCategoriesInMenu, itemIds: updatedItemsInMenu }
                            : m
                    );
                    setMenus(newMenus);
                }

                alert(`Successfully imported ${newItems.length} items.`);
            }

            setShowCSVUpload(false);
            setSelectedFile(null);
        };
        reader.readAsText(selectedFile);
    };

    if (showMenuConfig) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="h-full flex flex-col space-y-6"
            >
                <div className="flex items-center justify-between pb-6 border-b border-zinc-200 dark:border-zinc-800">
                    <div>
                        <h2 className="text-3xl font-bold text-zinc-900 dark:text-white flex items-center gap-3">
                            <Settings className="w-8 h-8 text-orange-600" />
                            Menu Configuration
                        </h2>
                        <p className="text-zinc-500 mt-2 text-lg">Create and manage your restaurant menus</p>
                    </div>
                    <Button
                        variant="ghost"
                        onClick={() => setShowMenuConfig(false)}
                        className="text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
                    >
                        Back to Menu Management
                    </Button>
                </div>
                <MenuConfigurator
                    menus={menus}
                    setMenus={setMenus}
                    categories={categories}
                    items={items}
                />
            </motion.div>
        );
    }

    return (
        <div className="h-full flex flex-col space-y-8 max-w-[1600px] mx-auto">
            {/* Premium Header */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 border border-zinc-800 shadow-2xl">
                <div className="absolute top-0 right-0 p-32 bg-orange-500/10 rounded-full blur-3xl -mr-16 -mt-16" />
                <div className="absolute bottom-0 left-0 p-24 bg-blue-500/10 rounded-full blur-3xl -ml-12 -mb-12" />

                <div className="relative p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                    <div className="flex items-center gap-6">
                        <div className="bg-gradient-to-br from-orange-400 to-orange-600 p-4 rounded-2xl shadow-lg shadow-orange-500/20 hidden sm:block">
                            <ChefHat className="h-10 w-10 text-white" />
                        </div>
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <h1 className="text-3xl font-bold text-white tracking-tight">
                                    Menu Management
                                </h1>
                                <Badge variant="secondary" className="bg-zinc-700/50 text-zinc-300 border-zinc-600 backdrop-blur-md">
                                    Admin
                                </Badge>
                            </div>

                            <div className="flex items-center gap-4 flex-wrap">
                                <div className="relative group z-10">
                                    <select
                                        value={selectedMenuId}
                                        onChange={(e) => setSelectedMenuId(e.target.value)}
                                        className="appearance-none bg-zinc-800/50 border border-zinc-700 text-white pl-4 pr-10 py-2 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-orange-500/50 hover:bg-zinc-800 transition-all cursor-pointer min-w-[200px]"
                                    >
                                        {menus.map(menu => (
                                            <option key={menu.id} value={menu.id} className="bg-zinc-900">
                                                {menu.name}
                                            </option>
                                        ))}
                                    </select>
                                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 pointer-events-none group-hover:text-white transition-colors" />
                                </div>

                                {selectedMenu && (
                                    <div className="flex gap-4 text-sm text-zinc-400">
                                        <span className="flex items-center gap-2">
                                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                            {filteredCategories.length} Categories
                                        </span>
                                        <span className="flex items-center gap-2">
                                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                                            {filteredItems.length} Items
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 z-10 w-full md:w-auto">
                        <Button
                            variant="secondary"
                            onClick={() => setShowCSVUpload(true)}
                            className="bg-zinc-800/50 text-white border-zinc-700 hover:bg-zinc-700 hover:text-white backdrop-blur-sm transition-all"
                        >
                            <Upload className="h-4 w-4 mr-2" />
                            Import CSV
                        </Button>
                        <Button
                            onClick={() => setShowMenuConfig(true)}
                            className="bg-white text-zinc-900 hover:bg-zinc-200 transition-all font-semibold shadow-lg shadow-white/5"
                        >
                            <Settings className="h-4 w-4 mr-2" />
                            Configure Menus
                        </Button>
                    </div>
                </div>
            </div>

            {/* Custom Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full space-y-8">
                <div className="flex justify-center sticky top-0 z-20 py-2">
                    <TabsList className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border border-zinc-200 dark:border-zinc-800 p-1.5 rounded-full shadow-sm inline-flex h-auto gap-2">
                        {[
                            { id: "categories", label: "Categories", icon: LayoutGrid },
                            { id: "items", label: "Menu Items", icon: UtensilsCrossed },
                            { id: "modifiers", label: "Modifiers", icon: List },
                        ].map((tab) => (
                            <TabsTrigger
                                key={tab.id}
                                value={tab.id}
                                className="px-6 py-2.5 rounded-full data-[state=active]:bg-zinc-900 data-[state=active]:text-white dark:data-[state=active]:bg-white dark:data-[state=active]:text-zinc-900 transition-all font-medium text-zinc-600 dark:text-zinc-400 gap-2"
                            >
                                <tab.icon className="h-4 w-4" />
                                {tab.label}
                            </TabsTrigger>
                        ))}
                    </TabsList>
                </div>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="w-full"
                    >
                        {activeTab === "categories" && (
                            <CategoryList categories={filteredCategories} setCategories={setCategories} />
                        )}

                        {activeTab === "items" && (
                            <MenuItemList
                                items={filteredItems}
                                setItems={setItems}
                                categories={filteredCategories}
                            />
                        )}

                        {activeTab === "modifiers" && (
                            <ModifierBuilder
                                modifierGroups={modifierGroups}
                                setModifierGroups={setModifierGroups}
                            />
                        )}
                    </motion.div>
                </AnimatePresence>
            </Tabs>

            {/* CSV Import Modal */}
            <AnimatePresence>
                {showCSVUpload && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl border border-zinc-200 dark:border-zinc-800 w-full max-w-lg overflow-hidden"
                        >
                            <div className="relative p-6 border-b border-zinc-100 dark:border-zinc-800">
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 to-red-500" />
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-xl">
                                            <FileSpreadsheet className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-zinc-900 dark:text-white">Import Menu</h3>
                                            <p className="text-xs text-zinc-500">Upload a CSV file to bulk import items</p>
                                        </div>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => { setShowCSVUpload(false); setSelectedFile(null); }}
                                        className="rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800"
                                    >
                                        <X className="h-5 w-5 text-zinc-400" />
                                    </Button>
                                </div>
                            </div>

                            <div className="p-8">
                                <div
                                    className={cn(
                                        "border-2 border-dashed rounded-2xl p-8 text-center transition-all cursor-pointer group",
                                        selectedFile
                                            ? "border-green-500 bg-green-50/50 dark:bg-green-900/10"
                                            : "border-zinc-200 dark:border-zinc-700 hover:border-orange-500 hover:bg-orange-50/30 dark:hover:bg-orange-900/10"
                                    )}
                                    onClick={() => document.getElementById('csv-file-input')?.click()}
                                >
                                    <input
                                        id="csv-file-input"
                                        type="file"
                                        accept=".csv"
                                        className="hidden"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) setSelectedFile(file);
                                        }}
                                    />

                                    {selectedFile ? (
                                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
                                            <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                                                <FileSpreadsheet className="h-8 w-8 text-green-600 dark:text-green-400" />
                                            </div>
                                            <div>
                                                <p className="font-semibold text-zinc-900 dark:text-white text-lg">{selectedFile.name}</p>
                                                <p className="text-sm text-zinc-500">{(selectedFile.size / 1024).toFixed(1)} KB</p>
                                            </div>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={(e) => { e.stopPropagation(); setSelectedFile(null); }}
                                                className="mt-2 text-red-500 hover:text-red-600 hover:bg-red-50"
                                            >
                                                Remove File
                                            </Button>
                                        </motion.div>
                                    ) : (
                                        <div className="space-y-4">
                                            <div className="mx-auto w-16 h-16 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                                <Upload className="h-8 w-8 text-zinc-400 group-hover:text-orange-500 transition-colors" />
                                            </div>
                                            <div>
                                                <p className="font-semibold text-zinc-900 dark:text-white text-lg">Click to upload CSV</p>
                                                <p className="text-sm text-zinc-500">or drag and drop here</p>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="mt-6 flex items-center justify-between text-sm text-zinc-500 bg-zinc-50 dark:bg-zinc-900 p-4 rounded-xl">
                                    <div className="flex flex-col">
                                        <span className="font-medium text-zinc-900 dark:text-zinc-300">Required Columns:</span>
                                        <span className="text-xs">name, price, category</span>
                                    </div>
                                    <Button
                                        variant="link"
                                        className="text-orange-600 dark:text-orange-400 p-0 h-auto font-semibold"
                                        onClick={() => {
                                            const csvContent = `name,description,price,category,isVeg,available\nPaneer Tikka,Grilled cottage cheese with spices,250,Appetizers,true,true\nChicken Biryani,Aromatic rice with chicken,350,Main Course,false,true`;
                                            const blob = new Blob([csvContent], { type: 'text/csv' });
                                            const url = window.URL.createObjectURL(blob);
                                            const a = document.createElement('a');
                                            a.href = url;
                                            a.download = 'menu_template.csv';
                                            a.click();
                                            window.URL.revokeObjectURL(url);
                                        }}
                                    >
                                        Download Template
                                    </Button>
                                </div>
                            </div>

                            <div className="p-6 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 flex justify-end gap-3">
                                <Button
                                    variant="ghost"
                                    onClick={() => { setShowCSVUpload(false); setSelectedFile(null); }}
                                    className="hover:bg-zinc-200 dark:hover:bg-zinc-800"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    onClick={handleImport}
                                    disabled={!selectedFile}
                                    className="bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-100 shadow-lg shadow-zinc-900/20 px-8"
                                >
                                    Import Items
                                </Button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
