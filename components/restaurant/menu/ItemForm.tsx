"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { MenuItem, Category } from "@/lib/menu-data"; // Ensure path is correct
import { X, Upload, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ItemFormProps {
    item?: MenuItem;
    categories: Category[];
    onSave: (item: MenuItem) => void;
    onCancel: () => void;
}

export function ItemForm({
    item,
    categories,
    onSave,
    onCancel,
}: ItemFormProps) {
    const [name, setName] = useState(item?.name || "");
    const [description, setDescription] = useState(item?.description || "");
    const [price, setPrice] = useState(item?.price || 0);
    const [prepTime, setPrepTime] = useState(item?.prepTime || 15);
    const [categoryId, setCategoryId] = useState(item?.categoryId || "");
    const [isVeg, setIsVeg] = useState(item?.isVeg ?? true);

    const [image, setImage] = useState(item?.image || "");

    // Set default category if creating new and categories exist
    useEffect(() => {
        if (!item && !categoryId && categories.length > 0) {
            setCategoryId(categories[0].id);
        }
    }, [categories, item, categoryId]);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newItem: MenuItem = {
            id: item?.id || Math.random().toString(36).substr(2, 9),
            name,
            description,
            price: Number(price),
            prepTime: Number(prepTime),
            categoryId,
            isVeg,
            available: item?.available ?? true,
            modifierGroups: [], // Default to empty array as functionality is removed from UI
            image: image,
        };
        onSave(newItem);
    };



    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left Column */}
                <div className="space-y-5">
                    <div className="space-y-2">
                        <Label htmlFor="name" className="text-zinc-900 font-semibold">Item Name</Label>
                        <Input
                            id="name"
                            placeholder="e.g., Margerita Pizza"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className="h-11 border-zinc-200 focus:border-orange-500 focus:ring-orange-500/20"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="category" className="text-zinc-900 font-semibold">Category</Label>
                        <Select value={categoryId} onValueChange={setCategoryId}>
                            <SelectTrigger className="h-11 border-zinc-200">
                                <SelectValue placeholder="Select Category">
                                    {categories.find((c) => c.id === categoryId)?.name}
                                </SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                                {categories.map((c) => (
                                    <SelectItem key={c.id} value={c.id}>
                                        {c.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="price" className="text-zinc-900 font-semibold">Price (₹)</Label>
                            <Input
                                id="price"
                                type="number"
                                min="0"
                                value={price}
                                onChange={(e) => setPrice(Number(e.target.value))}
                                required
                                className="h-11 border-zinc-200"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="prepTime" className="text-zinc-900 font-semibold flex items-center gap-1">
                                <Clock className="w-3.5 h-3.5 text-zinc-500" />
                                Avg Prep (min)
                            </Label>
                            <Input
                                id="prepTime"
                                type="number"
                                min="0"
                                value={prepTime}
                                onChange={(e) => setPrepTime(Number(e.target.value))}
                                className="h-11 border-zinc-200"
                            />
                        </div>
                    </div>

                    <div className="flex items-center space-x-3 pt-2">
                        <Switch id="is-veg" checked={isVeg} onCheckedChange={setIsVeg} />
                        <Label htmlFor="is-veg" className={isVeg ? "text-green-600 font-bold" : "text-zinc-500 font-medium"}>
                            {isVeg ? "Vegetarian" : "Non-Vegetarian"}
                        </Label>
                    </div>
                </div>

                {/* Right Column */}
                <div className="space-y-5">
                    <div className="space-y-2">
                        <Label className="text-zinc-900 font-semibold">Item Image</Label>
                        <div className="flex items-start gap-4">
                            <div className="relative h-28 w-28 rounded-xl border-2 border-dashed border-zinc-200 flex items-center justify-center overflow-hidden bg-zinc-50/50 hover:bg-zinc-50 transition-colors">
                                {image ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img src={image} alt="Preview" className="h-full w-full object-cover" />
                                ) : (
                                    <Upload className="h-8 w-8 text-zinc-300" />
                                )}
                            </div>
                            <div className="flex-1 space-y-3 pt-1">
                                <Label
                                    htmlFor="image-upload"
                                    className="cursor-pointer inline-flex items-center justify-center rounded-lg text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-white hover:bg-zinc-50 hover:text-accent-foreground h-10 px-4 py-2 w-full shadow-sm"
                                >
                                    <Upload className="mr-2 h-4 w-4" /> Upload Photo
                                </Label>
                                <Input
                                    id="image-upload"
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleImageUpload}
                                />
                                <p className="text-xs text-zinc-500 leading-relaxed">
                                    Recommended: Square Ratio (1:1), Max 2MB.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-zinc-900 font-semibold">Description</Label>
                        <Textarea
                            placeholder="Describe the dish..."
                            className="h-[108px] resize-none border-zinc-200 focus:border-orange-500 focus:ring-orange-500/20"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            <div className="flex justify-end gap-3 pt-6 border-t border-zinc-100 mt-6">
                <Button type="button" variant="outline" onClick={onCancel} className="h-11 px-6 border-zinc-200">
                    Cancel
                </Button>
                <Button type="submit" className="h-11 px-8 bg-zinc-900 hover:bg-zinc-800 text-white font-medium">
                    {item ? "Update Item" : "Create Item"}
                </Button>
            </div>
        </form>
    );
}
