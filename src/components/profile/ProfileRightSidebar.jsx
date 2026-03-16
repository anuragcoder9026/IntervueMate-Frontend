import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Sparkles, ArrowRight, UserPlus } from 'lucide-react';

const ProfileRightSidebar = () => {
    const navigate = useNavigate();

    return (
        <div className="w-full lg:w-[320px] shrink-0 space-y-6">
            {/* Create Your Group*/}
            <div className="bg-gradient-to-br from-blue-600 to-indigo-800 rounded-xl p-5 shadow-lg relative overflow-hidden group">
                <div className="absolute inset-0 bg-black/10 transition-opacity opacity-0 group-hover:opacity-100"></div>
                <div className="relative z-10 flex flex-col items-center text-center">
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center mb-3 text-white backdrop-blur-sm border border-white/30">
                        <Users size={20} />
                    </div>
                    <h3 className="text-sm font-bold text-white mb-1.5">Build Your Community</h3>
                    <p className="text-[10px] text-white/80 font-medium mb-4 max-w-[200px]">
                        Lead your own peer group and master interviews together.
                    </p>
                    <button onClick={() => navigate('/create-group')} className="px-5 py-1.5 bg-white text-indigo-900 rounded-full font-bold text-[11px] hover:bg-gray-100 transition-all shadow-lg active:scale-95">
                        Create Your Group
                    </button>
                </div>
            </div>

            {/* AI Snapshot */}
            <div className="bg-bg-secondary border border-border-primary rounded-xl p-5 shadow-sm">
                <div className="flex items-center justify-between mb-5">
                    <h3 className="flex items-center gap-2 text-sm font-bold text-white">
                        <Sparkles size={16} className="text-purple-400" /> AI Snapshot
                    </h3>
                    <span className="text-[9px] text-text-secondary uppercase tracking-widest font-black">Beta</span>
                </div>

                <div className="space-y-4 mb-6">
                    <div>
                        <div className="flex justify-between items-center mb-1 text-xs">
                            <span className="text-text-secondary">Communication</span>
                            <span className="text-emerald-400 font-bold text-[10px]">92/100</span>
                        </div>
                        <div className="w-full h-1.5 bg-bg-primary rounded-full overflow-hidden">
                            <div className="h-full bg-emerald-500 rounded-full w-[92%]"></div>
                        </div>
                    </div>
                    <div>
                        <div className="flex justify-between items-center mb-1 text-xs">
                            <span className="text-text-secondary">Technical Depth</span>
                            <span className="text-accent-blue font-bold text-[10px]">88/100</span>
                        </div>
                        <div className="w-full h-1.5 bg-bg-primary rounded-full overflow-hidden">
                            <div className="h-full bg-accent-blue rounded-full w-[88%]"></div>
                        </div>
                    </div>
                    <div>
                        <div className="flex justify-between items-center mb-1 text-xs">
                            <span className="text-text-secondary">Structure</span>
                            <span className="text-amber-500 font-bold text-[10px]">75/100</span>
                        </div>
                        <div className="w-full h-1.5 bg-bg-primary rounded-full overflow-hidden">
                            <div className="h-full bg-amber-500 rounded-full w-[75%]"></div>
                        </div>
                    </div>
                </div>

                <div className="bg-bg-primary p-4 rounded-lg border border-white/5 mb-4">
                    <p className="text-xs text-text-secondary italic leading-relaxed">
                        "Sarah consistently demonstrates strong system design principles but could improve structuring behavioral answers using the STAR method."
                    </p>
                </div>

                <button className="w-full text-right text-[10px] font-bold text-accent-blue hover:text-blue-400 flex items-center justify-end gap-1 group transition-colors">
                    View detailed report <ArrowRight size={10} className="group-hover:translate-x-0.5 transition-transform" />
                </button>
            </div>

            {/* Suggested for you */}
            <div className="bg-bg-secondary border border-border-primary rounded-xl p-5 shadow-sm">
                <h3 className="text-sm font-bold text-white mb-5">Suggested for you</h3>

                <div className="space-y-4">
                    {/* Suggestion 1 */}
                    <div className="flex items-center justify-between gap-3 group">
                        <div className="flex items-center gap-3 min-w-0">
                            <img src="https://ui-avatars.com/api/?name=David+Chen&background=f97316&color=fff" className="w-10 h-10 rounded-full shrink-0" alt="David" />
                            <div className="min-w-0">
                                <h4 className="text-xs font-bold text-white truncate group-hover:text-accent-blue transition-colors cursor-pointer">David Chen</h4>
                                <p className="text-[10px] text-text-secondary truncate mt-0.5">Product Manager @ Stripe</p>
                            </div>
                        </div>
                        <button className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border-primary text-white text-[10px] font-bold hover:bg-white/5 transition-colors">
                            <UserPlus size={12} /> Connect
                        </button>
                    </div>

                    {/* Suggestion 2 */}
                    <div className="flex items-center justify-between gap-3 group">
                        <div className="flex items-center gap-3 min-w-0">
                            <img src="https://ui-avatars.com/api/?name=Elena+Rodriguez&background=8b5cf6&color=fff" className="w-10 h-10 rounded-full shrink-0" alt="Elena" />
                            <div className="min-w-0">
                                <h4 className="text-xs font-bold text-white truncate group-hover:text-accent-blue transition-colors cursor-pointer">Elena Rodriguez</h4>
                                <p className="text-[10px] text-text-secondary truncate mt-0.5">Data Scientist @ Netflix</p>
                            </div>
                        </div>
                        <button className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border-primary text-white text-[10px] font-bold hover:bg-white/5 transition-colors">
                            <UserPlus size={12} /> Connect
                        </button>
                    </div>

                    {/* Suggestion 3 */}
                    <div className="flex items-center justify-between gap-3 group">
                        <div className="flex items-center gap-3 min-w-0">
                            <img src="https://ui-avatars.com/api/?name=Michael+Kim&background=8b5cf6&color=fff" className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center shrink-0 border border-white/10" alt="Michael" />
                            <div className="min-w-0">
                                <h4 className="text-xs font-bold text-white truncate group-hover:text-accent-blue transition-colors cursor-pointer">Michael Kim</h4>
                                <p className="text-[10px] text-text-secondary truncate mt-0.5">Student @ MIT</p>
                            </div>
                        </div>
                        <button className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border-primary text-white text-[10px] font-bold hover:bg-white/5 transition-colors">
                            <UserPlus size={12} /> Connect
                        </button>
                    </div>
                </div>

                <button className="w-full mt-5 pt-4 text-center text-[10px] font-bold text-text-secondary hover:text-white flex items-center justify-center gap-1 group transition-colors border-t border-border-primary/30">
                    View all suggestions <ArrowRight size={10} className="group-hover:translate-x-0.5 transition-transform" />
                </button>
            </div>

        </div>
    );
};

export default ProfileRightSidebar;
