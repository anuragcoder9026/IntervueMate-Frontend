import React from 'react';
import {
    Folder,
    FileText,
    ChevronRight,
    ChevronDown,
    Lock,
    ShieldCheck,
} from 'lucide-react';
import { getFileMetaData, formatFileName } from './resourceUtils';

const FolderTree = ({
    nodes,
    depth = 0,
    expandedFolders,
    selectedFolderId,
    selectedFileId,
    showUploadPanel,
    filesByFolder,
    inlineInput,
    inlineValue,
    setInlineValue,
    setInlineInput,
    handleCreateItem,
    canUploadToFolder,
    setSelectedFolderId,
    setSelectedFileId,
    setShowUploadPanel,
    setViewMode,
    setIsMobileSidebarOpen,
    toggleFolder,
}) => {
    return nodes.map(node => {
        const isExpanded = expandedFolders.includes(node.id);
        const isSelected = selectedFolderId === node.id;
        const hasChildren = (node.children && node.children.length > 0) || (filesByFolder[node.id] && filesByFolder[node.id].length > 0);
        const isCreatingHere = inlineInput?.parentId === node.id;
        const nodeFiles = filesByFolder[node.id] || [];

        return (
            <div key={node.id} className="select-none">
                <div
                    onClick={(e) => {
                        e.stopPropagation();
                        if (hasChildren || isSelected) toggleFolder(node.id);
                        setSelectedFolderId(node.id);
                        setViewMode('EXPLORER');
                        setSelectedFileId(null);
                        setShowUploadPanel(false);
                        if (window.innerWidth < 1024 && !hasChildren) setIsMobileSidebarOpen(false);
                    }}
                    className={`flex items-center gap-2.5 py-1.5 px-2.5 rounded-lg cursor-pointer transition-all ${isSelected && !selectedFileId && !showUploadPanel ? 'bg-accent-blue/20 text-accent-blue' : 'text-text-secondary hover:bg-white/5 hover:text-white'
                        }`}
                    style={{ paddingLeft: `${depth * 14 + 10}px` }}
                >
                    <div className="flex items-center gap-1.5 min-w-0 flex-1">
                        {hasChildren ? (
                            isExpanded ? <ChevronDown size={12} className="opacity-50 flex-shrink-0" /> : <ChevronRight size={12} className="opacity-50 flex-shrink-0" />
                        ) : (
                            <div className="w-3 flex-shrink-0" />
                        )}
                        <Folder size={14} className={`${isSelected && !selectedFileId && !showUploadPanel ? 'text-accent-blue' : 'text-text-secondary'} flex-shrink-0`} />
                        <span className={`text-[12px] tracking-tight truncate ${isSelected && !selectedFileId && !showUploadPanel ? 'font-bold' : 'font-medium'}`}>
                            {node?.name}
                        </span>
                        {node.visibility === 'private' && (
                            <Lock size={10} className="text-amber-500 opacity-60 ml-auto flex-shrink-0" />
                        )}
                        {!canUploadToFolder(node.id) && node.type === 'folder' && (
                            <ShieldCheck size={10} className="text-text-secondary opacity-40 ml-1 flex-shrink-0" title="Read Only" />
                        )}
                    </div>
                </div>

                {/* Inline Input for this folder */}
                {isCreatingHere && isExpanded && (
                    <form
                        onSubmit={handleCreateItem}
                        className="flex items-center gap-2.5 py-1.5 px-2.5"
                        style={{ paddingLeft: `${(depth + 1) * 14 + 10}px` }}
                    >
                        <div className="w-3 flex-shrink-0" />
                        {inlineInput.type === 'FOLDER' ? <Folder size={14} className="text-amber-500 flex-shrink-0" /> : <FileText size={14} className="text-blue-500 flex-shrink-0" />}
                        <input
                            autoFocus
                            type="text"
                            value={inlineValue}
                            onChange={(e) => setInlineValue(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Escape') {
                                    setInlineInput(null);
                                    setInlineValue('');
                                }
                            }}
                            onBlur={() => {
                                setTimeout(() => handleCreateItem(), 100);
                            }}
                            className="w-full bg-[#131821] border border-accent-blue/50 rounded px-1.5 py-0.5 text-[12px] text-white focus:outline-none focus:ring-1 focus:ring-accent-blue/50"
                            placeholder={inlineInput.type === 'FOLDER' ? "Folder Name..." : "File Name..."}
                        />
                    </form>
                )}

                {isExpanded && (
                    <>
                        {node.children && (
                            <FolderTree
                                nodes={node.children}
                                depth={depth + 1}
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
                        )}
                        {nodeFiles.map(file => {
                            const meta = getFileMetaData(file.fileType, file?.name);
                            const isFileSelected = selectedFileId === file.id;
                            return (
                                <div
                                    key={file.id}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setSelectedFileId(file.id);
                                        setSelectedFolderId(node.id);
                                        setShowUploadPanel(false);
                                    }}
                                    className={`flex items-center gap-1.5 py-1.5 px-2.5 rounded-lg transition-all group cursor-pointer ${isFileSelected ? 'bg-accent-blue/20 text-accent-blue' : 'text-text-secondary hover:bg-white/5 hover:text-white'
                                        }`}
                                    style={{ paddingLeft: `${(depth + 1) * 14 + 10}px` }}
                                >
                                    <div className="w-3 flex-shrink-0" />
                                    <meta.icon size={13} className={`${meta.color} flex-shrink-0 ${isFileSelected ? 'opacity-100' : 'opacity-70 group-hover:opacity-100'}`} />
                                    <span className={`text-[11px] tracking-tight truncate ${isFileSelected ? 'font-bold opacity-100' : 'font-medium opacity-80 group-hover:opacity-100'}`}>
                                        {formatFileName(file)}
                                    </span>
                                </div>
                            );
                        })}
                    </>
                )}
            </div>
        );
    });
};

export default FolderTree;
