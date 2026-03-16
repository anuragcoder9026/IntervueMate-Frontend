import React from 'react';
import { Shield, EyeOff } from 'lucide-react';

const SecurityAccess = ({ privacy, setPrivacy, onSubmit, isCreating }) => {
    return (
        <div className="mb-12 relative">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-black text-white flex items-center gap-2">
                    <Shield size={24} className="text-accent-blue" />
                    Security Access
                </h2>
                <div className="px-3 py-1 bg-bg-secondary border border-border-primary rounded-full text-[10px] font-bold text-text-secondary flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent-blue"></span> Step 4
                </div>
            </div>

            <div className="bg-bg-secondary border border-border-primary rounded-2xl p-6 shadow-sm mb-12">
                <div className="space-y-4">
                    {/* Public Group Toggle */}
                    <div
                        onClick={() => setPrivacy('public')}
                        className={`bg-bg-primary border ${privacy === 'public' ? 'border-accent-blue/50' : 'border-white/5'} rounded-xl p-5 flex items-center justify-between gap-4 cursor-pointer transition-all`}
                    >
                        <div className="flex items-center gap-4 flex-1">
                            <div className={`w-10 h-10 ${privacy === 'public' ? 'bg-accent-blue/20 text-accent-blue' : 'bg-white/5 text-text-secondary'} rounded-xl flex items-center justify-center shrink-0 transition-colors`}>
                                <Shield size={18} />
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-white mb-1">Public Group</h4>
                                <p className="text-[11px] text-text-secondary leading-relaxed pr-4">Anyone can discover and join the community.</p>
                            </div>
                        </div>
                        <div className="shrink-0 flex items-center">
                            <div className={`w-12 h-6 ${privacy === 'public' ? 'bg-accent-blue' : 'bg-white/10'} rounded-full flex items-center px-1 transition-colors`}>
                                <div className={`w-4 h-4 bg-white rounded-full transition-transform shadow-md ${privacy === 'public' ? 'translate-x-6' : 'translate-x-0'}`}></div>
                            </div>
                        </div>
                    </div>

                    {/* Private Mode */}
                    <div
                        onClick={() => setPrivacy('private')}
                        className={`bg-bg-primary border ${privacy === 'private' ? 'border-accent-blue/50' : 'border-white/5'} rounded-xl p-5 flex items-center justify-between gap-4 cursor-pointer transition-all`}
                    >
                        <div className="flex items-center gap-4 flex-1">
                            <div className={`w-10 h-10 ${privacy === 'private' ? 'bg-accent-blue/20 text-accent-blue' : 'bg-white/5 text-text-secondary'} rounded-xl flex items-center justify-center shrink-0 transition-colors`}>
                                <EyeOff size={18} />
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-white mb-1">Private Mode</h4>
                                <p className="text-[11px] text-text-secondary leading-relaxed pr-4">Only invited members can join and view content.</p>
                            </div>
                        </div>
                        <div className="shrink-0 flex items-center">
                            <div className={`w-12 h-6 ${privacy === 'private' ? 'bg-accent-blue' : 'bg-white/10'} rounded-full flex items-center px-1 transition-colors`}>
                                <div className={`w-4 h-4 bg-white rounded-full transition-transform shadow-md ${privacy === 'private' ? 'translate-x-6' : 'translate-x-0'}`}></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Launch Actions */}
            <div className="flex justify-end gap-4 px-2">
                <button className="px-6 py-3 rounded-xl font-bold text-sm text-text-secondary hover:text-white transition-colors">
                    Cancel
                </button>
                <button
                    onClick={onSubmit}
                    disabled={isCreating}
                    className="px-8 py-3 bg-accent-blue hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl text-white text-sm font-bold transition-all active:scale-95 shadow-lg shadow-accent-blue/30 flex items-center gap-2"
                >
                    {isCreating ? (
                        <>
                            <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                            Creating...
                        </>
                    ) : (
                        'Create Community'
                    )}
                </button>
            </div>
        </div>
    );
};

export default SecurityAccess;
