import React from 'react';
import { X, AlertTriangle, Trash2, Loader2 } from 'lucide-react';

const DeleteConfirmModal = ({ isOpen, onClose, onConfirm, title, message, isLoading }) => {
    if (!isOpen) return null;

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) onClose();
    };

    return (
        <div
            onClick={handleBackdropClick}
            className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-all"
        >
            <div className="bg-[#171c28] border border-white/10 rounded-2xl w-full max-w-[400px] shadow-2xl shadow-black/50 overflow-hidden flex flex-col animate-scale-in">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-red-500/5">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-red-500/10 rounded-lg">
                            <AlertTriangle size={20} className="text-red-500" />
                        </div>
                        <h2 className="text-lg font-bold text-white tracking-tight">{title || 'Confirm Deletion'}</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 -mr-2 text-text-secondary hover:text-white hover:bg-white/5 rounded-full transition-colors"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Body */}
                <div className="px-6 py-6">
                    <p className="text-sm text-text-secondary leading-relaxed text-center">
                        {message || 'Are you sure you want to delete this? This action cannot be undone and will permanently remove the data.'}
                    </p>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 bg-[#0F1523]/50 flex items-center gap-3 border-t border-white/5">
                    <button
                        onClick={onClose}
                        disabled={isLoading}
                        className="flex-1 px-4 py-2.5 rounded-xl font-bold text-xs text-text-secondary hover:text-white hover:bg-white/5 transition-all active:scale-95 disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={isLoading}
                        className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 shadow-lg shadow-red-600/20 active:scale-95 disabled:opacity-50"
                    >
                        {isLoading ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                        {isLoading ? 'Deleting...' : 'Delete Now'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteConfirmModal;
