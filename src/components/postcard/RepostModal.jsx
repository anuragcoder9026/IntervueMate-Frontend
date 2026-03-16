import React, { useState } from 'react';
import { X, Send, Repeat } from 'lucide-react';

const RepostModal = ({ isOpen, onClose, onRepost, isSubmitting }) => {
    const [content, setContent] = useState('');

    if (!isOpen) return null;

    const handleSubmit = () => {
        onRepost(content);
        setContent('');
    };

    const charCount = content.length;
    const maxChars = 280;

    return (
        <div className="absolute bottom-[70px] right-2 sm:right-4 left-2 sm:left-auto sm:w-[380px] z-[99999] animate-in fade-in slide-in-from-bottom-4 duration-300">
            {/* Glassmorphic Container */}
            <div className="relative bg-bg-secondary/90 backdrop-blur-2xl rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/10 overflow-hidden">
                {/* Premium Gradient Top Border */}
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-accent-blue to-transparent opacity-50"></div>

                <div className="flex items-center justify-between p-4 border-b border-white/5 bg-white/[0.02]">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-accent-blue/10 flex items-center justify-center">
                            <Repeat size={16} className="text-accent-blue" />
                        </div>
                        <div>
                            <h3 className="text-white font-bold text-sm tracking-tight">Repost with thoughts</h3>
                            <p className="text-[10px] text-text-secondary font-medium uppercase tracking-wider">Sharing to your profile</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1.5 hover:bg-white/5 rounded-lg transition-colors group/close"
                    >
                        <X size={18} className="text-text-secondary group-hover/close:text-white" />
                    </button>
                </div>

                <div className="p-4">
                    <div className="relative bg-white/[0.03] rounded-xl border border-white/5 focus-within:border-accent-blue/30 transition-all">
                        <textarea
                            autoFocus
                            placeholder="What's on your mind about this?"
                            className="w-full bg-transparent border-none outline-none text-white text-sm focus:ring-0 resize-none h-32 p-3 placeholder-text-secondary/30 font-medium leading-relaxed"
                            value={content}
                            maxLength={maxChars}
                            onChange={(e) => setContent(e.target.value)}
                        ></textarea>

                        {/* Progress bar for character count */}
                        <div className="absolute bottom-0 left-0 h-0.5 bg-accent-blue transition-all duration-300 rounded-full"
                            style={{ width: `${(charCount / maxChars) * 100}%`, opacity: charCount > 0 ? 1 : 0 }}></div>
                    </div>

                    <div className="mt-3 flex items-center justify-between">
                        <div className={`text-[10px] font-bold ${charCount > maxChars - 20 ? 'text-rose-500' : 'text-text-secondary'}`}>
                            {charCount}/{maxChars}
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                onClick={onClose}
                                className="px-4 py-2 text-xs font-bold text-text-secondary hover:text-white transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSubmit}
                                disabled={isSubmitting}
                                className="px-5 py-2 bg-accent-blue hover:bg-blue-600 disabled:bg-blue-600/50 text-white font-bold rounded-xl active:scale-95 transition-all text-xs flex items-center gap-2 shadow-lg shadow-accent-blue/20"
                            >
                                {isSubmitting ? (
                                    <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                ) : <Send size={14} />}
                                {isSubmitting ? 'Posting...' : 'Repost Now'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Decoration: Subtle glow behind */}
            <div className="absolute -z-10 inset-0 bg-accent-blue/5 blur-3xl rounded-full opacity-30"></div>
        </div>
    );
};

export default RepostModal;
