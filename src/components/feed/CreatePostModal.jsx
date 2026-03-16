import React, { useState, useRef, useEffect } from 'react';
import { X, Image, FileText, Link, Sparkles, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { useSelector } from 'react-redux';
const CreatePostModal = ({ isOpen, onClose, onPost, isLoading }) => {
    const [content, setContent] = useState('');
    const [isFocused, setIsFocused] = useState(false);
    const [attachments, setAttachments] = useState([]);
    const [isRephrasing, setIsRephrasing] = useState(false);
    const [showLinkInput, setShowLinkInput] = useState(false);
    const [linkUrl, setLinkUrl] = useState('');
    const [tags, setTags] = useState([]);
    const [tagInput, setTagInput] = useState('');
    const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
    const textareaRef = useRef(null);
    const mediaInputRef = useRef(null);
    const fileInputRef = useRef(null);
    const { user } = useSelector((state) => state.auth);
    // Auto-resize the textarea
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${Math.max(120, textareaRef.current.scrollHeight)}px`;
        }
    }, [content]);

    // Clear fields when modal closes
    useEffect(() => {
        if (!isOpen) {
            setContent('');
            setAttachments([]);
            setTags([]);
            setTagInput('');
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) onClose();
    };

    const handlePostClick = () => {
        if (!content.trim() && attachments.length === 0) return;
        onPost(content.trim() || 'Check out my attachment!', attachments, tags);
    };

    const handleHashtagClick = (tag) => {
        const cleanTag = tag.replace(/^#/, '');
        if (!tags.includes(cleanTag)) {
            setTags(prev => [...prev, cleanTag]);
        }
    };

    const handleTagInputKeyDown = (e) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            const newTag = tagInput.trim().replace(/^#/, '');
            if (newTag && !tags.includes(newTag)) {
                setTags(prev => [...prev, newTag]);
            }
            setTagInput('');
        }
    };

    const removeTag = (tagToRemove) => {
        setTags(prev => prev.filter(tag => tag !== tagToRemove));
    };

    const handleAIRephrase = () => {
        setIsRephrasing(true);
        setTimeout(() => {
            setContent(prev => prev + '\n\n✨ (Rephrased professionally: "Here is a polished update on my interview prep journey!")');
            setIsRephrasing(false);
        }, 1500);
    };

    const handleFileChange = (e, type) => {
        const files = Array.from(e.target.files);
        if (!files || files.length === 0) return;

        const newAttachments = files.map(file => ({
            type: type,
            name: file.name,
            file: file,
            previewUrl: type === 'image' ? URL.createObjectURL(file) : null
        }));

        setAttachments(prev => {
            const updated = [...prev, ...newAttachments];
            if (type === 'image') {
                const totalImages = updated.filter(a => a.type === 'image').length;
                if (totalImages > 0) {
                    setCurrentMediaIndex(totalImages - 1);
                }
            }
            return updated;
        });

        e.target.value = ''; // Reset
    };

    const handleAddMedia = () => {
        mediaInputRef.current?.click();
    };

    const handleAddFile = () => {
        fileInputRef.current?.click();
    };

    const handleAddLink = () => {
        setShowLinkInput(true);
    };

    const submitLink = () => {
        if (linkUrl.trim()) {
            setAttachments(prev => [...prev, { type: 'link', url: linkUrl.trim() }]);
        }
        setLinkUrl('');
        setShowLinkInput(false);
    };

    const removeAttachment = (index) => {
        setAttachments(prev => {
            const newAttachments = prev.filter((_, i) => i !== index);
            const remainingImages = newAttachments.filter(a => a.type === 'image').length;
            if (currentMediaIndex >= remainingImages && remainingImages > 0) {
                setCurrentMediaIndex(remainingImages - 1);
            }
            return newAttachments;
        });
    };

    return (
        <div
            onClick={handleBackdropClick}
            className="fixed inset-0 z-[99999] flex items-start sm:items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm pt-20 sm:pt-4 transition-all"
        >
            <div className="bg-[#171c28] border border-white/10 rounded-2xl w-full max-w-[600px] shadow-2xl shadow-black/50 overflow-hidden flex flex-col max-h-[90vh]">

                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
                    <h2 className="text-xl font-bold text-white tracking-tight">Create a post</h2>
                    <button
                        onClick={onClose}
                        className="p-2 -mr-2 text-text-secondary hover:text-white hover:bg-white/5 rounded-full transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Profile Banner */}
                <div className="px-6 py-4 flex items-center gap-4">
                    <img
                        src={user?.avatar || "https://ui-avatars.com/api/?name=Me&background=random"}
                        className="w-12 h-12 rounded-full border-2 border-accent-blue/20"
                        alt="Me"
                    />
                    <div>
                        <h3 className="font-bold text-white text-base leading-tight">{user.name}</h3>
                    </div>
                </div>

                {/* Body Content Area */}
                <div className="px-6 pb-2 overflow-y-auto no-scrollbar flex-1 relative min-h-[140px]">
                    <textarea
                        ref={textareaRef}
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        placeholder="Share your interview experience, tips, or ask a question..."
                        className="w-full bg-transparent text-white text-base sm:text-lg leading-relaxed resize-none focus:outline-none placeholder:text-[#a3aed0]/50 placeholder:font-normal mt-2"
                        autoFocus
                    />

                    {/* AI Rephrase helper prompt if content is typed */}
                    {content.length > 5 && (
                        <button
                            onClick={handleAIRephrase}
                            disabled={isRephrasing}
                            className="flex items-center gap-2 mt-4 text-accent-blue hover:text-blue-400 font-bold text-xs bg-accent-blue/10 hover:bg-accent-blue/20 px-3 py-1.5 rounded-full transition-colors border border-accent-blue/10 w-fit cursor-pointer group mb-4 disabled:opacity-50 disabled:cursor-wait"
                        >
                            <Sparkles size={14} className={isRephrasing ? "animate-spin" : "group-hover:animate-pulse"} />
                            {isRephrasing ? 'Rephrasing...' : 'Rephrase with AI Assistant'}
                        </button>
                    )}

                    {/* Attachments Preview Area */}
                    {attachments.length > 0 && (
                        <div className="flex flex-col gap-3 mb-4 mt-2">
                            {/* Image Carousel for multiple images */}
                            {attachments.filter(a => a.type === 'image').length > 0 && (() => {
                                const images = attachments.filter(a => a.type === 'image');
                                const activeIndex = Math.max(0, Math.min(currentMediaIndex, images.length - 1));

                                return (
                                    <div className="relative group w-full rounded-2xl overflow-hidden border border-white/10 bg-black/40 shadow-2xl">
                                        <div className="relative aspect-video flex items-center justify-center bg-black/20">
                                            <img
                                                src={images[activeIndex]?.previewUrl}
                                                alt={images[activeIndex]?.name}
                                                className="max-w-full max-h-full object-contain transition-all duration-300"
                                            />

                                            {/* Navigation Arrows */}
                                            {images.length > 1 && (
                                                <>
                                                    <button
                                                        onClick={() => setCurrentMediaIndex(prev => (prev - 1 + images.length) % images.length)}
                                                        className="absolute left-3 p-2 rounded-full bg-black/60 text-white/90 hover:text-white hover:bg-black/80 transition-all backdrop-blur-md border border-white/10 z-10"
                                                    >
                                                        <ChevronLeft size={20} />
                                                    </button>
                                                    <button
                                                        onClick={() => setCurrentMediaIndex(prev => (prev + 1) % images.length)}
                                                        className="absolute right-3 p-2 rounded-full bg-black/60 text-white/90 hover:text-white hover:bg-black/80 transition-all backdrop-blur-md border border-white/10 z-10"
                                                    >
                                                        <ChevronRight size={20} />
                                                    </button>

                                                    {/* Counter */}
                                                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[10px] font-bold border border-white/10">
                                                        {activeIndex + 1} / {images.length}
                                                    </div>
                                                </>
                                            )}

                                            {/* Remove Button */}
                                            <button
                                                onClick={() => {
                                                    const imgToRemove = images[activeIndex];
                                                    const mainIdx = attachments.indexOf(imgToRemove);
                                                    removeAttachment(mainIdx);
                                                }}
                                                className="absolute top-3 right-3 p-2 rounded-full bg-black/60 text-white/90 hover:text-white hover:bg-red-500/80 transition-all backdrop-blur-md shadow-lg z-10"
                                            >
                                                <X size={16} />
                                            </button>
                                        </div>
                                    </div>
                                );
                            })()}

                            {/* Other Attachments (Files/Links) */}
                            {attachments.filter(a => a.type !== 'image').map((att, idx) => (
                                <div key={`other-${idx}`} className="relative group border border-white/10 rounded-xl p-3 bg-black/20 flex items-center gap-3 w-full">
                                    <div className="p-2 rounded-lg bg-white/5">
                                        {att.type === 'file' && <FileText size={20} className="text-emerald-500" />}
                                        {att.type === 'link' && <Link size={20} className="text-amber-500" />}
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm text-white font-medium truncate">
                                            {att.type === 'file' ? att.name : att.url}
                                        </p>
                                    </div>

                                    <button
                                        onClick={() => {
                                            const mainIdx = attachments.indexOf(att);
                                            removeAttachment(mainIdx);
                                        }}
                                        className="p-1.5 rounded-full bg-white/10 text-text-secondary hover:text-white hover:bg-red-500/80 transition-colors"
                                    >
                                        <X size={14} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Custom Tags Section */}
                <div className="px-6 pb-4 border-t border-white/5 pt-4">
                    <div className="flex flex-wrap items-center gap-2">
                        {tags.map(tag => (
                            <span key={tag} className="flex items-center gap-1 text-accent-blue font-bold text-xs bg-accent-blue/10 px-2.5 py-1 rounded-md">
                                #{tag}
                                <button onClick={() => removeTag(tag)} className="hover:text-red-400 p-0.5 rounded-full"><X size={10} /></button>
                            </span>
                        ))}
                        <input
                            type="text"
                            placeholder={tags.length === 0 ? "Add tags (press Enter)..." : "Add another..."}
                            value={tagInput}
                            onChange={(e) => setTagInput(e.target.value)}
                            onKeyDown={handleTagInputKeyDown}
                            className="bg-transparent text-xs text-white placeholder:text-white/30 focus:outline-none min-w-[150px]"
                        />
                    </div>
                    {/* Suggestions */}
                    {content.length > 0 && tags.length < 3 && (
                        <div className="flex flex-wrap items-center gap-2 mt-3 text-xs">
                            <span className="text-text-secondary">Related:</span>
                            {['#SystemDesign', '#InterviewPrep', '#Algorithms', '#ReactJS'].filter(t => !tags.includes(t.replace('#', ''))).map(tag => (
                                <button
                                    key={tag}
                                    onClick={() => handleHashtagClick(tag)}
                                    className="text-white/60 font-bold text-[11px] hover:text-accent-blue hover:bg-accent-blue/10 px-2 py-1 rounded transition-colors"
                                >
                                    {tag}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Inline Link Input */}
                {showLinkInput && (
                    <div className="px-6 pb-4">
                        <div className="flex items-center gap-2 bg-black/20 border border-accent-blue/30 rounded-lg p-2">
                            <Link size={16} className="text-text-secondary ml-1" />
                            <input
                                type="url"
                                autoFocus
                                placeholder="Paste or type a link here..."
                                value={linkUrl}
                                onChange={(e) => setLinkUrl(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && submitLink()}
                                className="flex-1 bg-transparent text-sm text-white focus:outline-none placeholder:text-white/30"
                            />
                            <button onClick={submitLink} className="text-xs font-bold text-accent-blue hover:text-white hover:bg-accent-blue rounded-md px-3 py-1 transition-all">
                                Add
                            </button>
                            <button onClick={() => setShowLinkInput(false)} className="text-text-secondary hover:text-red-400 p-1">
                                <X size={16} />
                            </button>
                        </div>
                    </div>
                )}

                {/* Actions Toolbar */}
                <div className="px-4 py-3 border-t border-white/5 bg-[#0F1523]/50 flex items-center justify-between">
                    <div className="flex items-center gap-1">
                        <button onClick={handleAddMedia} className="p-3 text-text-secondary hover:text-accent-blue hover:bg-accent-blue/10 rounded-full transition-colors group relative tooltip-trigger">
                            <Image size={22} className="group-hover:scale-110 transition-transform" />
                            <span className="absolute -top-8 left-1/2 -translate-x-1/2 text-[10px] font-bold bg-black text-white px-2 py-1 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">Add Media</span>
                        </button>
                        <button onClick={handleAddFile} className="p-3 text-text-secondary hover:text-emerald-500 hover:bg-emerald-500/10 rounded-full transition-colors group relative tooltip-trigger">
                            <FileText size={22} className="group-hover:scale-110 transition-transform" />
                            <span className="absolute -top-8 left-1/2 -translate-x-1/2 text-[10px] font-bold bg-black text-white px-2 py-1 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">Add Document</span>
                        </button>
                        <button onClick={handleAddLink} className="p-3 text-text-secondary hover:text-amber-500 hover:bg-amber-500/10 rounded-full transition-colors group relative tooltip-trigger">
                            <Link size={22} className="group-hover:scale-110 transition-transform" />
                            <span className="absolute -top-8 left-1/2 -translate-x-1/2 text-[10px] font-bold bg-black text-white px-2 py-1 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">Add Link</span>
                        </button>
                    </div>

                    {/* Hidden Native File Inputs */}
                    <input
                        type="file"
                        ref={mediaInputRef}
                        onChange={(e) => handleFileChange(e, 'image')}
                        accept="image/*,video/*"
                        className="hidden"
                        multiple
                    />
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={(e) => handleFileChange(e, 'file')}
                        accept=".pdf,.doc,.docx,.txt"
                        className="hidden"
                        multiple
                    />

                    <button
                        onClick={handlePostClick}
                        disabled={(!content.trim() && attachments.length === 0) || isLoading}
                        className={`px-6 py-2 rounded-full font-bold text-sm shadow-xl transition-all active:scale-95 flex items-center gap-2 ${(content.trim() || attachments.length > 0)
                            ? 'bg-accent-blue text-white shadow-accent-blue/20 hover:bg-blue-600'
                            : 'bg-white/5 text-text-secondary shadow-none cursor-not-allowed border border-white/5'
                            } ${isLoading ? 'opacity-80 cursor-wait' : ''}`}
                    >
                        {isLoading && <Loader2 size={16} className="animate-spin" />}
                        {isLoading ? 'Posting' : 'Post'}
                    </button>
                </div>

            </div>
        </div>
    );
};

export default CreatePostModal;
