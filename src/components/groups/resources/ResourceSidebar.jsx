import React from 'react';
import {
    Star,
    Clock,
    FolderPlus,
    FilePlus,
    Globe,
    Lock,
    X,
} from 'lucide-react';
import FolderTree from './FolderTree';

const ResourceSidebar = ({
    sidebarWidth,
    isMobileSidebarOpen,
    setIsMobileSidebarOpen,
    viewMode,
    setViewMode,
    selectedFolderId,
    selectedFileId,
    showUploadPanel,
    folders,
    expandedFolders,
    setExpandedFolders,
    filesByFolder,
    inlineInput,
    setInlineInput,
    inlineValue,
    setInlineValue,
    handleCreateItem,
    canUploadToFolder,
    setSelectedFolderId,
    setSelectedFileId,
    setShowUploadPanel,
    toggleFolder,
    folderVisibilityMenu,
    setFolderVisibilityMenu,
}) => {
    return (
        <aside
            style={{ width: window.innerWidth < 1024 ? '280px' : `${sidebarWidth}px` }}
            className={`bg-[#0A0F1A] border-r border-border-primary flex flex-col shrink-0 overflow-hidden fixed lg:relative inset-y-0 left-0 z-[60] lg:z-auto transition-transform lg:transform-none ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
        >
            <div className="p-4 space-y-2 flex-1 overflow-y-auto no-scrollbar pt-20 lg:pt-0">
                <div className="lg:hidden flex items-center justify-between mb-2">
                    <span className="text-[10px] font-black uppercase tracking-widest text-text-secondary">Explorer</span>
                    <button onClick={() => setIsMobileSidebarOpen(false)} className="p-1 hover:bg-white/5 rounded-md text-text-secondary"><X size={16} /></button>
                </div>

                <div className="space-y-1">
                    <h4 className="text-[10px] font-black uppercase tracking-[0.1em] text-text-secondary px-2.5 opacity-60">Quick Access</h4>
                    <div className="space-y-0.5">
                        <div
                            onClick={() => { setViewMode('FAVORITES'); setIsMobileSidebarOpen(false); }}
                            className={`flex items-center gap-2.5 py-1.5 px-2.5 rounded-lg cursor-pointer transition-all group ${viewMode === 'FAVORITES' ? 'bg-amber-400/10 text-amber-400' : 'text-text-secondary hover:bg-white/5 hover:text-white'}`}
                        >
                            <Star size={16} className={viewMode === 'FAVORITES' ? 'text-amber-400' : 'group-hover:text-amber-400 transition-all'} />
                            <span className="text-[12px] font-bold whitespace-nowrap">Favorites</span>
                        </div>
                        <div
                            onClick={() => { setViewMode('RECENT'); setIsMobileSidebarOpen(false); }}
                            className={`flex items-center gap-2.5 py-1.5 px-2.5 rounded-lg cursor-pointer transition-all group ${viewMode === 'RECENT' ? 'bg-blue-400/10 text-blue-400' : 'text-text-secondary hover:bg-white/5 hover:text-white'}`}
                        >
                            <Clock size={16} className={viewMode === 'RECENT' ? 'text-blue-400' : 'group-hover:text-blue-400 transition-all'} />
                            <span className="text-[12px] font-bold whitespace-nowrap">Recent</span>
                        </div>
                    </div>
                </div>

                <div className="space-y-1">
                    <div className="flex items-center justify-between px-2.5">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.1em] text-text-secondary opacity-60">File Explorer</h4>
                        <div className="flex gap-1 shrink-0 relative">
                            <button
                                onClick={() => {
                                    if (!canUploadToFolder(selectedFolderId)) {
                                        alert("You don't have permission to create folders in this private folder.");
                                        return;
                                    }
                                    setFolderVisibilityMenu(folderVisibilityMenu ? null : { parentId: selectedFolderId });
                                }}
                                title="New Folder"
                                className={`p-1 hover:bg-white/10 rounded-md transition-all ${!canUploadToFolder(selectedFolderId) ? 'opacity-30 cursor-not-allowed' : folderVisibilityMenu ? 'bg-accent-blue/20 text-accent-blue' : 'text-text-secondary hover:text-white'}`}
                            >
                                <FolderPlus size={14} />
                            </button>

                            {folderVisibilityMenu && (
                                <div className="absolute top-full right-0 mt-1 w-32 bg-[#131821] border border-border-primary rounded-lg shadow-2xl z-[100] py-1 animate-in fade-in zoom-in-95 duration-150">
                                    <button
                                        onClick={() => {
                                            setInlineInput({ parentId: selectedFolderId, type: 'FOLDER', visibility: 'public' });
                                            setExpandedFolders(prev => [...new Set([...prev, selectedFolderId])]);
                                            setInlineValue('');
                                            setFolderVisibilityMenu(null);
                                        }}
                                        className="w-full text-left px-3 py-1.5 text-[10px] font-bold text-text-secondary hover:text-white hover:bg-white/5 flex items-center gap-2"
                                    >
                                        <Globe size={12} className="text-emerald-500" /> Public Folder
                                    </button>
                                    <button
                                        onClick={() => {
                                            setInlineInput({ parentId: selectedFolderId, type: 'FOLDER', visibility: 'private' });
                                            setExpandedFolders(prev => [...new Set([...prev, selectedFolderId])]);
                                            setInlineValue('');
                                            setFolderVisibilityMenu(null);
                                        }}
                                        className="w-full text-left px-3 py-1.5 text-[10px] font-bold text-text-secondary hover:text-white hover:bg-white/5 flex items-center gap-2"
                                    >
                                        <Lock size={12} className="text-amber-500" /> Private Folder
                                    </button>
                                </div>
                            )}

                            <button
                                onClick={() => {
                                    if (!canUploadToFolder(selectedFolderId)) {
                                        alert("You don't have permission to upload to this private folder.");
                                        return;
                                    }
                                    setInlineInput({ parentId: selectedFolderId, type: 'FILE' });
                                    setExpandedFolders(prev => [...new Set([...prev, selectedFolderId])]);
                                    setInlineValue('');
                                }}
                                title="New File"
                                className={`p-1 hover:bg-white/10 rounded-md transition-all ${!canUploadToFolder(selectedFolderId) ? 'opacity-30 cursor-not-allowed' : 'text-text-secondary hover:text-white'}`}
                            >
                                <FilePlus size={14} />
                            </button>
                        </div>
                    </div>
                    <div className="space-y-px overflow-x-hidden">
                        <FolderTree
                            nodes={folders}
                            depth={0}
                            expandedFolders={expandedFolders}
                            selectedFolderId={selectedFolderId}
                            selectedFileId={selectedFileId}
                            showUploadPanel={showUploadPanel}
                            filesByFolder={filesByFolder}
                            inlineInput={inlineInput}
                            inlineValue={inlineValue}
                            setInlineValue={setInlineValue}
                            setInlineInput={setInlineInput}
                            handleCreateItem={handleCreateItem}
                            canUploadToFolder={canUploadToFolder}
                            setSelectedFolderId={setSelectedFolderId}
                            setSelectedFileId={setSelectedFileId}
                            setShowUploadPanel={setShowUploadPanel}
                            setViewMode={setViewMode}
                            setIsMobileSidebarOpen={setIsMobileSidebarOpen}
                            toggleFolder={toggleFolder}
                        />
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default ResourceSidebar;
