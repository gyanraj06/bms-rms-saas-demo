"use client";

import React, { useState } from "react";
import {
    Shield,
    Users,
    Plus,
    Trash2,
    Mail,
    Lock,
    Check,
    X as XIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

// MOCK: In production, this would come from auth context
const CURRENT_USER_ROLE = "owner";

const ROLES = [
    {
        id: "owner",
        name: "Owner",
        color: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
        permissions: ["All Access - Full control over all features, billing, and team management"]
    },
    {
        id: "manager",
        name: "Manager",
        color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
        permissions: ["POS/Billing", "Live Orders", "Kitchen View", "Menu Management", "View Reports"]
    },
    {
        id: "staff",
        name: "Staff",
        color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
        permissions: ["POS/Billing", "Kitchen View"]
    },
];

const INITIAL_TEAM_MEMBERS = [
    { id: 1, name: "Arjun Sharma", email: "arjun@restaurant.com", role: "owner", avatar: "AS" },
    { id: 2, name: "Priya Patel", email: "priya@restaurant.com", role: "manager", avatar: "PP" },
    { id: 3, name: "Rahul Verma", email: "rahul@restaurant.com", role: "staff", avatar: "RV" },
    { id: 4, name: "Sneha Kumar", email: "sneha@restaurant.com", role: "staff", avatar: "SK" },
];

const MODULES = [
    { id: "pos", name: "POS / Billing", owner: true, manager: true, staff: true },
    { id: "orders", name: "Live Orders", owner: true, manager: true, staff: false },
    { id: "kitchen", name: "Kitchen View", owner: true, manager: true, staff: true },
    { id: "menu", name: "Menu Management", owner: true, manager: true, staff: false },
    { id: "settings", name: "Settings", owner: true, manager: false, staff: false },
    { id: "reports", name: "Reports", owner: true, manager: true, staff: false },
];

interface TeamMember {
    id: number;
    name: string;
    email: string;
    role: string;
    avatar: string;
}

export default function StaffsPage() {
    const [teamMembers, setTeamMembers] = useState<TeamMember[]>(INITIAL_TEAM_MEMBERS);
    const [showAddMemberModal, setShowAddMemberModal] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [memberToDelete, setMemberToDelete] = useState<TeamMember | null>(null);
    const [newMember, setNewMember] = useState({ name: "", email: "", role: "staff" });

    const handleAddMember = () => {
        if (!newMember.name || !newMember.email) {
            alert("Please fill in all fields");
            return;
        }

        const initials = newMember.name
            .split(" ")
            .map(n => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);

        const newTeamMember: TeamMember = {
            id: Math.max(...teamMembers.map(m => m.id)) + 1,
            name: newMember.name,
            email: newMember.email,
            role: newMember.role,
            avatar: initials,
        };

        setTeamMembers([...teamMembers, newTeamMember]);
        setNewMember({ name: "", email: "", role: "staff" });
        setShowAddMemberModal(false);
    };

    const handleDeleteMember = (member: TeamMember) => {
        setMemberToDelete(member);
        setShowDeleteConfirm(true);
    };

    const confirmDelete = () => {
        if (memberToDelete) {
            setTeamMembers(teamMembers.filter(m => m.id !== memberToDelete.id));
            setShowDeleteConfirm(false);
            setMemberToDelete(null);
        }
    };

    const handleEmailMember = (email: string) => {
        window.location.href = `mailto:${email}`;
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Staffs & Roles</h1>
                    <p className="text-gray-500 dark:text-gray-400">Manage your restaurant team and their access permissions.</p>
                </div>
                <Button
                    onClick={() => setShowAddMemberModal(true)}
                    className="bg-orange-600 hover:bg-orange-700 gap-2"
                >
                    <Plus className="h-4 w-4" />
                    Add Member
                </Button>
            </div>

            {/* Team Members */}
            <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-800 p-6">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                        <Users className="h-5 w-5 text-blue-600 dark:text-blue-500" />
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Team Members</h2>
                        <p className="text-sm text-gray-500">Manage your restaurant staff</p>
                    </div>
                </div>

                <div className="overflow-x-auto rounded-lg border border-zinc-200 dark:border-zinc-800">
                    <table className="w-full text-sm">
                        <thead className="bg-zinc-50 dark:bg-zinc-950/50 border-b border-zinc-200 dark:border-zinc-800">
                            <tr>
                                <th className="px-6 py-3 text-left font-medium text-zinc-500">Member</th>
                                <th className="px-6 py-3 text-left font-medium text-zinc-500">Email</th>
                                <th className="px-6 py-3 text-left font-medium text-zinc-500">Role</th>
                                <th className="px-6 py-3 text-right font-medium text-zinc-500">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                            {teamMembers.map((member) => {
                                const roleInfo = ROLES.find(r => r.id === member.role);
                                return (
                                    <tr key={member.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-full bg-orange-100 dark:bg-orange-900/20 text-orange-600 dark:text-orange-500 flex items-center justify-center font-semibold text-sm">
                                                    {member.avatar}
                                                </div>
                                                <span className="font-medium text-gray-900 dark:text-white">{member.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-zinc-600 dark:text-zinc-300">{member.email}</td>
                                        <td className="px-6 py-4">
                                            <span className={cn("inline-block px-3 py-1 rounded-full text-xs font-semibold", roleInfo?.color)}>
                                                {roleInfo?.name}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => handleEmailMember(member.email)}
                                                    className="hover:bg-zinc-100 dark:hover:bg-zinc-800"
                                                >
                                                    <Mail className="h-4 w-4 text-zinc-500" />
                                                </Button>
                                                {member.role !== "owner" && (
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => handleDeleteMember(member)}
                                                        className="hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Role Definitions */}
            <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-800 p-6">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                        <Shield className="h-5 w-5 text-purple-600 dark:text-purple-500" />
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Role Definitions</h2>
                        <p className="text-sm text-gray-500">Define what each role can access</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    {ROLES.map((role) => (
                        <div key={role.id} className="p-4 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/30">
                            <span className={cn("inline-block px-3 py-1 rounded-full text-xs font-semibold mb-3", role.color)}>
                                {role.name}
                            </span>
                            <ul className="space-y-1">
                                {role.permissions.map((perm, idx) => (
                                    <li key={idx} className="text-xs text-zinc-600 dark:text-zinc-400 flex items-start gap-1">
                                        <Check className="h-3 w-3 text-green-500 mt-0.5 flex-shrink-0" />
                                        <span>{perm}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Permission Matrix */}
                <div className="overflow-x-auto rounded-lg border border-zinc-200 dark:border-zinc-800">
                    <table className="w-full text-sm">
                        <thead className="bg-zinc-50 dark:bg-zinc-950/50 border-b border-zinc-200 dark:border-zinc-800">
                            <tr>
                                <th className="px-6 py-3 text-left font-medium text-zinc-500">Module</th>
                                <th className="px-6 py-3 text-center font-medium text-zinc-500">Owner</th>
                                <th className="px-6 py-3 text-center font-medium text-zinc-500">Manager</th>
                                <th className="px-6 py-3 text-center font-medium text-zinc-500">Staff</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                            {MODULES.map((module) => (
                                <tr key={module.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50">
                                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{module.name}</td>
                                    <td className="px-6 py-4 text-center">
                                        {module.owner ? (
                                            <Check className="h-5 w-5 text-green-500 mx-auto" />
                                        ) : (
                                            <XIcon className="h-5 w-5 text-zinc-300 dark:text-zinc-700 mx-auto" />
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        {module.manager ? (
                                            <Check className="h-5 w-5 text-green-500 mx-auto" />
                                        ) : (
                                            <XIcon className="h-5 w-5 text-zinc-300 dark:text-zinc-700 mx-auto" />
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        {module.staff ? (
                                            <Check className="h-5 w-5 text-green-500 mx-auto" />
                                        ) : (
                                            <XIcon className="h-5 w-5 text-zinc-300 dark:text-zinc-700 mx-auto" />
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modals */}
            {showAddMemberModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-xl border border-zinc-200 dark:border-zinc-800 w-full max-w-md">
                        <div className="p-6 border-b border-zinc-200 dark:border-zinc-800">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Add Team Member</h3>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Full Name</label>
                                <Input
                                    placeholder="Name"
                                    value={newMember.name}
                                    onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Email</label>
                                <Input
                                    type="email"
                                    placeholder="Email"
                                    value={newMember.email}
                                    onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Role</label>
                                <select
                                    className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950"
                                    value={newMember.role}
                                    onChange={(e) => setNewMember({ ...newMember, role: e.target.value })}
                                >
                                    <option value="staff">Staff</option>
                                    <option value="manager">Manager</option>
                                </select>
                            </div>
                        </div>
                        <div className="p-6 border-t border-zinc-200 dark:border-zinc-800 flex justify-end gap-2">
                            <Button variant="outline" onClick={() => setShowAddMemberModal(false)}>Cancel</Button>
                            <Button onClick={handleAddMember} className="bg-orange-600 hover:bg-orange-700">Add Member</Button>
                        </div>
                    </div>
                </div>
            )}

            {showDeleteConfirm && memberToDelete && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-xl border border-zinc-200 dark:border-zinc-800 w-full max-w-md text-center p-6">
                        <Trash2 className="h-12 w-12 text-red-500 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">Delete {memberToDelete.name}?</h3>
                        <p className="text-zinc-500 mb-6">This will permanently remove them from the team.</p>
                        <div className="flex justify-center gap-3">
                            <Button variant="outline" onClick={() => setShowDeleteConfirm(false)}>Cancel</Button>
                            <Button onClick={confirmDelete} className="bg-red-600 hover:bg-red-700 text-white">Delete</Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
