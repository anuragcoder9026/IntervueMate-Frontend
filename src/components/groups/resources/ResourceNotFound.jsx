import React from 'react';
import { X } from 'lucide-react';

const ResourceNotFound = ({ onGoBack }) => {
    return (
        <div className="h-screen bg-[#070B13] flex flex-col items-center justify-center p-6 text-center">
            <div className="w-20 h-20 bg-rose-500/10 rounded-full flex items-center justify-center mb-6">
                <X size={32} className="text-rose-500" />
            </div>
            <h2 className="text-xl font-black text-white uppercase tracking-tight mb-2">Resource Not Found</h2>
            <p className="text-text-secondary mb-8 text-xs uppercase tracking-widest opacity-60">The group or resource you're looking for doesn't exist.</p>
            <button onClick={onGoBack} className="px-8 py-3 bg-white/5 text-white rounded-xl text-[10px] font-black uppercase tracking-widest border border-white/5">Return Home</button>
        </div>
    );
};

export default ResourceNotFound;
