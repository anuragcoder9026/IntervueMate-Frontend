import React from 'react';
import {
    FileText,
    Folder,
    Upload,
    AtSign,
    Tag,
    RotateCcw,
} from 'lucide-react';

const UploadPanel = ({
    currentPath,
    uploadFileData,
    setUploadFileData,
    fileInputRef,
    handleFinalizeUpload,
    resourceLoading,
    setShowUploadPanel,
}) => {
    return (
        <div className="max-w-4xl mx-auto py-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="mb-8 pl-1">
                <h2 className="text-xl font-black text-white tracking-tight leading-none mb-1.5 uppercase">Upload Resources</h2>
                <p className="text-[10px] text-text-secondary font-medium tracking-wide opacity-60 uppercase flex items-center gap-2">
                    <Folder size={12} /> Target: {currentPath.map(p => p?.name).join(' / ')}
                </p>
            </div>

            <div className="space-y-6">
                {/* Drop Zone Area */}
                <div className="bg-[#0A0F1A] border-2 border-dashed border-border-primary/50 rounded-2xl p-12 flex flex-col items-center justify-center transition-all hover:border-accent-blue/40 group relative overflow-hidden">
                    <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        onChange={(e) => {
                            const file = e.target.files[0];
                            if (file) {
                                const sizeStr = file.size > 1024 * 1024
                                    ? (file.size / (1024 * 1024)).toFixed(1) + ' MB'
                                    : (file.size / 1024).toFixed(1) + ' KB';

                                setUploadFileData(prev => ({
                                    ...prev,
                                    originalFileName: file?.name,
                                    fileSelected: true,
                                    size: sizeStr
                                }));
                            }
                        }}
                    />
                    <div className="absolute inset-0 bg-accent-blue/5 opacity-0 group-hover:opacity-100 transition-opacity" />

                    <div className="w-14 h-14 rounded-full bg-accent-blue/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 relative z-10">
                        <Upload size={24} className="text-accent-blue" />
                    </div>

                    <h3 className="text-lg font-bold text-white mb-1.5 relative z-10">Upload sources</h3>
                    <p className="text-sm text-text-secondary mb-4 relative z-10">
                        Drag & drop or <span
                            onClick={(e) => {
                                e.stopPropagation();
                                fileInputRef.current?.click();
                            }}
                            className="text-accent-blue font-bold cursor-pointer hover:underline"
                        >choose file</span> to upload
                    </p>

                    {uploadFileData.fileSelected && (
                        <div className="bg-accent-blue/10 px-4 py-2.5 rounded-xl border border-accent-blue/20 mb-6 flex items-center gap-3 relative z-10 animate-in fade-in slide-in-from-top-2 duration-300 group/file">
                            <div className="w-8 h-8 rounded-lg bg-accent-blue/20 flex items-center justify-center text-accent-blue">
                                <FileText size={16} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-[10px] font-black text-accent-blue uppercase tracking-widest mb-0.5">Ready to upload</p>
                                <p className="text-[11px] font-bold text-white truncate pr-2">
                                    {uploadFileData.originalFileName}
                                </p>
                            </div>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    fileInputRef.current?.click();
                                }}
                                className="p-2 hover:bg-accent-blue/20 rounded-lg text-accent-blue transition-colors"
                                title="Change file"
                            >
                                <RotateCcw size={14} />
                            </button>
                        </div>
                    )}

                    <div className="text-[10px] font-black uppercase tracking-[0.2em] text-text-secondary opacity-40 relative z-10 text-center">
                        Supported file types: PDF, TXT, Markdown, DOCX, Video(.mp4, .mov)
                    </div>
                </div>

                {/* Metadata Section */}
                <div className="bg-[#0A0F1A] border border-border-primary rounded-2xl p-6 md:p-8 shadow-xl">
                    <form onSubmit={handleFinalizeUpload} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-text-secondary uppercase tracking-widest ml-1">Title</label>
                                <div className="relative">
                                    <AtSign size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary" />
                                    <input
                                        autoFocus
                                        type="text"
                                        value={uploadFileData.title}
                                        onChange={e => setUploadFileData({ ...uploadFileData, title: e.target.value })}
                                        placeholder="Enter resource title"
                                        className="w-full bg-[#070B13] border border-border-primary rounded-xl pl-10 pr-4 py-3 text-xs text-white focus:outline-none focus:border-accent-blue/50 focus:ring-4 focus:ring-accent-blue/5 transition-all font-bold"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-text-secondary uppercase tracking-widest ml-1">Tags</label>
                                <div className="relative">
                                    <Tag size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary" />
                                    <input
                                        type="text"
                                        value={uploadFileData.tags}
                                        onChange={e => setUploadFileData({ ...uploadFileData, tags: e.target.value })}
                                        placeholder="e.g. dsa, code, prep"
                                        className="w-full bg-[#070B13] border border-border-primary rounded-xl pl-10 pr-4 py-3 text-xs text-white focus:outline-none focus:border-accent-blue/50 focus:ring-4 focus:ring-accent-blue/5 transition-all"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-text-secondary uppercase tracking-widest ml-1">Description</label>
                            <textarea
                                rows={3}
                                value={uploadFileData.description}
                                onChange={e => setUploadFileData({ ...uploadFileData, description: e.target.value })}
                                placeholder="Add a proper brief description about this resource so that user can search it efficiently"
                                className="w-full bg-[#070B13] border border-border-primary rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-accent-blue/50 focus:ring-4 focus:ring-accent-blue/5 transition-all resize-none min-h-[100px]"
                            />
                        </div>

                        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-2 border-t border-border-primary/30 mt-4">

                            <div className="flex gap-3 w-full md:w-auto">
                                <button
                                    type="button"
                                    onClick={() => setShowUploadPanel(false)}
                                    className="flex-1 md:flex-none px-6 py-2.5 bg-white/5 hover:bg-white/10 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={resourceLoading}
                                    className="flex-1 md:flex-none px-8 py-2.5 bg-accent-blue hover:bg-blue-600 disabled:bg-accent-blue/50 disabled:cursor-not-allowed text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-xl shadow-accent-blue/20 flex items-center justify-center gap-2"
                                >
                                    {resourceLoading ? (
                                        <>
                                            <div className="w-3 h-3 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                            Uploading...
                                        </>
                                    ) : (
                                        "Upload"
                                    )}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>

                <div className="flex justify-center gap-6 opacity-30 mt-4">
                    <span className="text-[9px] font-bold text-text-secondary tracking-widest uppercase flex items-center gap-1.5">
                        <div className="w-1 h-1 bg-accent-blue rounded-full" /> {uploadFileData?.name}
                    </span>
                    <span className="text-[9px] font-bold text-text-secondary tracking-widest uppercase flex items-center gap-1.5">
                        <div className="w-1 h-1 bg-emerald-500 rounded-full" /> Secure link
                    </span>
                </div>
            </div>
        </div>
    );
};

export default UploadPanel;
