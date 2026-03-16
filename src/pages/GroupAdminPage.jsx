import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getGroup, createGroupPost, getGroupPosts, getGroupMembers, getRecentGroupMembers, getGroupJoinRequests, removeGroupMember, getPendingEvents, approveEvent, rejectEvent } from '../store/groupSlice';

import Navbar from '../components/Navbar';
import AdminSidebar from '../components/admin/AdminSidebar';
import AdminStatCard from '../components/admin/AdminStatCard';
import AdminGrowthChart from '../components/admin/AdminGrowthChart';
import AdminPendingRequests from '../components/admin/AdminPendingRequests';
import AdminRecentMembers from '../components/admin/AdminRecentMembers';
import CreatePostModal from '../components/feed/CreatePostModal';
import AdminPostCard from '../components/admin/AdminPostCard';
import ConnectionRow from '../components/friends/ConnectionRow';
import { ChevronRight, Users, MessageSquare, Calendar, UserPlus, AlertTriangle, Plus, LayoutDashboard, FileText, Settings, Search, Shield, UserCheck, Sparkles, Globe, EyeOff, MoreHorizontal, Trash2, MessagesSquare, FolderOpen, Briefcase, Bot } from 'lucide-react';

import { toast } from 'react-toastify';
import GroupDiscussionComponent from '../components/groups/discussion/GroupDiscussionComponent';
import GroupResourcesPage from './GroupResourcesPage';

const GroupAdminPage = ({ activeTabProp }) => {
    const { id, tab } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { currentGroup, isLoading, groupPosts, isPostsLoading, isCreating, groupAdmins, groupMembers, recentMembers, isMembersLoading, joinRequests, pendingEvents, isEventsLoading } = useSelector((state) => state.group);
    const { user } = useSelector((state) => state.auth);

    // Derive active tab from URL or prop
    const activeTab = tab ? (tab.charAt(0).toUpperCase() + tab.slice(1).toLowerCase()) : (activeTabProp || 'Overview');

    const setActiveTab = (newTab) => {
        navigate(`/admin/groups/${id}/${newTab.toLowerCase()}`);
    };
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [memberSearch, setMemberSearch] = useState('');

    // Member Directory Action states
    const [openMenuId, setOpenMenuId] = useState(null);
    const [memberToRemove, setMemberToRemove] = useState(null);
    const [memberToWarn, setMemberToWarn] = useState(null);
    const [removeReason, setRemoveReason] = useState('');
    const [isRemovingMember, setIsRemovingMember] = useState(false);
    const adminMenuRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (activeTab === 'Members' && adminMenuRef.current && !adminMenuRef.current.contains(event.target)) {
                setOpenMenuId(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [activeTab]);

    const handleSendWarning = () => {
        if (!memberToWarn) return;
        toast.success(`Warning notification sent to ${memberToWarn.name}`);
        setMemberToWarn(null);
    };

    const handleRemoveMember = async () => {
        if (!memberToRemove) return;
        setIsRemovingMember(true);
        try {
            await dispatch(removeGroupMember({ groupId: id, userId: memberToRemove._id })).unwrap();
            toast.success("Member removed successfully");
            setMemberToRemove(null);
            setRemoveReason('');
        } catch (err) {
            toast.error(err || "Failed to remove member");
        } finally {
            setIsRemovingMember(false);
        }
    };

    const renderActionButtons = (member) => {
        // Prevent removing self
        if (member._id === user?._id || member._id === user?.id) return null;

        return (
            <div className="relative" ref={openMenuId === member._id ? adminMenuRef : null}>
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        setOpenMenuId(openMenuId === member._id ? null : member._id);
                    }}
                    className="p-1.5 text-text-secondary hover:text-white hover:bg-bg-tertiary rounded-lg transition-colors shrink-0"
                >
                    <MoreHorizontal size={18} />
                </button>
                {openMenuId === member._id && (
                    <div className="absolute right-0 top-full mt-1 w-48 bg-bg-secondary border border-border-primary shadow-[0_10px_40px_rgba(0,0,0,0.5)] rounded-xl p-1 z-[100] animate-in fade-in zoom-in-95">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setMemberToWarn(member);
                                setOpenMenuId(null);
                            }}
                            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-yellow-500 hover:bg-yellow-500/10 rounded-lg transition-colors"
                        >
                            <AlertTriangle size={14} />
                            <span>Send Warning</span>
                        </button>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setMemberToRemove(member);
                                setOpenMenuId(null);
                            }}
                            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                        >
                            <Trash2 size={14} />
                            <span>Remove Member</span>
                        </button>
                    </div>
                )}
            </div>
        );
    };

    useEffect(() => {
        if (id) {
            dispatch(getGroup(id));
            dispatch(getGroupPosts(id));
            dispatch(getGroupMembers(id));
            dispatch(getRecentGroupMembers(id));
            dispatch(getGroupJoinRequests(id));
            dispatch(getPendingEvents(id));
        }
    }, [dispatch, id]);

    const handleApproveEvent = async (eventId) => {
        try {
            await dispatch(approveEvent(eventId)).unwrap();
            toast.success("Event approved and scheduled!");
        } catch (err) {
            toast.error(err || "Failed to approve event");
        }
    };

    const handleRejectEvent = async (eventId) => {
        try {
            await dispatch(rejectEvent(eventId)).unwrap();
            toast.success("Event rejected successfully");
        } catch (err) {
            toast.error(err || "Failed to reject event");
        }
    };


    const handleCreatePost = async (content, attachments = [], tags = [], audience = null) => {
        const formData = new FormData();
        formData.append('content', content);

        if (tags.length > 0) {
            formData.append('tags', JSON.stringify(tags));
        }

        // Separate file attachments from link attachments
        const links = [];
        if (attachments.length > 0) {
            attachments.forEach((att) => {
                if (att.type === 'link') {
                    links.push({ url: att.url, title: att.url.split('//').pop().split('/')[0] });
                } else if (att.file) {
                    formData.append('files', att.file);
                }
            });
        }
        if (links.length > 0) {
            formData.append('links', JSON.stringify(links));
        }

        try {
            await dispatch(createGroupPost({ groupId: id, formData })).unwrap();
            setIsModalOpen(false);
        } catch (err) {
            setIsModalOpen(false);
        }
    };

    const isAdmin = currentGroup?.admins?.some(adminId =>
        adminId === user?._id || adminId === user?.id ||
        (typeof adminId === 'object' && adminId._id === user?._id)
    );

    useEffect(() => {
        if (!isLoading && currentGroup && !isAdmin) {
            navigate(`/groups/${id}`, { replace: true });
        }
    }, [isLoading, currentGroup, isAdmin, navigate, id]);

    // Show spinner until admin status is confirmed
    if (isLoading || !currentGroup || !isAdmin) {
        // If done loading and no group found, show not found
        if (!isLoading && !currentGroup) {
            return (
                <div className="bg-[#131821] min-h-screen text-white flex flex-col items-center justify-center">
                    <h1 className="text-xl font-bold mb-4">Group Not Found</h1>
                    <button onClick={() => navigate(`/feed`)} className="text-accent-blue font-bold text-sm uppercase tracking-widest">Go Back</button>
                </div>
            );
        }
        // Otherwise show loading (covers: fetching data, or redirect in progress)
        return (
            <div className="bg-[#131821] min-h-screen flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-accent-blue border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="bg-[#131821] min-h-screen text-text-primary overflow-x-hidden flex flex-col font-inter">
            <Navbar />

            <div className="flex flex-1 w-full max-w-full mx-auto ml-0">
                <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} group={currentGroup} />

                <main className="flex-1 px-3 py-8 mb-20 md:px-10 md:py-8 lg:p-10 overflow-y-auto w-full">
                    <div className="w-full">
                        {/* Breadcrumbs */}
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-2 text-[10px] sm:text-[11px] font-bold text-text-secondary tracking-wide">
                                <span onClick={() => navigate('/groups')} className="hover:text-white cursor-pointer transition-colors">Groups</span>
                                <ChevronRight size={12} strokeWidth={3} className="text-white/20" />
                                <span onClick={() => navigate(`/groups/${id}`)} className="hover:text-white cursor-pointer transition-colors truncate max-w-[150px] sm:max-w-[300px]">
                                    {currentGroup.name}
                                </span>
                                <ChevronRight size={12} strokeWidth={3} className="text-white/20" />
                                <span className="text-white">Admin Panel</span>
                            </div>
                            <button
                                onClick={() => setIsModalOpen(true)}
                                className=" px-3 md:px-5 py-1.5 ml-2 md:ml-0 md:py-2.5 bg-accent-blue hover:bg-blue-600 text-white rounded-xl font-bold text-xs transition-all flex items-center gap-2 shadow-lg active:scale-95"
                            >
                                <Plus size={16} strokeWidth={3} />
                                Admin Post
                            </button>
                        </div>

                        {/* Mobile/Tablet Admin Header (Horizontal) */}
                        <div className="lg:hidden mb-8 space-y-4">
                            {/* Logo, Group Name, Invite */}
                            <div className="flex items-center justify-between gap-4 bg-bg-secondary p-4 rounded-xl border border-border-primary shadow-sm">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-bg-tertiary rounded border border-white/5 flex items-center justify-center shrink-0 overflow-hidden">
                                        {currentGroup.logo ? (
                                            <img src={currentGroup.logo} className="w-full h-full object-cover" alt="Logo" />
                                        ) : (
                                            <Users size={20} className="text-accent-blue" />
                                        )}
                                    </div>
                                    <div className="min-w-0">
                                        <h2 className="text-sm font-bold text-white mb-0.5 tracking-wide truncate">{currentGroup.name}</h2>
                                        <p className="text-[10px] text-text-secondary uppercase tracking-[0.2em] font-medium">Admin Console</p>
                                    </div>
                                </div>
                                <button className="bg-accent-blue hover:bg-blue-600 text-white font-bold py-2 px-3 sm:px-4 rounded-lg flex items-center justify-center gap-2 transition-colors text-xs shadow-md shadow-accent-blue/20 active:scale-95">
                                    <Plus size={14} strokeWidth={3} /> <span className="hidden sm:inline">Invite Member</span>
                                    <span className="sm:hidden">Invite</span>
                                </button>
                            </div>

                            {/* Horizontal scrollable tabs */}
                            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2">
                                <button
                                    onClick={() => setActiveTab('Overview')}
                                    className={`shrink-0 flex items-center gap-2 px-4 py-2 ${activeTab === 'Overview' ? 'bg-accent-blue/10 text-accent-blue' : 'text-text-secondary hover:bg-bg-primary hover:text-white'} rounded-lg font-bold text-xs transition-colors`}
                                >
                                    <LayoutDashboard size={14} /> Overview
                                </button>
                                <button
                                    onClick={() => setActiveTab('Members')}
                                    className={`shrink-0 flex items-center gap-2 px-4 py-2 ${activeTab === 'Members' ? 'bg-accent-blue/10 text-accent-blue' : 'text-text-secondary hover:bg-bg-primary hover:text-white'} rounded-lg font-medium text-xs transition-colors`}
                                >
                                    <Users size={14} /> Members
                                    <span className="bg-white/10 text-[9px] px-1.5 py-0.5 rounded text-white/70 ml-1">
                                        {currentGroup.members?.length || 0}
                                    </span>
                                </button>
                                <button
                                    onClick={() => setActiveTab('Content')}
                                    className={`shrink-0 flex items-center gap-2 px-4 py-2 ${activeTab === 'Content' ? 'bg-accent-blue/10 text-accent-blue' : 'text-text-secondary hover:bg-bg-primary hover:text-white'} rounded-lg font-medium text-xs transition-colors`}
                                >
                                    <FileText size={14} /> Content
                                </button>
                                <button
                                    onClick={() => setActiveTab('Discussion')}
                                    className={`shrink-0 flex items-center gap-2 px-4 py-2 ${activeTab === 'Discussion' ? 'bg-accent-blue/10 text-accent-blue' : 'text-text-secondary hover:bg-bg-primary hover:text-white'} rounded-lg font-medium text-xs transition-colors`}
                                >
                                    <MessagesSquare size={14} /> Discussion
                                </button>
                                <button
                                    onClick={() => setActiveTab('Resources')}
                                    className={`shrink-0 flex items-center gap-2 px-4 py-2 ${activeTab === 'Resources' ? 'bg-accent-blue/10 text-accent-blue' : 'text-text-secondary hover:bg-bg-primary hover:text-white'} rounded-lg font-medium text-xs transition-colors`}
                                >
                                    <FolderOpen size={14} /> Resources
                                </button>
                                <button
                                    onClick={() => setActiveTab('Events')}
                                    className={`shrink-0 flex items-center gap-2 px-4 py-2 ${activeTab === 'Events' ? 'bg-accent-blue/10 text-accent-blue' : 'text-text-secondary hover:bg-bg-primary hover:text-white'} rounded-lg font-medium text-xs transition-colors`}
                                >
                                    <Calendar size={14} /> Events
                                    {pendingEvents.length > 0 && (
                                        <span className="bg-red-500/20 text-red-500 font-bold text-[9px] w-4 h-4 flex items-center justify-center rounded-full ml-1">
                                            {pendingEvents.length}
                                        </span>
                                    )}
                                </button>
                                <div className="w-px h-6 bg-border-primary/50 shrink-0 mx-1"></div>
                                <button
                                    onClick={() => setActiveTab('Settings')}
                                    className={`shrink-0 flex items-center gap-2 px-4 py-2 ${activeTab === 'Settings' ? 'bg-accent-blue/10 text-accent-blue' : 'text-text-secondary hover:bg-bg-primary hover:text-white'} rounded-lg font-medium text-xs transition-colors`}
                                >
                                    <Settings size={14} /> Settings
                                </button>
                            </div>
                        </div>


                        {activeTab === 'Overview' && (
                            <>
                                <h1 className="text-2xl sm:text-3xl font-black text-white mb-8 tracking-tight">Group Overview</h1>

                                {/* Stats Grid */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8 w-full">
                                    <AdminStatCard title="Total Members" value="1,240" trend="12%" icon={Users} />
                                    <AdminStatCard title="Active Discussions" value="86" trend="5%" icon={MessageSquare} />
                                    <AdminStatCard title="Scheduled Events" value="12" trend="0%" isTrendingDown icon={Calendar} />
                                    {currentGroup.privacy === 'private' && (
                                        <AdminStatCard title="Pending Requests" value={joinRequests.length.toString()} trend="Action" isAction icon={UserPlus} />
                                    )}
                                </div>

                                {/* Middle Section: Chart & Pending List */}
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8 w-full h-auto lg:min-h-[350px]">
                                    <div className="lg:col-span-2">
                                        <AdminGrowthChart />
                                    </div>
                                    {currentGroup.privacy === 'private' && (
                                        <div className="lg:col-span-1">
                                            <AdminPendingRequests requests={joinRequests} />
                                        </div>
                                    )}
                                </div>

                                {/* Recent Members Table */}
                                <div className="w-full mb-10">
                                    <AdminRecentMembers members={recentMembers} />
                                </div>

                                {/* Danger Zone */}
                                <div className="bg-[#1c2230]/50 border border-red-500/20 rounded-xl p-6 sm:p-8 w-full shadow-sm relative overflow-hidden group">
                                    <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-red-500/10 blur-3xl rounded-full pointer-events-none group-hover:bg-red-500/20 transition-colors"></div>
                                    <h4 className="flex items-center gap-2 text-red-500 font-bold text-sm mb-4">
                                        <AlertTriangle size={18} strokeWidth={3} /> Danger Zone
                                    </h4>
                                    <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                                        <div>
                                            <h5 className="text-white font-bold text-sm tracking-tight">Delete this group</h5>
                                            <p className="text-[11px] text-text-secondary mt-1 font-medium">Once you delete a group, there is no going back. Please be certain.</p>
                                        </div>
                                        <button className="shrink-0 bg-red-600 hover:bg-red-700 text-white font-bold text-xs py-2.5 px-6 rounded-lg transition-all active:scale-95 shadow-lg shadow-red-500/20">
                                            Delete Group
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}

                        {activeTab === 'Members' && (
                            <div className="space-y-6">
                                <div className="bg-bg-secondary border border-border-primary rounded-2xl p-6 shadow-sm">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                                        <div>
                                            <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                                                <Users size={24} className="text-accent-blue" />
                                                Manage Members
                                            </h2>
                                            <p className="text-xs text-text-secondary mt-1">Manage {currentGroup.members?.length || 0} community members and moderators</p>
                                        </div>
                                    </div>

                                    {/* Search */}
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                                            <Search size={18} className="text-text-secondary group-focus-within:text-accent-blue transition-colors" />
                                        </div>
                                        <input
                                            type="text"
                                            placeholder="Search members by name or headline..."
                                            value={memberSearch}
                                            onChange={(e) => setMemberSearch(e.target.value)}
                                            className="w-full bg-bg-primary border border-border-primary rounded-xl py-3.5 pl-12 pr-6 text-sm focus:outline-none focus:border-accent-blue/50 transition-all font-medium text-white shadow-inner"
                                        />
                                    </div>
                                </div>

                                {isMembersLoading ? (
                                    <div className="flex justify-center py-12">
                                        <div className="w-8 h-8 border-4 border-white/10 border-t-accent-blue rounded-full animate-spin"></div>
                                    </div>
                                ) : (
                                    <div className="space-y-6">
                                        {/* Admins Section */}
                                        <section>
                                            <h3 className="text-[10px] font-black uppercase text-text-secondary tracking-widest mb-4 px-1 flex items-center gap-2">
                                                <Shield size={12} className="text-amber-500" /> Admins ({groupAdmins.length})
                                            </h3>
                                            <div className="bg-bg-secondary border border-border-primary rounded-2xl p-4 space-y-2">
                                                {groupAdmins.filter(a =>
                                                    a.name?.toLowerCase().includes(memberSearch.toLowerCase()) ||
                                                    a.headline?.toLowerCase().includes(memberSearch.toLowerCase())
                                                ).map((admin) => (
                                                    <div key={admin._id} className="relative">
                                                        <ConnectionRow
                                                            key={admin._id}
                                                            userId={admin._id}
                                                            profileId={admin.userId}
                                                            name={admin.name}
                                                            headline={admin.headline}
                                                            university={admin.education}
                                                            image={admin.avatar}
                                                            connectedDate={admin.joinedAt ? new Date(admin.joinedAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : new Date(admin.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                                                            actionButtons={renderActionButtons(admin)}
                                                            showActionsForSelf={false}
                                                        />

                                                    </div>
                                                ))}
                                                {groupAdmins.length === 0 && (
                                                    <p className="text-xs text-text-secondary text-center py-4">No admins found</p>
                                                )}
                                            </div>
                                        </section>

                                        {/* Members Section */}
                                        <section>
                                            <h3 className="text-[10px] font-black uppercase text-text-secondary tracking-widest mb-4 px-1 flex items-center gap-2">
                                                <UserCheck size={12} className="text-accent-blue" /> Member Directory ({groupMembers.length})
                                            </h3>
                                            <div className="bg-bg-secondary border border-border-primary rounded-2xl p-4 space-y-2">
                                                {groupMembers.filter(m =>
                                                    m.name?.toLowerCase().includes(memberSearch.toLowerCase()) ||
                                                    m.headline?.toLowerCase().includes(memberSearch.toLowerCase())
                                                ).map((member) => (
                                                    <ConnectionRow
                                                        key={member._id}
                                                        userId={member._id}
                                                        profileId={member.userId}
                                                        name={member.name}
                                                        headline={member.headline}
                                                        university={member.education}
                                                        image={member.avatar}
                                                        connectedDate={member.joinedAt ? new Date(member.joinedAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : new Date(member.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                                                        actionButtons={renderActionButtons(member)}
                                                        showActionsForSelf={false}
                                                    />
                                                ))}
                                                {groupMembers.length === 0 && (
                                                    <div className="text-center py-8 text-text-secondary text-sm font-medium">
                                                        <Users size={28} className="mx-auto mb-3 opacity-30" />
                                                        No members yet. Invite people to grow your community!
                                                    </div>
                                                )}
                                            </div>
                                        </section>
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'Content' && (
                            <div className="space-y-6 max-w-2xl">
                                <div className="bg-bg-secondary border border-border-primary rounded-xl p-5 shadow-sm">
                                    <div className="flex gap-4">
                                        <div className="w-10 h-10 rounded-full bg-accent-blue flex items-center justify-center text-white font-bold">A</div>
                                        <div className="flex-1 relative flex items-center" onClick={() => setIsModalOpen(true)}>
                                            <input
                                                type="text"
                                                readOnly
                                                placeholder="Post an official admin announcement..."
                                                className="w-full bg-bg-primary text-text-primary text-sm font-medium px-5 py-3.5 rounded-full border border-border-primary hover:border-accent-blue/50 focus:outline-none cursor-text transition-all pr-10"
                                            />
                                            <Sparkles size={16} className="absolute right-4 text-accent-blue opacity-50" />
                                        </div>
                                    </div>
                                </div>

                                {isPostsLoading ? (
                                    <div className="flex justify-center py-12">
                                        <div className="w-8 h-8 border-4 border-white/10 border-t-accent-blue rounded-full animate-spin"></div>
                                    </div>
                                ) : groupPosts.length > 0 ? (
                                    <div className="space-y-4">
                                        {groupPosts.map(post => (
                                            <AdminPostCard key={post._id} {...post} onDeleteSuccess={() => dispatch(getGroupPosts(id))} />
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-12 text-text-secondary text-sm font-medium">
                                        <FileText size={32} className="mx-auto mb-3 opacity-30" />
                                        No posts yet. Create your first admin announcement!
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'Discussion' && (
                            <div className="w-full">
                                <h1 className="text-2xl sm:text-3xl font-black text-white mb-6 tracking-tight">Manage Discussions</h1>
                                <GroupDiscussionComponent isAdminMode={true} />
                            </div>
                        )}

                        {activeTab === 'Resources' && (
                            <div className="w-full">
                                <h1 className="text-2xl sm:text-3xl font-black text-white mb-6 tracking-tight">Manage Resources</h1>
                                <GroupResourcesPage isAdminMode={true} />
                            </div>
                        )}

                        {activeTab === 'Events' && (
                            <div className="space-y-6">
                                <div className="bg-bg-secondary border border-border-primary rounded-2xl p-6 shadow-sm mb-6">
                                    <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                                        <Calendar size={24} className="text-accent-blue" />
                                        Session Requests
                                    </h2>
                                    <p className="text-xs text-text-secondary mt-1">Review and approve sessions scheduled for your group</p>
                                </div>

                                {isEventsLoading ? (
                                    <div className="flex justify-center py-12">
                                        <div className="w-8 h-8 border-4 border-white/10 border-t-accent-blue rounded-full animate-spin"></div>
                                    </div>
                                ) : pendingEvents.length > 0 ? (
                                    <div className="space-y-4">
                                        {pendingEvents.map((evt) => (
                                            <div key={evt._id} className="bg-bg-secondary border border-border-primary rounded-2xl p-5 hover:border-white/10 transition-all group">
                                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                                    <div className="flex gap-4">
                                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                                                            evt.theme === 'emerald' ? 'bg-emerald-500/10 text-emerald-500' :
                                                            evt.theme === 'purple' ? 'bg-purple-500/10 text-purple-500' :
                                                            'bg-blue-500/10 text-blue-500'
                                                        }`}>
                                                            {evt.theme === 'blue' ? <Globe size={24} /> : (evt.theme === 'emerald' ? <Briefcase size={24} /> : <Bot size={24} />)}
                                                        </div>
                                                        <div className="min-w-0">
                                                            <div className="flex items-center gap-2 mb-1">
                                                                <h3 className="text-white font-bold text-[15px] group-hover:text-accent-blue transition-colors truncate">{evt.title}</h3>
                                                                <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded bg-white/5 text-text-secondary border border-white/5">
                                                                    {evt.type}
                                                                </span>
                                                            </div>
                                                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                                                                <div className="flex items-center gap-1.5 text-xs text-text-secondary font-medium">
                                                                    <Calendar size={12} />
                                                                    <span>{new Date(evt.date).toLocaleDateString()} at {evt.time}</span>
                                                                </div>

                                                                <div className="flex items-center gap-1.5 text-xs text-text-secondary font-medium lowercase">
                                                                    <div className="w-4 h-4 rounded-full bg-bg-tertiary flex items-center justify-center overflow-hidden">
                                                                        {evt.creator?.avatar ? <img src={evt.creator.avatar} className="w-full h-full object-cover" /> : <div className="text-[8px] uppercase">{evt.creator?.name?.[0]}</div>}
                                                                    </div>
                                                                    <span>Hosted by <span className="text-white">{evt.creator?.name}</span></span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <button 
                                                            onClick={() => handleApproveEvent(evt._id)}
                                                            className="flex-1 md:flex-none bg-accent-blue hover:bg-blue-600 text-white font-bold text-xs py-2 px-6 rounded-xl transition-all active:scale-95 shadow-lg shadow-accent-blue/10"
                                                        >
                                                            Approve Session
                                                        </button>
                                                        <button 
                                                            onClick={() => handleRejectEvent(evt._id)}
                                                            className="p-2 text-text-secondary hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
                                                        >
                                                            <Trash2 size={18} />
                                                        </button>

                                                    </div>
                                                </div>
                                                {evt.desc && (
                                                    <div className="mt-4 pt-4 border-t border-white/5 text-[13px] text-text-secondary leading-relaxed">
                                                        {evt.desc}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center py-20 bg-bg-secondary/50 rounded-3xl border border-dashed border-white/5 mx-auto max-w-lg">
                                        <div className="w-16 h-16 bg-bg-tertiary rounded-2xl flex items-center justify-center mb-4 text-white/20">
                                            <Calendar size={32} />
                                        </div>
                                        <h3 className="text-white font-bold mb-1">No Pending Requests</h3>
                                        <p className="text-text-secondary text-xs text-center max-w-[240px]">Any internal sessions created for this group will appear here for your approval.</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </main>
            </div >

            <CreatePostModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onPost={handleCreatePost}
                isLoading={isCreating}
            />

            {/* Warning Modal */}
            {memberToWarn && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[200] p-4 backdrop-blur-sm">
                    <div className="bg-bg-secondary border border-border-primary rounded-2xl p-6 w-full max-w-md animate-in fade-in zoom-in-95 shadow-2xl">
                        <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                            <AlertTriangle className="text-yellow-500" /> Send Warning
                        </h3>
                        <p className="text-sm text-text-secondary mb-6">
                            Are you sure you want to send a warning notification to <span className="text-white font-bold">{memberToWarn.name}</span>?
                        </p>
                        <div className="flex gap-3 justify-end">
                            <button
                                onClick={() => setMemberToWarn(null)}
                                className="px-4 py-2 text-sm font-bold text-text-secondary hover:text-white transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSendWarning}
                                className="px-4 py-2 bg-yellow-500/20 text-yellow-500 hover:bg-yellow-500 hover:text-bg-primary rounded-xl font-bold text-sm transition-all"
                            >
                                Send Warning
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Remove Member Modal */}
            {memberToRemove && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[200] p-4 backdrop-blur-sm">
                    <div className="bg-bg-secondary border border-border-primary rounded-2xl p-6 w-full max-w-md animate-in fade-in zoom-in-95 shadow-2xl">
                        <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                            <Trash2 className="text-red-500" /> Remove Member
                        </h3>
                        <p className="text-sm text-text-secondary mb-4">
                            You are about to remove <span className="text-white font-bold">{memberToRemove.name}</span> from the group.
                        </p>
                        <div className="mb-6">
                            <label className="block text-xs font-bold text-text-secondary mb-2 uppercase tracking-wider">Reason for removal</label>
                            <textarea
                                value={removeReason}
                                onChange={(e) => setRemoveReason(e.target.value)}
                                placeholder="Provide a reason (optional)"
                                className="w-full bg-bg-primary border border-border-primary rounded-xl p-3 text-sm text-white focus:outline-none focus:border-red-500/50 min-h-[100px] resize-none"
                            />
                        </div>
                        <div className="flex gap-3 justify-end">
                            <button
                                onClick={() => { setMemberToRemove(null); setRemoveReason(''); }}
                                disabled={isRemovingMember}
                                className="px-4 py-2 text-sm font-bold text-text-secondary hover:text-white transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleRemoveMember}
                                disabled={isRemovingMember}
                                className="px-4 py-2 bg-red-500/20 text-red-500 hover:bg-red-500 hover:text-white rounded-xl font-bold text-sm transition-all flex items-center gap-2 disabled:opacity-50"
                            >
                                {isRemovingMember && <div className="w-4 h-4 border-2 border-red-500 border-t-white rounded-full animate-spin"></div>}
                                Remove
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div >
    );
};

export default GroupAdminPage;
