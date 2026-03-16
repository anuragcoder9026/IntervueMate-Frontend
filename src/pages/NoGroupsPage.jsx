import React from 'react';
import Navbar from '../components/Navbar';
import { Users, Compass, ArrowRight, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const NoGroupsPage = () => {
    const navigate = useNavigate();

    return (
        <div className="bg-bg-primary min-h-screen text-text-primary">
            <Navbar />

            <div className="max-w-2xl mx-auto px-4 py-20 flex flex-col items-center text-center">
                {/* Icon */}
                <div className="relative mb-8">
                    <div className="w-28 h-28 bg-gradient-to-br from-accent-blue/10 to-purple-500/10 rounded-full flex items-center justify-center border border-accent-blue/20">
                        <Users size={48} className="text-accent-blue/60" />
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-10 h-10 bg-bg-secondary border-2 border-border-primary rounded-full flex items-center justify-center">
                        <Sparkles size={18} className="text-amber-400" />
                    </div>
                </div>

                {/* Title */}
                <h1 className="text-3xl font-bold text-white mb-3 font-outfit tracking-tight">
                    You Haven't Joined Any Groups Yet
                </h1>
                <p className="text-text-secondary text-sm max-w-md leading-relaxed mb-10">
                    Groups are the best way to connect with like-minded peers, share resources,
                    and prepare for interviews together. Discover communities that match your interests!
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row items-center gap-4 w-full max-w-sm">
                    <button
                        onClick={() => navigate('/groups')}
                        className="w-full sm:flex-1 px-3 py-3.5 bg-accent-blue hover:bg-blue-600 text-white rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2.5 shadow-lg shadow-accent-blue/20 active:scale-95"
                    >
                       
                        Discover Groups
                        <ArrowRight size={16} />
                    </button>
                    <button
                        onClick={() => navigate('/feed')}
                        className="w-full sm:flex-1 px-6 py-3.5 bg-bg-secondary border border-border-primary text-text-primary hover:text-white hover:border-white/10 rounded-xl font-bold text-sm transition-all active:scale-95"
                    >
                        Back to Feed
                    </button>
                </div>

                {/* Benefits Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-16 w-full">
                    <div className="bg-bg-secondary border border-border-primary rounded-2xl p-5 text-left hover:border-accent-blue/30 transition-all">
                        <div className="w-10 h-10 bg-accent-blue/10 rounded-xl flex items-center justify-center mb-3">
                            <Users size={20} className="text-accent-blue" />
                        </div>
                        <h3 className="text-sm font-bold text-white mb-1">Peer Network</h3>
                        <p className="text-xs text-text-secondary leading-relaxed">Connect with people preparing for the same roles and companies.</p>
                    </div>
                    <div className="bg-bg-secondary border border-border-primary rounded-2xl p-5 text-left hover:border-purple-500/30 transition-all">
                        <div className="w-10 h-10 bg-purple-500/10 rounded-xl flex items-center justify-center mb-3">
                            <Sparkles size={20} className="text-purple-400" />
                        </div>
                        <h3 className="text-sm font-bold text-white mb-1">Shared Resources</h3>
                        <p className="text-xs text-text-secondary leading-relaxed">Access interview experiences, study materials, and tips from members.</p>
                    </div>
                    <div className="bg-bg-secondary border border-border-primary rounded-2xl p-5 text-left hover:border-emerald-500/30 transition-all">
                        <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center mb-3">
                            <Compass size={20} className="text-emerald-400" />
                        </div>
                        <h3 className="text-sm font-bold text-white mb-1">Stay Updated</h3>
                        <p className="text-xs text-text-secondary leading-relaxed">Never miss an opportunity with real-time group discussions and events.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NoGroupsPage;
