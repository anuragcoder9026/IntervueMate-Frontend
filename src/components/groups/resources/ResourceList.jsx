import React from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import {
    Folder,
    MoreVertical,
    Download,
    Star,
    ChevronDown,
    Eye,
    Edit3,
    Trash2,
    CheckCircle
} from 'lucide-react';
import { getFileMetaData, formatDate, formatFileName } from './resourceUtils';

const getProfileUrl = (userObj) => {
    if (!userObj) return '#';
    const nameStr = userObj.name || 'user';
    const slug = nameStr.toLowerCase().replace(/\s/g, "");
    return `/profile/${slug}-${userObj.userId}`;
};

const ResourceList = ({
    activeResources,
    currentFolderName,
    selectedFileId,
    setSelectedFileId,
    setSelectedFolderId,
    user,
    currentGroup,
    resourceOptionsMenu,
    setResourceOptionsMenu,
    renamingResource,
    setRenamingResource,
    deletingResource,
    setDeletingResource,
    optionsMenuRef,
    handleDownload,
    dispatch,
    rateResource,
    renameResource,
    deleteResource,
    verifyResource,
}) => {
    return (
        <>
            <div className="mb-4 md:mb-6 pl-1 flex items-center justify-between">
                <div>
                    <h2 className="text-lg md:text-xl font-black text-white tracking-tight leading-none mb-1.5 uppercase">{currentFolderName}</h2>
                    <p className="text-[10px] md:text-[11px] text-text-secondary font-medium tracking-wide opacity-60 uppercase">{activeResources.length} resources found</p>
                </div>
            </div>

            <div className="bg-[#0A0F1A] border border-border-primary rounded-xl shadow-2xl relative overflow-x-auto no-scrollbar">
                <div className="min-w-[800px]">
                    <div className="grid grid-cols-12 gap-3 px-4 md:px-6 py-3 border-b border-border-primary/50 text-[10px] font-black uppercase tracking-[0.12em] text-text-secondary bg-[#0E1420]/50 sticky top-0 z-10">
                        <div className="col-span-4 flex items-center gap-1.5">NAME <ChevronDown size={12} className="opacity-50" /></div>
                        <div className="col-span-2">SIZE</div>
                        <div className="col-span-1">TYPE</div>
                        <div className="col-span-2">DATE CREATED</div>
                        <div className="col-span-1 text-center">CREATOR</div>
                        <div className="col-span-2 text-right">ACTIONS</div>
                    </div>

                    <div className="divide-y divide-border-primary/20">
                        {activeResources.length === 0 ? (
                            <div className="py-20 flex flex-col items-center justify-center text-text-secondary gap-4">
                                <Folder size={48} className="opacity-10" />
                                <p className="text-xs font-bold uppercase tracking-widest opacity-30">This folder is empty</p>
                            </div>
                        ) : (
                            activeResources.map(res => {
                                const meta = getFileMetaData(res.fileType, res?.name);
                                const isSelected = selectedFileId === res.id;
                                return (
                                    <div
                                        key={res.id}
                                        onClick={() => {
                                            setSelectedFileId(res.id);
                                            if (res.parentId) {
                                                setSelectedFolderId(res.parentId);
                                            }
                                        }}
                                        className={`grid grid-cols-12 gap-3 px-4 md:px-6 py-3 items-center group transition-all cursor-pointer relative ${isSelected ? 'bg-accent-blue/10 border-l-2 border-accent-blue' : 'hover:bg-white/[0.03]'} ${(resourceOptionsMenu?.id === res.id || renamingResource?.id === res.id || deletingResource?.id === res.id) ? 'z-[60]' : 'z-auto'}`}
                                    >
                                        <div className="col-span-4 flex items-center gap-3">
                                            <div className={`w-8.5 h-8.5 rounded-lg ${meta.bgColor} flex items-center justify-center transition-all duration-300 group-hover:scale-105 shadow-md flex-shrink-0`}>
                                                <meta.icon size={16} className={meta.color} />
                                            </div>
                                            <span className={`text-[12px] md:text-[13px] font-bold transition-colors truncate ${isSelected ? 'text-accent-blue' : 'text-white group-hover:text-accent-blue'}`}>{formatFileName(res)}</span>
                                            {res.isVerified && (
                                                <div className="flex items-center justify-center text-green-500 mr-2" title="Verified Resource">
                                                    <CheckCircle size={15} className="fill-green-500/20" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="col-span-2 text-[11px] md:text-xs font-medium text-text-secondary tabular-nums">{res.size}</div>
                                        <div className="col-span-1">
                                            <span className={`px-2 py-0.5 rounded text-[9px] font-black tracking-widest ${meta.bgColor} ${meta.color} border border-current transition-all group-hover:opacity-100 opacity-60`}>{meta.displayType}</span>
                                        </div>
                                        <div className="col-span-2 text-[11px] md:text-xs font-medium text-text-secondary tabular-nums">{formatDate(res.createdAt)}</div>
                                        <div className="col-span-1 flex items-center justify-center">
                                            {res.creator && (
                                                <Link
                                                    to={getProfileUrl(res.creator)}
                                                    onClick={(e) => e.stopPropagation()}
                                                    className="w-6 h-6 rounded-full overflow-hidden border border-white/10 hover:border-accent-blue transition-all group/creator"
                                                    title={res.creator?.name || 'Creator'}
                                                >
                                                    <img
                                                        src={res.creator?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(res.creator?.name || 'U')}&background=random`}
                                                        alt="Creator"
                                                        className="w-full h-full object-cover group-hover/creator:scale-110 transition-transform"
                                                    />
                                                </Link>
                                            )}
                                        </div>
                                        <div className="col-span-2 flex items-center justify-end gap-1">

                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    dispatch(rateResource(res.id));
                                                }}
                                                className={`flex items-center gap-1 px-2 py-1.5 rounded-lg transition-all ${res.ratings?.includes(user?._id) ? 'bg-amber-400/10 text-amber-400' : 'text-text-secondary hover:text-amber-400 hover:bg-amber-400/10'}`}
                                            >
                                                <Star size={14} className={res.ratings?.includes(user?._id) ? 'fill-amber-400' : ''} />
                                                <span className="text-[11px] font-black">{res.rateCount || 0}</span>
                                            </button>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDownload(res);
                                                }}
                                                className="p-1.5 md:p-2 text-text-secondary hover:text-accent-blue hover:bg-accent-blue/10 rounded-lg transition-all shrink-0"
                                            >
                                                {res.fileType === 'video' || res.fileType === 'mp4' ? <Eye size={15} /> : <Download size={15} />}
                                            </button>
                                            {(currentGroup?.admins?.some(a => (a?._id || a) === user?._id) || (currentGroup?.creator?._id || currentGroup?.creator) === user?._id || res.creator?._id === user?._id || res.creator === user?._id) && (
                                                <div className="relative">
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            const rect = e.currentTarget.getBoundingClientRect();
                                                            setResourceOptionsMenu(resourceOptionsMenu?.id === res.id ? null : { id: res.id, rect });
                                                        }}
                                                        className={`p-1.5 md:p-2 rounded-lg transition-all shrink-0 ${resourceOptionsMenu?.id === res.id ? 'bg-white/10 text-white' : 'text-text-secondary hover:text-white hover:bg-white/5'}`}
                                                    >
                                                        <MoreVertical size={15} />
                                                    </button>

                                                    {resourceOptionsMenu?.id === res.id && createPortal(
                                                        <div
                                                            ref={optionsMenuRef}
                                                            className="fixed w-48 bg-[#0E1420]/95 border border-border-primary rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-[100] overflow-hidden backdrop-blur-2xl ring-1 ring-white/5 transition-all duration-200 ease-out transform origin-bottom-right"
                                                            style={{
                                                                bottom: window.innerHeight - resourceOptionsMenu.rect?.top + 8,
                                                                right: window.innerWidth - resourceOptionsMenu.rect.right
                                                            }}
                                                        >
                                                            <div className="p-1.5 flex flex-col gap-1">
                                                                <div className="px-3 py-2 border-b border-border-primary/30 mb-1">
                                                                    <p className="text-[9px] font-black text-text-secondary uppercase tracking-[0.2em] opacity-50">Manage Item</p>
                                                                </div>
                                                                <button
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        setRenamingResource({ id: res.id, name: res?.name || res.title, rect: resourceOptionsMenu.rect });
                                                                        setResourceOptionsMenu(null);
                                                                    }}
                                                                    className="flex items-center gap-3 px-3 py-2.5 text-[11px] font-black uppercase tracking-wider text-text-secondary hover:text-white hover:bg-white/5 rounded-lg transition-all text-left group/item"
                                                                >
                                                                    <Edit3 size={14} className="text-accent-blue group-hover/item:scale-110 transition-transform" /> RENAME
                                                                </button>
                                                                {currentGroup?.admins?.some(a => (a?._id || a) === user?._id) && (
                                                                    <button
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            dispatch(verifyResource(res.id));
                                                                            setResourceOptionsMenu(null);
                                                                        }}
                                                                        className="flex items-center gap-3 px-3 py-2.5 text-[11px] font-black uppercase tracking-wider text-text-secondary hover:text-white hover:bg-white/5 rounded-lg transition-all text-left group/item"
                                                                    >
                                                                        <CheckCircle size={14} className={res.isVerified ? "text-rose-500" : "text-green-500 group-hover/item:scale-110 transition-transform"} />
                                                                        {res.isVerified ? 'UNVERIFY' : 'VERIFY'}
                                                                    </button>
                                                                )}
                                                                <button
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        setDeletingResource({ id: res.id, name: res?.name || res.title, rect: resourceOptionsMenu.rect });
                                                                        setResourceOptionsMenu(null);
                                                                    }}
                                                                    className="flex items-center gap-3 px-3 py-2.5 text-[11px] font-black uppercase tracking-wider text-rose-500/80 hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition-all text-left group/item"
                                                                >
                                                                    <Trash2 size={14} className="group-hover/item:scale-110 transition-transform" /> DELETE
                                                                </button>
                                                            </div>
                                                        </div>,
                                                        document.body
                                                    )}
                                                    {/* Local Rename Popup */}
                                                    {renamingResource && renamingResource?.id === res.id && createPortal(
                                                        <div
                                                            className="fixed w-64 bg-[#0E1420]/98 border border-border-primary rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-[110] overflow-hidden backdrop-blur-2xl ring-1 ring-white/5 transition-all duration-300 ease-out transform origin-right animate-in fade-in slide-in-from-right-4"
                                                            style={{
                                                                bottom: window.innerHeight - renamingResource.rect.bottom,
                                                                right: window.innerWidth - renamingResource.rect.left + 16
                                                            }}
                                                        >
                                                            <div className="p-4 flex flex-col gap-4">
                                                                <div className="flex items-center gap-2 border-b border-border-primary/30 pb-2">
                                                                    <Edit3 size={12} className="text-accent-blue" />
                                                                    <p className="text-[9px] font-black text-white uppercase tracking-[0.2em]">Rename Item</p>
                                                                </div>
                                                                <input
                                                                    autoFocus
                                                                    type="text"
                                                                    className="w-full bg-[#070B13] border border-border-primary/50 px-3 py-2.5 rounded-lg text-white text-xs font-bold focus:border-accent-blue outline-none transition-all"
                                                                    value={renamingResource?.name}
                                                                    onChange={(e) => setRenamingResource({ ...renamingResource, name: e.target.value })}
                                                                    onKeyDown={(e) => {
                                                                        if (e.key === 'Enter') {
                                                                            dispatch(renameResource({ resourceId: res.id, name: renamingResource?.name }));
                                                                            setRenamingResource(null);
                                                                        } else if (e.key === 'Escape') {
                                                                            setRenamingResource(null);
                                                                        }
                                                                    }}
                                                                />
                                                                <div className="flex gap-2">
                                                                    <button
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            dispatch(renameResource({ resourceId: res.id, name: renamingResource?.name }));
                                                                            setRenamingResource(null);
                                                                        }}
                                                                        className="flex-1 py-2 bg-accent-blue hover:bg-blue-600 rounded-lg text-[9px] font-bold uppercase tracking-widest text-white transition-all shadow-lg shadow-accent-blue/10"
                                                                    >
                                                                        Apply
                                                                    </button>
                                                                    <button
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            setRenamingResource(null);
                                                                        }}
                                                                        className="px-3 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-[9px] font-bold uppercase tracking-widest text-text-secondary transition-all"
                                                                    >
                                                                        ×
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>,
                                                        document.body
                                                    )}

                                                    {/* Local Delete Popup */}
                                                    {deletingResource && deletingResource?.id === res.id && createPortal(
                                                        <div
                                                            className="fixed w-64 bg-[#0E1420]/98 border border-rose-500/20 rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-[110] overflow-hidden backdrop-blur-2xl ring-1 ring-white/5 transition-all duration-300 ease-out transform origin-right animate-in fade-in slide-in-from-right-4"
                                                            style={{
                                                                bottom: window.innerHeight - deletingResource.rect.bottom,
                                                                right: window.innerWidth - deletingResource.rect.left + 16
                                                            }}
                                                        >
                                                            <div className="p-4 flex flex-col gap-4">
                                                                <div className="flex items-center gap-2 border-b border-rose-500/20 pb-2">
                                                                    <Trash2 size={12} className="text-rose-500" />
                                                                    <p className="text-[9px] font-black text-rose-500 uppercase tracking-[0.2em]">Remove Item?</p>
                                                                </div>
                                                                <p className="text-[10px] font-bold text-text-secondary opacity-80 leading-relaxed uppercase tracking-widest">Permanent removal of <span className="text-white">"{deletingResource?.name}"</span>.</p>
                                                                <div className="flex gap-2">
                                                                    <button
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            dispatch(deleteResource(deletingResource.id));
                                                                            setDeletingResource(null);
                                                                        }}
                                                                        className="flex-1 py-2 bg-rose-500 hover:bg-rose-600 rounded-lg text-[9px] font-bold uppercase tracking-widest text-white transition-all shadow-lg shadow-rose-500/10"
                                                                    >
                                                                        Delete
                                                                    </button>
                                                                    <button
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            setDeletingResource(null);
                                                                        }}
                                                                        className="px-3 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-[9px] font-bold uppercase tracking-widest text-text-secondary transition-all"
                                                                    >
                                                                        No
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>,
                                                        document.body
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                        <div className={`absolute left-0 top-0 bottom-0 w-0.5 bg-accent-blue transition-opacity ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`} />
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default ResourceList;
