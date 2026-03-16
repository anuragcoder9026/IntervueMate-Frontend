import React from 'react';
import { Image as ImageIcon, UploadCloud } from 'lucide-react';

const VisualIdentification = ({ groupData, updateGroupData }) => {
    const coverInputRef = React.useRef(null);
    const logoInputRef = React.useRef(null);

    const getInitials = (name) => {
        if (!name) return 'GP';
        const words = name.trim().split(' ');
        if (words.length >= 2) {
            return (words[0][0] + words[1][0]).toUpperCase();
        }
        return name.substring(0, 2).toUpperCase();
    };

    const handleFileChange = (e, type) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                updateGroupData({ [type]: reader.result });
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="mb-12 relative">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-black text-white flex items-center gap-2">
                    <ImageIcon size={24} className="text-accent-blue" />
                    Visual Assets
                </h2>
                <div className="px-3 py-1 bg-bg-secondary border border-border-primary rounded-full text-[10px] font-bold text-text-secondary flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent-blue"></span> Step 2
                </div>
            </div>

            <div className="bg-bg-secondary border border-border-primary rounded-2xl p-6 shadow-sm">
                <div className="flex flex-col sm:flex-row gap-6">
                    <div className="flex-1">
                        <label className="block text-[11px] font-bold text-text-secondary mb-3 uppercase tracking-wider">
                            Cover Image
                        </label>
                        <input
                            type="file"
                            ref={coverInputRef}
                            className="hidden"
                            accept="image/*"
                            onChange={(e) => handleFileChange(e, 'coverImage')}
                        />
                        <div
                            onClick={() => coverInputRef.current.click()}
                            className="relative h-40 w-full rounded-2xl overflow-hidden border-2 border-white/10 border-dashed bg-bg-primary hover:bg-white/5 transition-colors cursor-pointer group flex flex-col items-center justify-center p-0"
                        >
                            {groupData.coverImage ? (
                                <img src={groupData.coverImage} className="w-full h-full object-cover" alt="Cover" />
                            ) : (
                                <>
                                    <div className="w-12 h-12 bg-accent-blue/10 rounded-xl flex items-center justify-center text-accent-blue mb-3 group-hover:scale-110 transition-transform">
                                        <UploadCloud size={24} />
                                    </div>
                                    <span className="text-[10px] font-bold text-white uppercase tracking-widest bg-black/50 px-3 py-1 rounded-full backdrop-blur-sm">Click to Upload</span>
                                </>
                            )}
                        </div>
                    </div>

                    <div className="shrink-0 w-32">
                        <label className="block text-[11px] font-bold text-text-secondary mb-3 tracking-wider text-center uppercase">
                            Logo / Icon
                        </label>
                        <input
                            type="file"
                            ref={logoInputRef}
                            className="hidden"
                            accept="image/*"
                            onChange={(e) => handleFileChange(e, 'logo')}
                        />
                        <div
                            onClick={() => logoInputRef.current.click()}
                            className="relative h-40 w-32 rounded-2xl border-2 border-white/10 border-dashed bg-bg-primary hover:bg-white/5 transition-colors cursor-pointer flex flex-col items-center justify-center group mx-auto sm:mx-0 overflow-hidden p-0"
                        >
                            {groupData.logo ? (
                                <img src={groupData.logo} className="w-full h-full object-cover" alt="Logo" />
                            ) : (
                                <>
                                    <div className="w-16 h-16 rounded-full bg-accent-blue flex items-center justify-center text-white text-2xl font-bold mb-3 shadow-lg">
                                        {getInitials(groupData.name)}
                                    </div>
                                    <span className="text-[10px] text-text-secondary group-hover:text-white transition-colors uppercase tracking-widest">Change Icon</span>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VisualIdentification;
