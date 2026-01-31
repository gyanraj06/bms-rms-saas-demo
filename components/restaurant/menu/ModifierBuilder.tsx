"use client";

import { useState } from "react";
import { Plus, Edit2, Trash2, ChevronDown, ChevronUp, GripVertical, CheckCircle2, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    CardFooter
} from "@/components/ui/card";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ModifierGroup, Modifier } from "@/lib/menu-data";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface ModifierBuilderProps {
    modifierGroups: ModifierGroup[];
    setModifierGroups: React.Dispatch<React.SetStateAction<ModifierGroup[]>>;
}

export function ModifierBuilder({
    modifierGroups,
    setModifierGroups,
}: ModifierBuilderProps) {
    const [isAddingGroup, setIsAddingGroup] = useState(false);
    const [editingGroupId, setEditingGroupId] = useState<string | null>(null);

    // Form State
    const [groupName, setGroupName] = useState("");
    const [isRequired, setIsRequired] = useState(false);
    const [minSelection, setMinSelection] = useState(0);
    const [maxSelection, setMaxSelection] = useState(1);
    const [modifiers, setModifiers] = useState<Modifier[]>([]);

    const resetForm = () => {
        setGroupName("");
        setIsRequired(false);
        setMinSelection(0);
        setMaxSelection(1);
        setModifiers([]);
        setIsAddingGroup(false);
        setEditingGroupId(null);
    };

    const startEditing = (group: ModifierGroup) => {
        setGroupName(group.name);
        setIsRequired(group.required);
        setMinSelection(group.minSelection);
        setMaxSelection(group.maxSelection);
        setModifiers([...group.modifiers]);
        setEditingGroupId(group.id);
        setIsAddingGroup(true);
    };

    const handleSaveGroup = () => {
        if (!groupName.trim()) return;

        const newGroup: ModifierGroup = {
            id: editingGroupId || Math.random().toString(36).substr(2, 9),
            name: groupName,
            required: isRequired,
            minSelection: isRequired ? Math.max(1, minSelection) : minSelection,
            maxSelection: maxSelection,
            modifiers: modifiers,
        };

        if (editingGroupId) {
            setModifierGroups((prev) =>
                prev.map((g) => (g.id === newGroup.id ? newGroup : g))
            );
        } else {
            setModifierGroups((prev) => [...prev, newGroup]);
        }
        resetForm();
    };

    const deleteGroup = (id: string) => {
        if (confirm("Delete this modifier group?")) {
            setModifierGroups((prev) => prev.filter((g) => g.id !== id));
        }
    };

    const addModifierOption = () => {
        setModifiers([
            ...modifiers,
            {
                id: Math.random().toString(36).substr(2, 9),
                name: "",
                price: 0,
                available: true,
            },
        ]);
    };

    const updateModifierOption = (id: string, field: keyof Modifier, value: any) => {
        setModifiers((prev) =>
            prev.map((m) => (m.id === id ? { ...m, [field]: value } : m))
        );
    };

    const removeModifierOption = (id: string) => {
        setModifiers((prev) => prev.filter((m) => m.id !== id));
    };

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center bg-zinc-50 dark:bg-zinc-900/50 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white flex items-center gap-3">
                        <Layers className="h-6 w-6 text-orange-500" />
                        Modifier Groups
                    </h2>
                    <p className="text-muted-foreground mt-1">
                        Create groups of add-ons, sizes, or options (e.g. "Toppings", "Sizes").
                    </p>
                </div>
                {!isAddingGroup && (
                    <Button onClick={() => setIsAddingGroup(true)} className="bg-orange-600 hover:bg-orange-700 text-white shadow-lg shadow-orange-500/20">
                        <Plus className="mr-2 h-4 w-4" /> Create Group
                    </Button>
                )}
            </div>

            <AnimatePresence>
                {isAddingGroup && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                    >
                        <Card className="border-2 border-orange-500/20 shadow-2xl shadow-orange-500/5 bg-white dark:bg-zinc-900">
                            <CardHeader className="bg-zinc-50 dark:bg-zinc-950/50 pb-6 border-b border-zinc-100 dark:border-zinc-800">
                                <CardTitle className="flex items-center gap-2">
                                    {editingGroupId ? <Edit2 className="h-5 w-5 text-orange-500" /> : <Plus className="h-5 w-5 text-orange-500" />}
                                    {editingGroupId ? "Edit Modifier Group" : "New Modifier Group"}
                                </CardTitle>
                                <CardDescription>
                                    Define the rules for this group and add options.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-8 p-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {/* Left Column: Rules */}
                                    <div className="space-y-6">
                                        <div className="space-y-3">
                                            <Label className="text-base font-semibold">Group Name</Label>
                                            <Input
                                                placeholder="e.g., Pizza Toppings"
                                                value={groupName}
                                                onChange={(e) => setGroupName(e.target.value)}
                                                className="h-11 text-lg border-zinc-300 dark:border-zinc-700 focus:border-orange-500 bg-zinc-50 dark:bg-zinc-800"
                                            />
                                        </div>

                                        <div className="bg-zinc-50 dark:bg-zinc-950/50 p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 space-y-4">
                                            <div className="flex items-center justify-between">
                                                <div className="space-y-0.5">
                                                    <Label htmlFor="req" className="text-base font-semibold">Required Selection</Label>
                                                    <p className="text-sm text-zinc-500">Must the user select at least one option?</p>
                                                </div>
                                                <Switch id="req" checked={isRequired} onCheckedChange={setIsRequired} />
                                            </div>

                                            <div className="grid grid-cols-2 gap-4 pt-2">
                                                <div className="space-y-2">
                                                    <Label>Min Selection</Label>
                                                    <Input type="number" min="0" value={minSelection} onChange={(e) => setMinSelection(parseInt(e.target.value) || 0)} className="bg-white dark:bg-zinc-900" />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>Max Selection</Label>
                                                    <Input type="number" min="1" value={maxSelection} onChange={(e) => setMaxSelection(parseInt(e.target.value) || 1)} className="bg-white dark:bg-zinc-900" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right Column: Options */}
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center">
                                            <Label className="text-base font-semibold">Options</Label>
                                            <Button size="sm" variant="ghost" onClick={addModifierOption} className="gap-2">
                                                <Plus className="h-3.5 w-3.5" /> Add Benefit
                                            </Button>
                                        </div>

                                        <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                                            {modifiers.map((m, idx) => (
                                                <motion.div
                                                    key={m.id}
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    className="flex gap-3 items-center group bg-zinc-50 dark:bg-zinc-950/30 p-2 rounded-lg border border-transparent hover:border-zinc-200 dark:hover:border-zinc-800 transition-colors"
                                                >
                                                    <div className="cursor-move text-zinc-400 group-hover:text-zinc-600">
                                                        <GripVertical className="h-4 w-4" />
                                                    </div>
                                                    <Input
                                                        placeholder="Option Name"
                                                        value={m.name}
                                                        onChange={(e) => updateModifierOption(m.id, 'name', e.target.value)}
                                                        className="flex-1 bg-white dark:bg-zinc-900 shadow-sm"
                                                    />
                                                    <div className="relative w-24">
                                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 text-sm">₹</span>
                                                        <Input
                                                            type="number"
                                                            className="pl-6 bg-white dark:bg-zinc-900 shadow-sm"
                                                            placeholder="0"
                                                            value={m.price}
                                                            onChange={(e) => updateModifierOption(m.id, 'price', parseFloat(e.target.value) || 0)}
                                                        />
                                                    </div>
                                                    <Button size="icon" variant="ghost" onClick={() => removeModifierOption(m.id)} className="text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10">
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </motion.div>
                                            ))}
                                            {modifiers.length === 0 && (
                                                <div className="text-center py-10 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl">
                                                    <p className="text-zinc-500 text-sm">No options added yet.</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter className="flex justify-end gap-3 bg-zinc-50 dark:bg-zinc-950/50 p-6 border-t border-zinc-100 dark:border-zinc-800">
                                <Button variant="ghost" onClick={resetForm}>Cancel</Button>
                                <Button onClick={handleSaveGroup} disabled={!groupName.trim()} className="min-w-[120px] bg-orange-600 hover:bg-orange-700">{editingGroupId ? "Update Group" : "Save Group"}</Button>
                            </CardFooter>
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {modifierGroups.map((group) => (
                    <motion.div key={group.id} layout>
                        <Card className="group hover:shadow-lg transition-all duration-300 border-zinc-200 dark:border-zinc-800 hover:border-orange-500/20 dark:hover:border-orange-900/20">
                            <CardHeader className="pb-4">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <CardTitle className="text-lg font-bold flex items-center gap-2">
                                            {group.name}
                                            {group.required && <span className="bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wide">Required</span>}
                                        </CardTitle>
                                        <CardDescription className="mt-1.5 flex items-center gap-2">
                                            <span className="bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded text-xs font-mono text-zinc-600 dark:text-zinc-400">
                                                Min: {group.minSelection}
                                            </span>
                                            <span className="bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded text-xs font-mono text-zinc-600 dark:text-zinc-400">
                                                Max: {group.maxSelection}
                                            </span>
                                        </CardDescription>
                                    </div>
                                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => startEditing(group)}>
                                            <Edit2 className="h-4 w-4 text-zinc-500" />
                                        </Button>
                                        <Button size="icon" variant="ghost" className="h-8 w-8 hover:text-red-500" onClick={() => deleteGroup(group.id)}>
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-wrap gap-2">
                                    {group.modifiers.slice(0, 5).map(m => (
                                        <span key={m.id} className={cn(
                                            "inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium border transition-colors",
                                            m.price > 0
                                                ? "bg-orange-50 dark:bg-orange-900/10 border-orange-200 dark:border-orange-900/30 text-orange-700 dark:text-orange-300"
                                                : "bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300"
                                        )}>
                                            {m.name} {m.price > 0 && `(+₹${m.price})`}
                                        </span>
                                    ))}
                                    {group.modifiers.length > 5 && (
                                        <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-zinc-100 text-zinc-500">
                                            +{group.modifiers.length - 5} more
                                        </span>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
