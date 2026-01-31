"use client";

import React, { useState } from "react";
import {
    Shield,
    Users,
    Plus,
    Trash2,
    Mail,
    Check,
    X as XIcon,
    Phone,
    Crown,
    UserCog,
    Briefcase,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// MOCK: In production, this would come from auth context
const CURRENT_USER_ROLE = "owner";

// Hotel-specific roles
const ROLES = [
    {
        id: "owner",
        name: "Owner",
        color: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
        permissions: ["All Access - Full control over bookings, payments, guests, staff, and settings"]
    },
    {
        id: "manager",
        name: "Manager",
        color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
        permissions: ["Dashboard", "Bookings", "Guests", "Payments", "View Reports"]
    },
    {
        id: "receptionist",
        name: "Receptionist",
        color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
        permissions: ["Dashboard", "Bookings", "Guests (View Only)"]
    },
    {
        id: "housekeeping",
        name: "Housekeeping",
        color: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
        permissions: ["Room Status Updates", "Housekeeping Dashboard"]
    },
];

// Indian demo team members
const INITIAL_TEAM_MEMBERS = [
    { id: 1, name: "Vikram Malhotra", email: "vikram@hotelparadise.in", phone: "+91 98765 43210", role: "owner", avatar: "VM", department: "Management" },
    { id: 2, name: "Pooja Sharma", email: "pooja@hotelparadise.in", phone: "+91 87654 32109", role: "manager", avatar: "PS", department: "Front Office" },
    { id: 3, name: "Rahul Verma", email: "rahul@hotelparadise.in", phone: "+91 99887 76655", role: "receptionist", avatar: "RV", department: "Front Office" },
    { id: 4, name: "Sneha Patel", email: "sneha@hotelparadise.in", phone: "+91 77889 99001", role: "receptionist", avatar: "SP", department: "Front Office" },
    { id: 5, name: "Ravi Kumar", email: "ravi@hotelparadise.in", phone: "+91 94433 22110", role: "housekeeping", avatar: "RK", department: "Housekeeping" },
    { id: 6, name: "Meena Devi", email: "meena@hotelparadise.in", phone: "+91 92234 55677", role: "housekeeping", avatar: "MD", department: "Housekeeping" },
    { id: 7, name: "Arjun Singh", email: "arjun@hotelparadise.in", phone: "+91 81234 56789", role: "manager", avatar: "AS", department: "Food & Beverage" },
];

// Hotel-specific modules permission matrix
const MODULES = [
    { id: "dashboard", name: "Dashboard", owner: true, manager: true, receptionist: true, housekeeping: false },
    { id: "bookings", name: "Bookings", owner: true, manager: true, receptionist: true, housekeeping: false },
    { id: "guests", name: "Guest Management", owner: true, manager: true, receptionist: true, housekeeping: false },
    { id: "payments", name: "Payments", owner: true, manager: true, receptionist: false, housekeeping: false },
    { id: "rooms", name: "Room Status", owner: true, manager: true, receptionist: true, housekeeping: true },
    { id: "housekeeping", name: "Housekeeping", owner: true, manager: true, receptionist: false, housekeeping: true },
    { id: "reports", name: "Reports", owner: true, manager: true, receptionist: false, housekeeping: false },
    { id: "settings", name: "Settings", owner: true, manager: false, receptionist: false, housekeeping: false },
    { id: "staff", name: "Staff Management", owner: true, manager: false, receptionist: false, housekeeping: false },
];

interface TeamMember {
    id: number;
    name: string;
    email: string;
    phone: string;
    role: string;
    avatar: string;
    department: string;
}

export default function StaffsPage() {
    const [teamMembers, setTeamMembers] = useState<TeamMember[]>(INITIAL_TEAM_MEMBERS);
    const [showAddMemberModal, setShowAddMemberModal] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [memberToDelete, setMemberToDelete] = useState<TeamMember | null>(null);
    const [newMember, setNewMember] = useState({ name: "", email: "", phone: "", role: "receptionist", department: "Front Office" });

    const handleAddMember = () => {
        if (!newMember.name || !newMember.email || !newMember.phone) {
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
            phone: newMember.phone,
            role: newMember.role,
            avatar: initials,
            department: newMember.department,
        };

        setTeamMembers([...teamMembers, newTeamMember]);
        setNewMember({ name: "", email: "", phone: "", role: "receptionist", department: "Front Office" });
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

    const handleCallMember = (phone: string) => {
        window.location.href = `tel:${phone}`;
    };

    // Group members by department
    const departments = Array.from(new Set(teamMembers.map(m => m.department)));

    // Stats
    const stats = {
        total: teamMembers.length,
        managers: teamMembers.filter(m => m.role === "manager" || m.role === "owner").length,
        receptionists: teamMembers.filter(m => m.role === "receptionist").length,
        housekeeping: teamMembers.filter(m => m.role === "housekeeping").length,
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-serif text-gray-900 dark:text-white">Staff & Roles</h1>
                    <p className="text-gray-500 dark:text-gray-400">Manage your hotel team and their access permissions</p>
                </div>
                <Button
                    onClick={() => setShowAddMemberModal(true)}
                    className="gap-2"
                >
                    <Plus className="h-4 w-4" />
                    Add Staff Member
                </Button>
            </div>

            {/* Stats */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-black p-5 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="rounded-lg bg-blue-50 dark:bg-blue-950/50 p-2.5">
                            <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Total Staff</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
                        </div>
                    </div>
                </div>
                <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-black p-5 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="rounded-lg bg-purple-50 dark:bg-purple-950/50 p-2.5">
                            <Crown className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Management</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.managers}</p>
                        </div>
                    </div>
                </div>
                <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-black p-5 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="rounded-lg bg-green-50 dark:bg-green-950/50 p-2.5">
                            <UserCog className="h-5 w-5 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Receptionists</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.receptionists}</p>
                        </div>
                    </div>
                </div>
                <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-black p-5 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="rounded-lg bg-amber-50 dark:bg-amber-950/50 p-2.5">
                            <Briefcase className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Housekeeping</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.housekeeping}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Team Members by Department */}
            <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-black shadow-sm overflow-hidden">
                <div className="flex items-center gap-3 p-6 border-b border-gray-100 dark:border-gray-900">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                        <Users className="h-5 w-5 text-blue-600 dark:text-blue-500" />
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Team Members</h2>
                        <p className="text-sm text-gray-500">Manage your hotel staff across all departments</p>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 dark:bg-white/5 border-b border-gray-100 dark:border-gray-800">
                            <tr>
                                <th className="px-6 py-4 text-left font-medium text-gray-500">Member</th>
                                <th className="px-6 py-4 text-left font-medium text-gray-500">Contact</th>
                                <th className="px-6 py-4 text-left font-medium text-gray-500">Department</th>
                                <th className="px-6 py-4 text-left font-medium text-gray-500">Role</th>
                                <th className="px-6 py-4 text-right font-medium text-gray-500">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                            {teamMembers.map((member) => {
                                const roleInfo = ROLES.find(r => r.id === member.role);
                                return (
                                    <tr key={member.id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className={cn(
                                                    "h-10 w-10 rounded-full flex items-center justify-center font-semibold text-sm",
                                                    member.role === "owner"
                                                        ? "bg-gradient-to-br from-purple-400 to-purple-600 text-white"
                                                        : member.role === "manager"
                                                            ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                                                            : member.role === "receptionist"
                                                                ? "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400"
                                                                : "bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400"
                                                )}>
                                                    {member.avatar}
                                                </div>
                                                <span className="font-medium text-gray-900 dark:text-white">{member.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-gray-600 dark:text-gray-300">{member.email}</div>
                                            <div className="text-xs text-gray-400">{member.phone}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-gray-600 dark:text-gray-300">{member.department}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <Badge className={cn("border-0", roleInfo?.color)}>
                                                {roleInfo?.name}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => handleCallMember(member.phone)}
                                                    className="hover:bg-gray-100 dark:hover:bg-gray-800"
                                                >
                                                    <Phone className="h-4 w-4 text-gray-500" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => handleEmailMember(member.email)}
                                                    className="hover:bg-gray-100 dark:hover:bg-gray-800"
                                                >
                                                    <Mail className="h-4 w-4 text-gray-500" />
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
            <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-black shadow-sm p-6">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                        <Shield className="h-5 w-5 text-purple-600 dark:text-purple-500" />
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Role Definitions</h2>
                        <p className="text-sm text-gray-500">Access permissions for each role</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    {ROLES.map((role) => (
                        <div key={role.id} className="p-4 rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-950/30">
                            <Badge className={cn("mb-3 border-0", role.color)}>
                                {role.name}
                            </Badge>
                            <ul className="space-y-1.5">
                                {role.permissions.map((perm, idx) => (
                                    <li key={idx} className="text-xs text-gray-600 dark:text-gray-400 flex items-start gap-1.5">
                                        <Check className="h-3 w-3 text-green-500 mt-0.5 flex-shrink-0" />
                                        <span>{perm}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Permission Matrix */}
                <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-800">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 dark:bg-white/5 border-b border-gray-200 dark:border-gray-800">
                            <tr>
                                <th className="px-6 py-3 text-left font-medium text-gray-500">Module</th>
                                <th className="px-6 py-3 text-center font-medium text-gray-500">Owner</th>
                                <th className="px-6 py-3 text-center font-medium text-gray-500">Manager</th>
                                <th className="px-6 py-3 text-center font-medium text-gray-500">Receptionist</th>
                                <th className="px-6 py-3 text-center font-medium text-gray-500">Housekeeping</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                            {MODULES.map((module) => (
                                <tr key={module.id} className="hover:bg-gray-50 dark:hover:bg-white/5">
                                    <td className="px-6 py-3 font-medium text-gray-900 dark:text-white">{module.name}</td>
                                    <td className="px-6 py-3 text-center">
                                        {module.owner ? (
                                            <Check className="h-5 w-5 text-green-500 mx-auto" />
                                        ) : (
                                            <XIcon className="h-5 w-5 text-gray-300 dark:text-gray-700 mx-auto" />
                                        )}
                                    </td>
                                    <td className="px-6 py-3 text-center">
                                        {module.manager ? (
                                            <Check className="h-5 w-5 text-green-500 mx-auto" />
                                        ) : (
                                            <XIcon className="h-5 w-5 text-gray-300 dark:text-gray-700 mx-auto" />
                                        )}
                                    </td>
                                    <td className="px-6 py-3 text-center">
                                        {module.receptionist ? (
                                            <Check className="h-5 w-5 text-green-500 mx-auto" />
                                        ) : (
                                            <XIcon className="h-5 w-5 text-gray-300 dark:text-gray-700 mx-auto" />
                                        )}
                                    </td>
                                    <td className="px-6 py-3 text-center">
                                        {module.housekeeping ? (
                                            <Check className="h-5 w-5 text-green-500 mx-auto" />
                                        ) : (
                                            <XIcon className="h-5 w-5 text-gray-300 dark:text-gray-700 mx-auto" />
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add Member Modal */}
            {showAddMemberModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-xl border border-gray-200 dark:border-gray-800 w-full max-w-md">
                        <div className="p-6 border-b border-gray-200 dark:border-gray-800">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Add Staff Member</h3>
                            <p className="text-sm text-gray-500 mt-1">Add a new team member to your hotel</p>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Full Name</label>
                                <Input
                                    placeholder="e.g., Priya Sharma"
                                    value={newMember.name}
                                    onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Email</label>
                                <Input
                                    type="email"
                                    placeholder="e.g., priya@hotelparadise.in"
                                    value={newMember.email}
                                    onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Phone</label>
                                <Input
                                    type="tel"
                                    placeholder="e.g., +91 98765 43210"
                                    value={newMember.phone}
                                    onChange={(e) => setNewMember({ ...newMember, phone: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Department</label>
                                    <select
                                        className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-sm"
                                        value={newMember.department}
                                        onChange={(e) => setNewMember({ ...newMember, department: e.target.value })}
                                    >
                                        <option value="Front Office">Front Office</option>
                                        <option value="Housekeeping">Housekeeping</option>
                                        <option value="Food & Beverage">Food & Beverage</option>
                                        <option value="Maintenance">Maintenance</option>
                                        <option value="Management">Management</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Role</label>
                                    <select
                                        className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-sm"
                                        value={newMember.role}
                                        onChange={(e) => setNewMember({ ...newMember, role: e.target.value })}
                                    >
                                        <option value="receptionist">Receptionist</option>
                                        <option value="housekeeping">Housekeeping</option>
                                        <option value="manager">Manager</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className="p-6 border-t border-gray-200 dark:border-gray-800 flex justify-end gap-2">
                            <Button variant="outline" onClick={() => setShowAddMemberModal(false)}>Cancel</Button>
                            <Button onClick={handleAddMember}>Add Member</Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && memberToDelete && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-xl border border-gray-200 dark:border-gray-800 w-full max-w-md text-center p-6">
                        <Trash2 className="h-12 w-12 text-red-500 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">Remove {memberToDelete.name}?</h3>
                        <p className="text-gray-500 mb-6">This will permanently remove them from the team. They will lose access to all hotel systems.</p>
                        <div className="flex justify-center gap-3">
                            <Button variant="outline" onClick={() => setShowDeleteConfirm(false)}>Cancel</Button>
                            <Button onClick={confirmDelete} className="bg-red-600 hover:bg-red-700 text-white">Remove</Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
