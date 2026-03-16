import React from 'react';
import { Image as ImageIcon, UploadCloud } from 'lucide-react';

const VisualAssetsForm = ({ groupData, updateGroupData }) => {
    // Generate initials for the logo if not uploaded
    const getInitials = (name) => {
        if (!name) return 'GP';
        const words = name.trim().split(' ');
        if (words.length >= 2) {
            return (words[0][0] + words[1][0]).toUpperCase();
        }
        return name.substring(0, 2).toUpperCase();
    };

    return (
        <div className="bg-bg-secondary border border-border-primary rounded-xl p-6 shadow-sm mt-6">
            <div className="flex items-center gap-2 mb-6 text-white font-bold text-lg">
                <ImageIcon size={20} className="text-accent-blue" />
                <h2>Visual Assets</h2>
            </div>

            <div className="flex flex-col sm:flex-row gap-6">
                <div className="flex-1">
                    <label className="block text-xs font-bold text-text-secondary mb-2 uppercase tracking-wider">
                        Cover Image
                    </label>
                    <div className="relative h-32 w-full rounded-xl overflow-hidden border border-white/10 border-dashed bg-bg-primary hover:bg-white/5 transition-colors cursor-pointer group flex flex-col items-center justify-center">
                        <div className="w-10 h-10 bg-accent-blue/10 rounded-full flex items-center justify-center text-accent-blue mb-2 group-hover:scale-110 transition-transform">
                            <UploadCloud size={20} />
                        </div>
                        <p className="text-xs font-bold text-white">Click to upload or drag and drop</p>
                        <p className="text-[10px] text-text-secondary mt-1">SVG, PNG, JPG or GIF (max. 800x400px)</p>
                    </div>
                </div>

                <div className="shrink-0 w-32">
                    <label className="block text-xs font-bold text-text-secondary mb-2 uppercase tracking-wider text-center">
                        Logo / Icon
                    </label>
                    <div className="relative h-32 w-32 rounded-xl border border-white/10 border-dashed bg-bg-primary hover:bg-white/5 transition-colors cursor-pointer flex flex-col items-center justify-center group mx-auto sm:mx-0">
                        <div className="w-16 h-16 rounded-full bg-accent-blue flex items-center justify-center text-white text-xl font-bold mb-2 shadow-lg">
                            {getInitials(groupData.name)}
                        </div>
                        <p className="text-[10px] text-text-secondary group-hover:text-white transition-colors">Change Icon</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VisualAssetsForm;
