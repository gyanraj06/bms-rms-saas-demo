"use client";

import { useState } from "react";
import { Plus, Edit2, Trash2, MoreVertical, LayoutGrid, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Category } from "@/lib/menu-data";
import { motion, AnimatePresence } from "framer-motion";

interface CategoryListProps {
    categories: Category[];
    setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
}

export function CategoryList({ categories, setCategories }: CategoryListProps) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [formData, setFormData] = useState({ name: "", description: "" });

    const openCreateDialog = () => {
        setEditingCategory(null);
        setFormData({ name: "", description: "" });
        setIsDialogOpen(true);
    };

    const openEditDialog = (category: Category) => {
        setEditingCategory(category);
        setFormData({ name: category.name, description: category.description || "" });
        setIsDialogOpen(true);
    };

    const handleSave = () => {
        if (!formData.name.trim()) return;

        if (editingCategory) {
            setCategories(categories.map(c =>
                c.id === editingCategory.id
                    ? { ...c, ...formData }
                    : c
            ));
        } else {
            const newCategory: Category = {
                id: `cat-${Date.now()}`,
                ...formData,
                itemsCount: 0
            };
            setCategories([...categories, newCategory]);
        }
        setIsDialogOpen(false);
    };

    const handleDelete = (id: string) => {
        // In a real app we might want to check for confirmation or dependencies
        setCategories(categories.filter((c) => c.id !== id));
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h3 className="text-xl font-semibold text-zinc-900 dark:text-white flex items-center gap-2">
                        <LayoutGrid className="w-5 h-5 text-orange-500" />
                        Menu Categories
                    </h3>
                    <p className="text-sm text-zinc-500">Organize your menu items into clear sections</p>
                </div>
                <Button onClick={openCreateDialog} className="bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 shadow-lg shadow-zinc-900/10">
                    <Plus className="mr-2 h-4 w-4" /> Add Category
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                <AnimatePresence mode="popLayout">
                    {categories.map((category, index) => (
                        <motion.div
                            key={category.id}
                            layout
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.2, delay: index * 0.05 }}
                        >
                            <Card className="group relative overflow-hidden border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 hover:shadow-xl hover:shadow-orange-500/5 dark:hover:shadow-orange-900/10 transition-all duration-300">
                                <div className="absolute top-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger className="h-8 w-8 inline-flex items-center justify-center rounded-full bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm shadow-sm hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
                                            <MoreVertical className="h-4 w-4 text-zinc-500" />
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent className="w-32 mr-2">
                                            <DropdownMenuItem onClick={() => openEditDialog(category)}>
                                                <Edit2 className="mr-2 h-3.5 w-3.5" /> Edit
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                className="text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-900/20"
                                                onClick={() => handleDelete(category.id)}
                                            >
                                                <Trash2 className="mr-2 h-3.5 w-3.5" /> Delete
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>

                                <CardHeader className="pb-3">
                                    <div className="w-10 h-10 rounded-xl bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center mb-3 text-orange-600 dark:text-orange-400">
                                        <Package className="h-5 w-5" />
                                    </div>
                                    <CardTitle className="text-lg font-bold group-hover:text-orange-600 transition-colors">
                                        {category.name}
                                    </CardTitle>
                                    <CardDescription className="line-clamp-2 min-h-[40px]">
                                        {category.description || "No description provided"}
                                    </CardDescription>
                                </CardHeader>

                                <CardFooter className="pt-0">
                                    <div className="flex items-center gap-2 text-xs font-medium text-zinc-500 bg-zinc-100 dark:bg-zinc-800 px-3 py-1.5 rounded-full">
                                        <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 group-hover:bg-orange-500 transition-colors" />
                                        {category.itemsCount} items
                                    </div>
                                </CardFooter>
                            </Card>
                        </motion.div>
                    ))}
                </AnimatePresence>

                <motion.button
                    layout
                    onClick={openCreateDialog}
                    className="flex flex-col items-center justify-center gap-3 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl p-6 text-zinc-400 hover:text-orange-500 hover:border-orange-500 hover:bg-orange-50/50 dark:hover:bg-orange-900/10 transition-all group min-h-[200px]"
                >
                    <div className="w-12 h-12 rounded-full bg-zinc-100 dark:bg-zinc-800 group-hover:bg-orange-100 dark:group-hover:bg-orange-900/20 flex items-center justify-center transition-colors">
                        <Plus className="w-6 h-6" />
                    </div>
                    <span className="font-semibold">Create Category</span>
                </motion.button>
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{editingCategory ? "Edit Category" : "New Category"}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Name</label>
                            <Input
                                placeholder="e.g. Appetizers"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Description</label>
                            <Textarea
                                placeholder="Short description for this category"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                        <Button onClick={handleSave} disabled={!formData.name.trim()} className="bg-orange-600 hover:bg-orange-700 text-white">
                            {editingCategory ? "Save Changes" : "Create Category"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
