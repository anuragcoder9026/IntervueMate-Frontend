import React from 'react';
import {
    ChevronRight,
    Home,
    Download,
    X,
} from 'lucide-react';

const ResourceBreadcrumbs = ({
    currentPath,
    folders,
    selectedFile,
    selectedFileMeta,
    showUploadPanel,
    setSelectedFolderId,
    setSelectedFileId,
    setShowUploadPanel,
    setViewMode,
    handleDownload,
}) => {
    return (
        <div className="h-14 border-b border-border-primary bg-[#070B13] px-4 md:px-6 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-1 text-xs font-medium overflow-x-auto no-scrollbar pr-2 h-full">
                <button
                    onClick={() => {
                        if (folders.length > 0) {
                            setSelectedFolderId(folders[0].id);
                            setViewMode('EXPLORER');
                            setSelectedFileId(null);
                            setShowUploadPanel(false);
                        }
                    }}
                    className="p-1.5 hover:bg-white/5 rounded-lg text-text-secondary hover:text-white shrink-0"
                >
                    <Home size={14} />
                </button>
                {currentPath.map((crumb, idx) => (
                    <React.Fragment key={crumb.id || idx}>
                        <ChevronRight size={12} className="text-text-secondary opacity-30 shrink-0" />
                        <button
                            onClick={() => {
                                setSelectedFolderId(crumb.id);
                                setSelectedFileId(null);
                                setShowUploadPanel(false);
                            }}
                            className={`px-1.5 py-1 rounded-md transition-all whitespace-nowrap shrink-0 ${idx === currentPath.length - 1 && !selectedFile ? 'text-white font-bold' : 'text-text-secondary hover:text-white hover:bg-white/5'}`}
                        >
                            {crumb?.name}
                        </button>
                    </React.Fragment>
                ))}
                {selectedFile && (
                    <>
                        <ChevronRight size={12} className="text-text-secondary opacity-30 shrink-0" />
                        <div className="flex items-center gap-2 px-2.5 py-1.5 bg-accent-blue/10 border border-accent-blue/20 rounded-xl shrink-0 animate-in fade-in slide-in-from-left-2 duration-300">
                            <selectedFileMeta.icon size={14} className={selectedFileMeta.color} />
                            <span className="text-[11px] font-bold text-white tracking-tight">{selectedFile?.name}</span>
                            <button
                                onClick={() => setSelectedFileId(null)}
                                className="p-1 hover:bg-white/10 rounded-md text-text-secondary hover:text-white transition-all ml-1"
                            >
                                <X size={10} />
                            </button>
                        </div>
                    </>
                )}
                {showUploadPanel && (
                    <>
                        <ChevronRight size={12} className="text-text-secondary opacity-30 shrink-0" />
                        <span className="px-1.5 py-1 text-accent-blue font-black uppercase tracking-widest text-[10px]">Uploading...</span>
                    </>
                )}
            </div>

            {selectedFile && (
                <div className="flex items-center gap-2 animate-in fade-in slide-in-from-right-4 duration-300">
                    <button
                        onClick={() => handleDownload(selectedFile)}
                        className="p-2 bg-white/5 hover:bg-accent-blue/10 text-text-secondary hover:text-accent-blue rounded-xl transition-all border border-transparent hover:border-accent-blue/20 flex items-center gap-2"
                        title="Download File"
                    >
                        <Download size={14} />
                        <span className="text-[10px] font-black uppercase tracking-widest hidden sm:inline">Download</span>
                    </button>
                </div>
            )}
        </div>
    );
};

export default ResourceBreadcrumbs;
