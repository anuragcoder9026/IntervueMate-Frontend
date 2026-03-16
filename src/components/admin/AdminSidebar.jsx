import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Plus, LayoutDashboard, Users, FileText, Calendar, Settings, ArrowLeft, MessagesSquare, FolderOpen } from 'lucide-react';

const AdminSidebar = ({ activeTab, setActiveTab, group }) => {
    const navigate = useNavigate();
    const { pendingEvents } = useSelector((state) => state.group);

    return (
        <div className="hidden lg:flex w-[250px] min-h-[calc(100vh-64px)] bg-[#131821] border-r border-border-primary flex-col sticky top-16 shrink-0 z-10 shadow-[4px_0_24px_rgba(0,0,0,0.1)]">
            {/* Top Group Identity */}
            <div className="p-6 pb-5 border-b border-border-primary/50 pointer-events-none">
                <div className="flex items-center gap-3 mb-5">
                    <div className="w-10 h-10 bg-bg-tertiary rounded border border-white/5 flex items-center justify-center shrink-0 overflow-hidden">
                        {group?.logo ? (
                            <img src={group.logo} className="w-full h-full object-cover" alt="Logo" />
                        ) : (
                            <Users size={20} className="text-accent-blue" />
                        )}
                    </div>
                    <div className="min-w-0">
                        <h2 className="text-[11px] font-bold text-white mb-0.5 tracking-wide truncate">{group?.name || 'Group Name'}</h2>
                        <p className="text-[9px] text-text-secondary uppercase tracking-[0.2em] font-medium">Admin Console</p>
                    </div>
                </div>
                <button className="w-full bg-accent-blue hover:bg-blue-600 text-white font-bold py-2 rounded-lg flex items-center justify-center gap-2 transition-colors text-xs pointer-events-auto shadow-md active:scale-95 shadow-accent-blue/20">
                    <Plus size={14} strokeWidth={3} /> Invite Member
                </button>
            </div>

            {/* Navigation Sections */}
            <div className="flex-1 overflow-y-auto w-full py-4 space-y-7">
                <div className="px-3">
                    <h3 className="text-[10px] uppercase font-bold text-text-secondary tracking-widest mb-3 px-3">Manage</h3>
                    <div className="space-y-1 w-full">
                        <button
                            onClick={() => setActiveTab('Overview')}
                            className={`w-full flex items-center gap-3 px-3 py-2 ${activeTab === 'Overview' ? 'bg-accent-blue/10 text-accent-blue' : 'text-text-secondary hover:bg-bg-primary hover:text-white'} rounded-lg font-bold text-xs transition-colors group`}
                        >
                            <LayoutDashboard size={16} /> Overview
                        </button>
                        <button
                            onClick={() => setActiveTab('Members')}
                            className={`w-full flex items-center justify-between px-3 py-2 ${activeTab === 'Members' ? 'bg-accent-blue/10 text-accent-blue' : 'text-text-secondary hover:bg-bg-primary hover:text-white'} rounded-lg font-medium text-xs transition-colors group`}
                        >
                            <div className="flex items-center gap-3">
                                <Users size={16} className={activeTab === 'Members' ? 'text-accent-blue' : 'group-hover:text-white'} /> Members
                            </div>
                            <span className={`bg-white/5 group-hover:bg-white/10 text-[9px] px-1.5 py-0.5 rounded ${activeTab === 'Members' ? 'text-accent-blue' : 'text-white/50'}`}>
                                {group?.members?.length || 0}
                            </span>
                        </button>
                        <button
                            onClick={() => setActiveTab('Content')}
                            className={`w-full flex items-center gap-3 px-3 py-2 ${activeTab === 'Content' ? 'bg-accent-blue/10 text-accent-blue' : 'text-text-secondary hover:bg-bg-primary hover:text-white'} rounded-lg font-medium text-xs transition-colors group`}
                        >
                            <FileText size={16} className={activeTab === 'Content' ? 'text-accent-blue' : 'group-hover:text-white'} /> Content
                        </button>
                        <button
                            onClick={() => setActiveTab('Discussion')}
                            className={`w-full flex items-center gap-3 px-3 py-2 ${activeTab === 'Discussion' ? 'bg-accent-blue/10 text-accent-blue' : 'text-text-secondary hover:bg-bg-primary hover:text-white'} rounded-lg font-medium text-xs transition-colors group`}
                        >
                            <MessagesSquare size={16} className={activeTab === 'Discussion' ? 'text-accent-blue' : 'group-hover:text-white'} /> Discussion
                        </button>
                        <button
                            onClick={() => setActiveTab('Resources')}
                            className={`w-full flex items-center gap-3 px-3 py-2 ${activeTab === 'Resources' ? 'bg-accent-blue/10 text-accent-blue' : 'text-text-secondary hover:bg-bg-primary hover:text-white'} rounded-lg font-medium text-xs transition-colors group`}
                        >
                            <FolderOpen size={16} className={activeTab === 'Resources' ? 'text-accent-blue' : 'group-hover:text-white'} /> Resources
                        </button>
                        <button
                            onClick={() => setActiveTab('Events')}
                            className={`w-full flex items-center justify-between px-3 py-2 ${activeTab === 'Events' ? 'bg-accent-blue/10 text-accent-blue' : 'text-text-secondary hover:bg-bg-primary hover:text-white'} rounded-lg font-medium text-xs transition-colors group`}
                        >
                            <div className="flex items-center gap-3">
                                <Calendar size={16} className={activeTab === 'Events' ? 'text-accent-blue' : 'group-hover:text-white'} /> Events
                            </div>
                            {pendingEvents.length > 0 && (
                                <span className="bg-red-500/20 text-red-500 font-bold text-[9px] w-5 h-5 flex items-center justify-center rounded-full">
                                    {pendingEvents.length}
                                </span>
                            )}
                        </button>
                    </div>
                </div>

                <div className="px-3">
                    <h3 className="text-[10px] uppercase font-bold text-text-secondary tracking-widest mb-3 px-3">Configuration</h3>
                    <div className="space-y-1">
                        <button
                            onClick={() => setActiveTab('Settings')}
                            className={`w-full flex items-center gap-3 px-3 py-2 ${activeTab === 'Settings' ? 'bg-accent-blue/10 text-accent-blue' : 'text-text-secondary hover:bg-bg-primary hover:text-white'} rounded-lg font-medium text-xs transition-colors group`}
                        >
                            <Settings size={16} className={activeTab === 'Settings' ? 'text-accent-blue' : 'group-hover:text-white'} /> Settings
                        </button>
                    </div>
                </div>
            </div>

            {/* Bottom Back Button */}
            <div className="p-4 border-t border-border-primary/50">
                <button
                    onClick={() => navigate(`/groups/${group?._id || group?.id}`)}
                    className="flex items-center gap-2 text-text-secondary hover:text-white text-[11px] font-bold transition-colors px-2 relative group w-full text-left"
                >
                    <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Back to Platform
                </button>
            </div>
        </div>
    );
};

export default AdminSidebar;
