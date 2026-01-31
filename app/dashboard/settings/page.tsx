"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    User,
    Settings,
    Shield,
    CreditCard,
    Bell,
    Building,
    Mail,
    Phone,
    MapPin,
    Globe,
    Save,
    Lock,
    Eye,
    EyeOff
} from "lucide-react";
import { cn } from "@/lib/utils";

const TABS = [
    { id: "general", label: "General", icon: Building, description: "Manage hotel details and branding" },
    { id: "profile", label: "Profile", icon: User, description: "Personal details and role" },
    { id: "preferences", label: "Preferences", icon: Settings, description: "System display and language" },
    { id: "notifications", label: "Notifications", icon: Bell, description: "Email and push alerts" },
    { id: "security", label: "Security", icon: Shield, description: "Password and 2FA" },
    { id: "billing", label: "Billing", icon: CreditCard, description: "Subscription and invoices" },
];

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState("general");

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Settings</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2">
                    Manage your hotel configuration and personal preferences.
                </p>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Sidebar Navigation */}
                <nav className="w-full lg:w-64 space-y-1">
                    {TABS.map((tab) => {
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={cn(
                                    "w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200",
                                    isActive
                                        ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20 scale-[1.02]"
                                        : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5"
                                )}
                            >
                                <Icon className={cn("h-5 w-5", isActive ? "text-white" : "text-slate-400")} />
                                <div className="text-left">
                                    <span className="block">{tab.label}</span>
                                </div>
                            </button>
                        );
                    })}
                </nav>

                {/* Content Area */}
                <div className="flex-1 bg-white dark:bg-black/40 border border-slate-200 dark:border-white/10 rounded-2xl p-6 lg:p-8 shadow-sm">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            transition={{ duration: 0.2 }}
                        >
                            <TabContent tab={activeTab} />
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}

function TabContent({ tab }: { tab: string }) {
    switch (tab) {
        case "general":
            return <GeneralSettings />;
        case "profile":
            return <ProfileSettings />;
        case "preferences":
            return <PreferencesSettings />;
        case "notifications":
        case "security":
        case "billing":
            return <ComingSoon tab={tab} />;
        default:
            return null;
    }
}

function GeneralSettings() {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Hotel Information</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    Basic details about your property visible to guests.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputGroup label="Hotel Name" defaultValue="Grand Horizon Resort" />
                <InputGroup label="Brand Name" defaultValue="Horizon Group" />
                <InputGroup label="Website URL" defaultValue="https://grandhorizon.com" icon={Globe} />
                <InputGroup label="Contact Phone" defaultValue="+91 98765 43210" icon={Phone} />
                <div className="col-span-full">
                    <InputGroup label="Address" defaultValue="12 Ocean View Road, Mumbai, Maharashtra 400050" icon={MapPin} />
                </div>
                <div className="col-span-full">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                        Description
                    </label>
                    <textarea
                        className="w-full h-32 px-4 py-2.5 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-900 dark:text-white text-sm resize-none"
                        defaultValue="Experience luxury at its finest with panoramic ocean views and world-class amenities."
                    />
                </div>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-white/10 flex justify-end">
                <button className="flex items-center gap-2 px-6 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-black font-medium rounded-lg hover:opacity-90 transition-opacity">
                    <Save className="h-4 w-4" />
                    Save Changes
                </button>
            </div>
        </div>
    );
}

function ProfileSettings() {
    return (
        <div className="space-y-8">
            <div className="flex items-center gap-6">
                <div className="h-24 w-24 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-3xl font-bold text-white shadow-xl">
                    RS
                </div>
                <div>
                    <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Rajesh Sharma</h2>
                    <p className="text-slate-500 dark:text-slate-400">General Manager</p>
                    <button className="mt-2 text-sm text-blue-600 dark:text-blue-400 font-medium hover:underline">
                        Change Avatar
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-slate-100 dark:border-white/10">
                <InputGroup label="Full Name" defaultValue="Rajesh Sharma" icon={User} />
                <InputGroup label="Email Address" defaultValue="rajesh.sharma@grandhorizon.com" icon={Mail} />
                <InputGroup label="Phone Number" defaultValue="+91 98765 43210" icon={Phone} />
                <InputGroup label="Employee ID" defaultValue="GH-1001" disabled />
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-white/10 flex justify-end">
                <button className="flex items-center gap-2 px-6 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-black font-medium rounded-lg hover:opacity-90 transition-opacity">
                    <Save className="h-4 w-4" />
                    Update Profile
                </button>
            </div>
        </div>
    );
}

function PreferencesSettings() {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white">System Preferences</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    Customize your dashboard experience.
                </p>
            </div>

            <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5">
                    <div>
                        <h3 className="font-medium text-slate-900 dark:text-white">Dark Mode</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Reduce eye strain with a dark interface.</p>
                    </div>
                    <div className="relative inline-flex h-6 w-11 items-center rounded-full bg-slate-200 dark:bg-blue-600 transition-colors">
                        <span className="translate-x-6 inline-block h-4 w-4 transform rounded-full bg-white transition-transform" />
                    </div>
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5">
                    <div>
                        <h3 className="font-medium text-slate-900 dark:text-white">Email Notifications</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Receive daily digest of new bookings.</p>
                    </div>
                    <div className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-600 transition-colors">
                        <span className="translate-x-6 inline-block h-4 w-4 transform rounded-full bg-white transition-transform" />
                    </div>
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5">
                    <div>
                        <h3 className="font-medium text-slate-900 dark:text-white">Compact View</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Display more information with less spacing.</p>
                    </div>
                    <div className="relative inline-flex h-6 w-11 items-center rounded-full bg-slate-200 transition-colors">
                        <span className="translate-x-1 inline-block h-4 w-4 transform rounded-full bg-white transition-transform" />
                    </div>
                </div>
            </div>
        </div>
    )
}


function ComingSoon({ tab }: { tab: string }) {
    const info = {
        notifications: { title: "Notifications Engine", desc: "Granular control over email, SMS, and push notifications." },
        security: { title: "Advanced Security", desc: "Two-factor authentication, session management, and audit logs." },
        billing: { title: "Billing & Invoices", desc: "Manage subscription plans, view invoice history, and payment methods." }
    }[tab as "notifications" | "security" | "billing"];

    return (
        <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="h-20 w-20 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center mb-6">
                <Settings className="h-10 w-10 text-slate-400 animate-spin-slow" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">{info?.title}</h2>
            <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-8">
                {info?.desc} This feature is currently under development and will be available in a future update.
            </p>
            <button className="px-6 py-2 bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/20 text-slate-900 dark:text-white font-medium rounded-full transition-colors">
                Notify me when ready
            </button>
        </div>
    );
}

function InputGroup({
    label,
    defaultValue,
    type = "text",
    icon: Icon,
    disabled = false
}: {
    label: string;
    defaultValue: string;
    type?: string;
    icon?: any;
    disabled?: boolean;
}) {
    return (
        <div className="space-y-1.5">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                {label}
            </label>
            <div className="relative">
                <input
                    type={type}
                    defaultValue={defaultValue}
                    disabled={disabled}
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-900 dark:text-white text-sm disabled:opacity-50 disabled:cursor-not-allowed pl-10"
                />
                {Icon && (
                    <Icon className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
                )}
            </div>
        </div>
    );
}
