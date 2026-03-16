import React, { useState } from 'react';
import { Megaphone, Bell, Calendar, User, Pin, ArrowRight, Menu, Users, PlusCircle, Trash2, X, AlertCircle, Loader2 } from 'lucide-react';

import { useDispatch, useSelector } from 'react-redux';
import { updateGroup } from '../../../store/groupSlice';
import { toast } from 'react-toastify';

const AnnouncementsArea = ({ channelName, onToggleLeft, onToggleRight, isAdminMode, isAdmin, rules: initialRules, announcements: initialAnnouncements, groupId }) => {
    const dispatch = useDispatch();
    const { user } = useSelector(state => state.auth);

    const [announcements, setAnnouncements] = useState(initialAnnouncements || []);
    const [rules, setRules] = useState(initialRules || []);

    React.useEffect(() => {
        if (initialRules) setRules(initialRules);
    }, [initialRules]);

    React.useEffect(() => {
        if (initialAnnouncements) setAnnouncements(initialAnnouncements);
    }, [initialAnnouncements]);


    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [deleteConfirmationId, setDeleteConfirmationId] = useState(null);
    const [newTitle, setNewTitle] = useState("");
    const [newContent, setNewContent] = useState("");
    const [isImportant, setIsImportant] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [expandedAnnouncements, setExpandedAnnouncements] = useState({});



    const isRules = channelName === 'rules';

    const handleCreateEntry = async (e) => {
        e.preventDefault();
        if (!newTitle.trim() || !newContent.trim()) return;

        if (isRules) {
            setIsSubmitting(true);
            const newRule = {
                title: newTitle,
                description: newContent
            };

            // Create updated rules array for persistence
            const updatedRules = [...rules, newRule];

            // Persist to DB
            const resultAction = await dispatch(updateGroup({
                groupId,
                groupData: { rules: updatedRules }
            }));

            if (updateGroup.fulfilled.match(resultAction)) {
                toast.success('Rule added successfully!');
                setNewTitle("");
                setNewContent("");
                setIsCreateModalOpen(false);
            } else {
                toast.error('Failed to add rule');
            }
            setIsSubmitting(false);

        } else {
            setIsSubmitting(true);
            const newAnnouncement = {
                title: newTitle,
                content: newContent,
                important: isImportant,
                author: user?._id || user?.id,
                date: new Date()
            };

            const updatedAnnouncements = [newAnnouncement, ...announcements];

            const resultAction = await dispatch(updateGroup({
                groupId,
                groupData: { announcements: updatedAnnouncements }
            }));

            if (updateGroup.fulfilled.match(resultAction)) {
                toast.success('Announcement posted!');
                setNewTitle("");
                setNewContent("");
                setIsImportant(false);
                setIsCreateModalOpen(false);
            } else {
                toast.error('Failed to post announcement');
            }
            setIsSubmitting(false);
        }
    };

    const handleDeleteEntry = async () => {
        if (isRules) {
            setIsSubmitting(true);
            // Find the rule to delete by matching ID (could be _id from DB or id from local)
            const updatedRules = rules.filter((item, index) => {
                const itemId = item._id || item.id || index;
                return itemId !== deleteConfirmationId;
            });

            // Persist to DB
            const resultAction = await dispatch(updateGroup({
                groupId,
                groupData: { rules: updatedRules }
            }));

            if (updateGroup.fulfilled.match(resultAction)) {
                toast.success('Rule removed');
                setDeleteConfirmationId(null);
            } else {
                toast.error('Failed to remove rule');
            }
            setIsSubmitting(false);

        } else {
            setIsSubmitting(true);
            const updatedAnnouncements = announcements.filter((item, index) => {
                const itemId = item._id || item.id || index;
                return itemId !== deleteConfirmationId;
            });

            const resultAction = await dispatch(updateGroup({
                groupId,
                groupData: { announcements: updatedAnnouncements }
            }));

            if (updateGroup.fulfilled.match(resultAction)) {
                toast.success('Announcement removed');
                setDeleteConfirmationId(null);
            } else {
                toast.error('Failed to remove announcement');
            }
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex-1 flex flex-col bg-[#171C26] h-full min-w-0 min-h-0 text-gray-200 relative">
            {/* Create Modal (Unified for Rules and Announcements) */}
            {isCreateModalOpen && (
                <div className="absolute inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-[#1E232E] w-full max-w-lg rounded-2xl border border-white/10 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
                            <h2 className="text-lg font-bold text-white flex items-center gap-2">
                                <PlusCircle size={20} className="text-accent-blue" />
                                {isRules ? 'Add New Rule' : 'Create Announcement'}
                            </h2>
                            <button onClick={() => setIsCreateModalOpen(false)} className="text-gray-500 hover:text-white transition-colors">
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleCreateEntry} className="p-6 space-y-4">
                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-[0.1em] text-gray-500 mb-1.5 ml-1">
                                    {isRules ? 'Rule Title' : 'Announcement Title'}
                                </label>
                                <input
                                    type="text"
                                    value={newTitle}
                                    onChange={(e) => setNewTitle(e.target.value)}
                                    placeholder={isRules ? "e.g. No Advertising" : "Enter title..."}
                                    className="w-full bg-[#171C26] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-accent-blue/50 transition-all font-medium"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-[0.1em] text-gray-500 mb-1.5 ml-1">
                                    {isRules ? 'Rule Description' : 'Announcement Content'}
                                </label>
                                <textarea
                                    value={newContent}
                                    onChange={(e) => setNewContent(e.target.value)}
                                    placeholder={isRules ? "Explain the rule details..." : "What's the update?"}
                                    rows={4}
                                    className="w-full bg-[#171C26] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-accent-blue/50 transition-all font-medium resize-none"
                                    required
                                />
                            </div>
                            {!isRules && (
                                <div className="flex items-center gap-3 p-3 bg-accent-blue/5 border border-accent-blue/10 rounded-xl">
                                    <input
                                        type="checkbox"
                                        id="important"
                                        checked={isImportant}
                                        onChange={(e) => setIsImportant(e.target.checked)}
                                        className="w-4 h-4 rounded border-white/10 bg-[#171C26] text-accent-blue focus:ring-accent-blue/50"
                                    />
                                    <label htmlFor="important" className="text-xs font-bold text-gray-300 flex items-center gap-2 cursor-pointer">
                                        <AlertCircle size={14} className="text-accent-blue" />
                                        Mark as Important
                                    </label>
                                </div>
                            )}
                            <div className="flex gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setIsCreateModalOpen(false)}
                                    className="flex-1 px-4 py-3 rounded-xl border border-white/5 text-sm font-bold text-gray-400 hover:bg-white/5 hover:text-white transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="flex-1 px-4 py-3 rounded-xl bg-accent-blue text-sm font-bold text-white hover:bg-blue-600 shadow-lg shadow-accent-blue/20 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    {isSubmitting ? (
                                        <Loader2 size={18} className="animate-spin" />
                                    ) : (
                                        isRules ? 'Add Rule' : 'Post Announcement'
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {deleteConfirmationId && (
                <div className="absolute inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-[2px] animate-in fade-in duration-200">
                    <div className="bg-[#1E232E] border border-red-500/20 rounded-2xl p-6 max-w-sm w-full shadow-2xl animate-in zoom-in-95">
                        <div className="flex items-center gap-3 mb-4 text-red-500">
                            <Trash2 size={24} />
                            <h3 className="text-lg font-bold">Delete {isRules ? 'Rule' : 'Post'}?</h3>
                        </div>
                        <p className="text-sm text-gray-400 mb-6 leading-relaxed">
                            Are you sure you want to remove this {isRules ? 'community rule' : 'announcement'}? This action cannot be undone.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setDeleteConfirmationId(null)}
                                className="flex-1 px-4 py-2 text-sm font-bold text-gray-400 hover:text-white border border-white/5 rounded-xl hover:bg-white/5 transition-all"
                            >
                                Never Mind
                            </button>
                            <button
                                onClick={handleDeleteEntry}
                                disabled={isSubmitting}
                                className="flex-1 px-4 py-2 text-sm font-bold text-white bg-red-500 hover:bg-red-600 rounded-xl shadow-lg shadow-red-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : 'Yes, Delete'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Top Bar */}
            <div className="h-10 md:h-16 px-4 md:px-6 border-b border-white/5 flex items-center justify-between shrink-0 bg-[#171C26] shadow-sm z-10">
                <div className="flex items-center gap-2 sm:gap-3 overflow-hidden">
                    <button
                        onClick={onToggleLeft}
                        className="md:hidden text-gray-400 hover:text-white transition-colors p-1"
                    >
                        <Menu size={20} />
                    </button>

                    <div className="flex items-center gap-3">
                        {isRules ? <Pin size={20} className="text-gray-400 shrink-0" /> : <Megaphone size={20} className="text-gray-400 shrink-0" />}
                        <h1 className="font-bold text-white text-[14px] sm:text-lg leading-tight truncate">
                            {isRules ? 'Rules & Guidelines' : 'Announcements'}
                        </h1>
                    </div>
                </div>

                <div className="flex items-center gap-2 sm:gap-4 shrink-0">
                    {isAdmin && (
                        <button
                            onClick={() => setIsCreateModalOpen(true)}
                            className="flex items-center gap-2 px-3 py-1.5 bg-accent-blue hover:bg-blue-600 text-white rounded-lg text-xs font-bold transition-all shadow-lg shadow-accent-blue/10 active:scale-95"
                        >
                            <PlusCircle size={16} />
                            <span className="hidden sm:inline">{isRules ? 'New Rule' : 'New Announcement'}</span>
                        </button>
                    )}

                    <button
                        onClick={onToggleRight}
                        className={`${isAdminMode ? '' : 'lg:hidden'} text-gray-400 hover:text-white transition-colors p-1`}
                    >
                        <Users size={20} />
                    </button>
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto no-scrollbar p-4 md:p-8 pb-20 lg:pb-8">
                <div className="max-w-3xl mx-auto space-y-8">

                    <div className={`rounded-2xl p-6 border border-white/5 ${isRules ? 'bg-gradient-to-br from-purple-500/10 to-blue-500/10' : 'bg-gradient-to-br from-accent-blue/10 to-emerald-500/10'}`}>
                        <div className="flex items-center gap-4 mb-4">
                            <div className={`p-3 rounded-xl ${isRules ? 'bg-purple-500/20 text-purple-400' : 'bg-accent-blue/20 text-accent-blue'}`}>
                                {isRules ? <Bell size={24} /> : <Megaphone size={24} />}
                            </div>
                            <div>
                                <h2 className="text-lg sm:text-xl font-bold text-white">Welcome to the {isRules ? 'Rulebook' : 'Bulletin Board'}</h2>
                                <p className="text-xs sm:text-sm text-gray-400">Important information for all group members</p>
                            </div>
                        </div>
                    </div>

                    {isRules ? (
                        <div className="grid grid-cols-1 gap-4">
                            {rules.map((rule, idx) => {
                                const ruleId = rule._id || rule.id || idx;
                                return (
                                    <div key={ruleId} className="bg-[#1E232E] border border-white/5 rounded-xl p-5 hover:border-white/10 transition-colors group relative">
                                        {/* Red Delete Button for Rules */}
                                        {isAdmin && (
                                            <button
                                                onClick={() => setDeleteConfirmationId(ruleId)}
                                                className="absolute top-4 right-4 p-2 text-red-500 bg-red-500/10 rounded-lg hover:bg-red-500 hover:text-white transition-all shadow-sm"
                                                title="Delete Rule"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        )}

                                        <div className="flex items-start gap-4">
                                            <span className="text-xl sm:text-2xl font-black text-white/10 group-hover:text-purple-500/40 transition-colors shrink-0">{idx + 1}</span>
                                            <div className="pr-10">
                                                <h3 className="text-white text-[14px] sm:text-base font-bold mb-1">{rule.title}</h3>
                                                <p className="text-[13px] sm:text-sm text-gray-400 leading-relaxed">
                                                    {(() => {
                                                        const urlRegex = /(https?:\/\/[^\s]+)/g;
                                                        const parts = rule.description?.split(urlRegex) || [];
                                                        return parts.map((part, i) => {
                                                            if (part.match(urlRegex)) {
                                                                return (
                                                                    <a
                                                                        key={i}
                                                                        href={part}
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                        className="text-accent-blue hover:underline break-all"
                                                                        onClick={(e) => e.stopPropagation()}
                                                                    >
                                                                        {part}
                                                                    </a>
                                                                );
                                                            }
                                                            return part;
                                                        });
                                                    })()}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                            {rules.length === 0 && (
                                <div className="py-20 text-center bg-[#1E232E] border border-dashed border-white/5 rounded-2xl">
                                    <h3 className="text-white font-bold mb-1">No Rules Defined</h3>
                                    <p className="text-sm text-gray-500">Add some rules to guide your community.</p>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {announcements.length > 0 ? (
                                announcements.map((item, idx) => {
                                    const announcementId = item._id || item.id || idx;
                                    const authorName = item.author?.name || 'Group Admin';
                                    const authorAvatar = item.author?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(authorName)}&background=random`;
                                    const displayDate = item.date ? new Date(item.date).toLocaleDateString('en-US', {
                                        month: 'short',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    }) : 'Just now';

                                    const isExpanded = expandedAnnouncements[announcementId];
                                    const toggleExpand = () => {
                                        setExpandedAnnouncements(prev => ({
                                            ...prev,
                                            [announcementId]: !prev[announcementId]
                                        }));
                                    };

                                    const needsTruncation = item.content.length > 150;
                                    const displayContent = (!isExpanded && needsTruncation)
                                        ? `${item.content.substring(0, 150)}...`
                                        : item.content;

                                    return (
                                        <div key={announcementId} className="bg-[#1E232E] border border-white/5 rounded-xl overflow-hidden hover:border-white/10 transition-colors group relative">
                                            {isAdmin && (
                                                <button
                                                    onClick={() => setDeleteConfirmationId(announcementId)}
                                                    className="absolute top-4 right-4 p-2 text-red-500 bg-red-500/10 rounded-lg hover:bg-red-500 hover:text-white transition-all shadow-sm"
                                                    title="Delete Announcement"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            )}

                                            {item.important && (
                                                <div className="bg-accent-blue/20 px-4 py-1 text-[10px] font-black uppercase tracking-widest text-accent-blue border-b border-accent-blue/10">
                                                    Important Update
                                                </div>
                                            )}
                                            <div className="p-4 sm:p-6">
                                                <div className="flex items-center gap-3 mb-4">
                                                    <img src={authorAvatar} className="w-8 h-8 rounded-full shadow-sm" alt="" />
                                                    <div>
                                                        <p className="text-xs sm:text-sm font-bold text-white leading-tight">{authorName}</p>
                                                        <p className="text-[10px] sm:text-[11px] text-gray-500">{displayDate}</p>
                                                    </div>
                                                </div>
                                                <h3 className="text-base sm:text-lg font-bold text-white mb-2 pr-10">{item.title}</h3>
                                                <p className="text-[13px] sm:text-sm text-gray-300 leading-relaxed mb-4 whitespace-pre-wrap">
                                                    {(() => {
                                                        const urlRegex = /(https?:\/\/[^\s]+)/g;
                                                        const parts = displayContent?.split(urlRegex) || [];
                                                        return parts.map((part, i) => {
                                                            if (part.match(urlRegex)) {
                                                                return (
                                                                    <a
                                                                        key={i}
                                                                        href={part}
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                        className="text-accent-blue hover:underline break-all"
                                                                        onClick={(e) => e.stopPropagation()}
                                                                    >
                                                                        {part}
                                                                    </a>
                                                                );
                                                            }
                                                            return part;
                                                        });
                                                    })()}
                                                </p>

                                                {needsTruncation && (
                                                    <button
                                                        onClick={toggleExpand}
                                                        className="flex items-center gap-2 text-[11px] sm:text-xs font-bold text-accent-blue hover:underline"
                                                    >
                                                        {isExpanded ? 'Read Less' : 'Read More'} {!isExpanded && <ArrowRight size={14} />}
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="py-20 text-center bg-[#1E232E] border border-dashed border-white/5 rounded-2xl">
                                    <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-600">
                                        <Megaphone size={32} />
                                    </div>
                                    <h3 className="text-white font-bold mb-1">No Announcements Yet</h3>
                                    <p className="text-sm text-gray-500">Be the first to share an update with the group.</p>
                                </div>
                            )}
                        </div>
                    )}

                    <div className="pt-8 border-t border-white/5 text-center">
                        <p className="text-[11px] sm:text-xs text-gray-500">
                            Questions about these {isRules ? 'rules' : 'posts'}? Reach out to any moderator.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AnnouncementsArea;
