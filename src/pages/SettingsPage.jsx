import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import {
    User,
    Lock,
    Brain,
    Bell,
    CreditCard,
    Palette,
    LogOut,
    Pencil,
    Mail,
    Phone,
    AtSign,
    ChevronDown
} from 'lucide-react';
import { Link } from 'react-router-dom';

const SettingsPage = () => {
    return (
        <div className="bg-bg-primary min-h-screen text-text-primary overflow-x-hidden flex flex-col">
            <Navbar />

            {/* Mobile Horizontal Navigation */}
            <div className="md:hidden sticky top-16 bg-bg-primary/95 backdrop-blur-xl z-20 border-b border-border-primary/50 overflow-x-auto no-scrollbar py-3 px-4 sm:px-6">
                <div className="flex items-center gap-2 min-w-max">
                    <SideNavItem icon={User} label="Account" isActive={true} />
                    <SideNavItem icon={Lock} label="Privacy & Security" />
                    <SideNavItem icon={Brain} label="AI Preferences" />
                    <SideNavItem icon={Bell} label="Notifications" />
                    <SideNavItem icon={CreditCard} label="Billing" />
                    <SideNavItem icon={Palette} label="Appearance" />
                </div>
            </div>

            {/* Mobile Logout Button Section */}
            <div className="md:hidden px-4 sm:px-6 pt-2 pb-4 border-b border-border-primary/50 bg-bg-primary/95 backdrop-blur-xl">
                <button
                    className="w-full flex items-center justify-between p-3.5 rounded-xl bg-red-500/5 border border-red-500/10 text-red-400 font-bold active:scale-[0.98] transition-all hover:bg-red-500/10 hover:border-red-500/20 shadow-sm shadow-red-500/5"
                >
                    <div className="flex items-center gap-3">
                        <LogOut size={18} />
                        <span className="text-sm">Sign Out</span>
                    </div>
                </button>
            </div>

            <div className="flex flex-1 w-full max-w-[1400px] mx-auto ml-0">
                {/* Sidebar */}
                <aside className="w-64 shrink-0 hidden md:flex flex-col py-8 px-4 pb-2 border-r border-border-primary/50 h-[calc(100vh-64px)] sticky top-16 overflow-y-auto">
                    <span className="text-[10px] uppercase font-black tracking-widest text-text-secondary mb-4 px-4">Settings</span>
                    <nav className="flex-1 space-y-1">
                        <SideNavItem icon={User} label="Account" isActive={true} />
                        <SideNavItem icon={Lock} label="Privacy & Security" />
                        <SideNavItem icon={Brain} label="AI Preferences" />
                        <SideNavItem icon={Bell} label="Notifications" />
                        <SideNavItem icon={CreditCard} label="Billing" />
                        <SideNavItem icon={Palette} label="Appearance" />
                    </nav>
                    <div className="pt-0">
                        <SideNavItem icon={LogOut} label="Sign Out" isSignOut={true} />
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1 py-10 px-5 sm:px-10 lg:px-16 max-w-[900px]">
                    <div className="mb-10">
                        <h1 className="text-3xl font-black text-white mb-2 tracking-tight">Account Settings</h1>
                        <p className="text-text-secondary text-sm">Manage your profile details and personal preferences.</p>
                    </div>

                    <div className="space-y-8">
                        {/* Public Profile Card */}
                        <div className="bg-bg-secondary border border-border-primary rounded-2xl p-4 sm:p-8 shadow-sm">
                            <h2 className="text-lg font-bold text-white mb-1">Public Profile</h2>
                            <p className="text-xs text-text-secondary mb-6">This information will be displayed on your public profile.</p>

                            <div className="flex flex-col sm:flex-row items-start gap-8">
                                {/* Avatar */}
                                <div className="relative shrink-0">
                                    <img
                                        src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
                                        alt="Avatar"
                                        className="w-24 h-24 rounded-full border-2 border-border-primary object-cover"
                                    />
                                    <button className="absolute bottom-0 right-0 p-1.5 bg-accent-blue rounded-full border-2 border-bg-secondary text-white hover:bg-blue-600 transition-colors">
                                        <Pencil size={12} />
                                    </button>
                                </div>

                                {/* Form Fields */}
                                <div className="flex-1 w-full space-y-5">
                                    <div className="flex flex-col sm:flex-row gap-5">
                                        <div className="flex-1">
                                            <label className="block text-xs font-bold text-white mb-2">Full Name</label>
                                            <input
                                                type="text"
                                                defaultValue="Alex Morgan"
                                                className="w-full bg-[#0A0F1A] border border-border-primary rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-accent-blue focus:ring-1 focus:ring-accent-blue transition-all"
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <label className="block text-xs font-bold text-white mb-2">Display Name</label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                                    <AtSign size={14} className="text-text-secondary" />
                                                </div>
                                                <input
                                                    type="text"
                                                    defaultValue="alex_m"
                                                    className="w-full bg-[#0A0F1A] border border-border-primary rounded-xl pl-9 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-accent-blue focus:ring-1 focus:ring-accent-blue transition-all"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-white mb-2">Bio</label>
                                        <textarea
                                            rows="3"
                                            defaultValue="Product Designer seeking new opportunities. Passionate about AI and accessibility."
                                            className="w-full bg-[#0A0F1A] border border-border-primary rounded-xl px-4 py-3 text-sm text-white resize-none focus:outline-none focus:border-accent-blue focus:ring-1 focus:ring-accent-blue transition-all leading-relaxed"
                                        />
                                        <div className="text-right mt-1.5">
                                            <span className="text-[10px] font-bold text-text-secondary">0 / 160</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Personal Information Card */}
                        <div className="bg-bg-secondary border border-border-primary rounded-2xl p-8 shadow-sm">
                            <h2 className="text-lg font-bold text-white mb-6">Personal Information</h2>

                            <div className="space-y-5">
                                <div className="flex flex-col sm:flex-row gap-5">
                                    <div className="flex-1">
                                        <label className="block text-xs font-bold text-white mb-2">Email Address</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                                <Mail size={14} className="text-text-secondary" />
                                            </div>
                                            <input
                                                type="email"
                                                defaultValue="alex.morgan@example.com"
                                                className="w-full bg-[#0A0F1A] border border-border-primary rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-accent-blue focus:ring-1 focus:ring-accent-blue transition-all"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex-1">
                                        <label className="block text-xs font-bold text-white mb-2">Phone Number</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                                <Phone size={14} className="text-text-secondary" />
                                            </div>
                                            <input
                                                type="text"
                                                defaultValue="+1 (555) 000-0000"
                                                className="w-full bg-[#0A0F1A] border border-border-primary rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-accent-blue focus:ring-1 focus:ring-accent-blue transition-all"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-5">
                                    <div className="flex-1">
                                        <label className="block text-xs font-bold text-white mb-2">Country</label>
                                        <div className="relative">
                                            <select className="w-full bg-[#0A0F1A] border border-border-primary rounded-xl px-4 py-2.5 text-sm text-white appearance-none focus:outline-none focus:border-accent-blue focus:ring-1 focus:ring-accent-blue transition-all cursor-pointer">
                                                <option>United States</option>
                                                <option>United Kingdom</option>
                                                <option>Canada</option>
                                                <option>Australia</option>
                                            </select>
                                            <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none">
                                                <ChevronDown size={14} className="text-text-secondary" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex-1">
                                        <label className="block text-xs font-bold text-white mb-2">Timezone</label>
                                        <div className="relative">
                                            <select className="w-full bg-[#0A0F1A] border border-border-primary rounded-xl px-4 py-2.5 text-sm text-white appearance-none focus:outline-none focus:border-accent-blue focus:ring-1 focus:ring-accent-blue transition-all cursor-pointer">
                                                <option>Pacific Time (PT)</option>
                                                <option>Eastern Time (ET)</option>
                                                <option>Central Time (CT)</option>
                                                <option>Greenwich Mean Time (GMT)</option>
                                            </select>
                                            <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none">
                                                <ChevronDown size={14} className="text-text-secondary" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Appearance Card */}
                        <div className="bg-bg-secondary border border-border-primary rounded-2xl p-8 shadow-sm">
                            <div className="flex items-center gap-2 mb-6">
                                <Palette size={18} className="text-purple-500" />
                                <h2 className="text-lg font-bold text-white">Appearance</h2>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <label className="block text-xs font-bold text-white mb-3">Interface Theme</label>
                                    <div className="grid grid-cols-3 gap-4">
                                        {/* System */}
                                        <div className="bg-[#0A0F1A] border border-border-primary rounded-xl p-2 cursor-pointer hover:border-white/20 transition-all flex flex-col items-center">
                                            <div className="w-full h-16 bg-bg-secondary rounded-lg border border-border-primary mb-2"></div>
                                            <span className="text-[10px] font-bold text-text-secondary">System</span>
                                        </div>
                                        {/* Light */}
                                        <div className="bg-[#0A0F1A] border border-border-primary rounded-xl p-2 cursor-pointer hover:border-white/20 transition-all flex flex-col items-center">
                                            <div className="w-full h-16 bg-white rounded-lg border border-gray-200 mb-2"></div>
                                            <span className="text-[10px] font-bold text-text-secondary">Light</span>
                                        </div>
                                        {/* Dark (Active) */}
                                        <div className="bg-[#0A0F1A] border border-accent-blue rounded-xl p-2 cursor-pointer relative flex flex-col items-center">
                                            <div className="w-full h-16 bg-[#161f31] rounded-lg border border-border-primary mb-2"></div>
                                            <span className="text-[10px] font-bold text-white">Dark</span>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-white mb-3">Accent Color</label>
                                    <div className="flex gap-3">
                                        {/* Blue (Active) */}
                                        <button className="w-8 h-8 rounded-full bg-blue-500 ring-2 ring-white ring-offset-2 ring-offset-bg-secondary"></button>
                                        <button className="w-8 h-8 rounded-full bg-purple-500 border border-white/10 hover:border-white/30 transition-colors"></button>
                                        <button className="w-8 h-8 rounded-full bg-emerald-500 border border-white/10 hover:border-white/30 transition-colors"></button>
                                        <button className="w-8 h-8 rounded-full bg-red-500 border border-white/10 hover:border-white/30 transition-colors"></button>
                                        <button className="w-8 h-8 rounded-full bg-orange-500 border border-white/10 hover:border-white/30 transition-colors"></button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Privacy & Notifications Card */}
                        <div className="bg-bg-secondary border border-border-primary rounded-2xl p-8 shadow-sm">
                            <h2 className="text-lg font-bold text-white mb-6">Privacy & Notifications</h2>

                            <div className="space-y-6">
                                <ToggleRow
                                    title="Profile Visibility"
                                    desc="Allow others to find your profile in the community search."
                                    checked={true}
                                />
                                <ToggleRow
                                    title="Email Notifications"
                                    desc="Receive emails about new mock interview results."
                                    checked={true}
                                />
                                <ToggleRow
                                    title="AI Data Usage"
                                    desc="Allow AI to use your interview data to improve model accuracy."
                                    checked={false}
                                />
                            </div>
                        </div>

                        {/* Danger Zone Card */}
                        <div className="bg-red-500/5 border border-red-500/20 rounded-2xl p-8">
                            <h2 className="text-lg font-bold text-red-500 mb-2">Danger Zone</h2>
                            <p className="text-xs text-text-secondary mb-6">Once you delete your account, there is no going back. Please be certain.</p>

                            <div className="flex items-center justify-between border-t border-red-500/10 pt-6">
                                <div>
                                    <h3 className="text-sm font-bold text-white mb-1">Delete Account</h3>
                                    <p className="text-[11px] text-text-secondary">Permanently remove your account and all associated data.</p>
                                </div>
                                <button className="px-4 py-2 bg-transparent border border-red-500/20 hover:bg-red-500/10 text-red-500 text-xs font-bold rounded-lg transition-colors">
                                    Delete Account
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Actions */}
                    <div className="mt-10 flex items-center justify-end gap-3 pb-20 md:pb-10">
                        <button className="px-5 py-2.5 rounded-xl border border-border-primary hover:bg-bg-tertiary text-white text-sm font-bold transition-all">
                            Cancel
                        </button>
                        <button className="px-5 py-2.5 rounded-xl bg-accent-blue hover:bg-blue-600 text-white text-sm font-bold transition-all shadow-lg shadow-accent-blue/20">
                            Save Changes
                        </button>
                    </div>
                </main>
            </div>
        </div>
    );
};

const SideNavItem = ({ icon: Icon, label, isActive, isSignOut }) => {
    return (
        <a
            href="#"
            className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap shrink-0 ${isActive
                ? 'bg-accent-blue/10 text-accent-blue shadow-sm shadow-accent-blue/5'
                : isSignOut
                    ? 'text-red-400/70 hover:text-red-400 hover:bg-red-400/5 mt-6 border-t border-border-primary/50 pt-4 rounded-none w-full active:scale-[0.98]'
                    : 'text-text-secondary hover:text-white hover:bg-white/5 active:scale-95'
                }`}
        >
            <Icon size={16} className={`${isActive ? 'text-accent-blue' : isSignOut ? 'text-red-400/70' : 'text-text-secondary'} shrink-0`} />
            <span>{label}</span>
        </a>
    );
};

const ToggleRow = ({ title, desc, checked }) => {
    return (
        <div className="flex items-start justify-between gap-4">
            <div>
                <h3 className="text-sm font-bold text-white mb-1">{title}</h3>
                <p className="text-xs text-text-secondary leading-relaxed">{desc}</p>
            </div>
            {checked ? (
                <div className="w-[38px] h-5 bg-accent-blue rounded-full relative flex items-center pr-0.5 shrink-0 cursor-pointer shadow-[0_0_8px_rgba(37,99,235,0.4)]">
                    <div className="w-4 h-4 bg-white rounded-full ml-auto shadow-sm"></div>
                </div>
            ) : (
                <div className="w-[38px] h-5 bg-border-primary rounded-full relative flex items-center pl-0.5 shrink-0 cursor-pointer">
                    <div className="w-4 h-4 bg-white rounded-full shadow-sm"></div>
                </div>
            )}
        </div>
    );
};

export default SettingsPage;
