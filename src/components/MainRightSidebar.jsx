import React from 'react';
import {
    TrendingUp,
    ExternalLink,
    Plus,
    ChevronRight,
    Sparkles,
    Calendar
} from 'lucide-react';

const MainRightSidebar = () => {
    return (
        <div className="space-y-6">
            {/* Trending Topics */}
            <div className="bg-bg-secondary border border-border-primary rounded-2xl p-5 shadow-sm">
                <div className="flex items-center justify-between mb-5">
                    <h4 className="font-outfit font-bold text-text-primary">Global Trends</h4>
                    <TrendingUp size={16} className="text-accent-blue" />
                </div>

                <div className="space-y-5">
                    {[
                        { tag: 'MetaHiring', label: 'Meta resumes fresh grad hiring', posts: '12.4k' },
                        { tag: 'SystemDesign', label: 'Common LLD/HLD Questions', posts: '8.2k' },
                        { tag: 'FAANG', label: 'Salary Negotiation 2024', posts: '5.1k' },
                        { tag: 'RemoteWork', label: 'Best companies for remote dev', posts: '3.9k' }
                    ].map((item, i) => (
                        <div key={i} className="group cursor-pointer">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h5 className="text-xs font-extrabold text-accent-blue group-hover:underline">#{item.tag}</h5>
                                    <p className="text-sm font-bold text-text-primary mt-1 line-clamp-1 group-hover:text-accent-blue transition-colors">{item.label}</p>
                                    <p className="text-[10px] text-text-secondary font-medium mt-1 uppercase tracking-wider">{item.posts} discussions</p>
                                </div>
                                <button className="opacity-0 group-hover:opacity-100 p-1.5 bg-bg-tertiary rounded-lg text-text-secondary hover:text-white transition-all shadow-sm">
                                    <Plus size={14} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                <button className="w-full mt-6 py-2.5 text-xs font-bold text-text-secondary hover:text-white border-t border-border-primary/50 flex items-center justify-center gap-2 group transition-colors">
                    Show More Trends <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </button>
            </div>



            {/* Suggested Professionals Card */}
            <div className="bg-bg-secondary border border-border-primary rounded-2xl p-5 shadow-sm space-y-5">
                <h4 className="font-outfit font-bold text-text-primary flex items-center gap-2">
                    People you may know <Sparkles size={14} className="text-amber-500 animate-pulse" />
                </h4>

                <div className="space-y-4">
                    {[
                        { name: 'Sameer J.', role: 'SDE-2 at Microsoft', avatar: 'https://ui-avatars.com/api/?name=S+J&background=random' },
                        { name: 'Lisha Verma', role: 'Staff Designer, Uber', avatar: 'https://ui-avatars.com/api/?name=L+V&background=random' },
                        { name: 'Kunal K.', role: 'Open Source Advocate', avatar: 'https://ui-avatars.com/api/?name=K+K&background=random' }
                    ].map((person, i) => (
                        <div key={i} className="flex items-center justify-between group">
                            <div className="flex items-center gap-3">
                                <img src={person.avatar} className="w-9 h-9 rounded-full shadow-md border border-border-primary" alt={person.name} />
                                <div className="min-w-0">
                                    <p className="text-xs font-bold text-text-primary leading-none truncate group-hover:text-accent-blue transition-colors">{person.name}</p>
                                    <p className="text-[10px] text-text-secondary font-medium mt-1 truncate">{person.role}</p>
                                </div>
                            </div>
                            <button className="w-8 h-8 rounded-xl border border-accent-blue/30 text-accent-blue flex items-center justify-center hover:bg-accent-blue hover:text-white transition-all active:scale-90 shadow-sm shadow-accent-blue/5">
                                <Plus size={16} />
                            </button>
                        </div>
                    ))}
                </div>

                <button className="w-full mt-2 py-3 bg-bg-tertiary border border-white/5 rounded-full text-xs font-bold text-text-primary hover:bg-bg-primary transition-all flex items-center justify-center gap-2">
                    Find more peers <ExternalLink size={14} />
                </button>
            </div>

            {/* Upcoming Events */}
            <div className="bg-bg-secondary border border-border-primary rounded-2xl p-5 shadow-sm space-y-4">
                <div className="flex items-center justify-between mb-2">
                    <h4 className="font-outfit font-bold text-text-primary">Upcoming Events</h4>
                    <Calendar size={16} className="text-emerald-500" />
                </div>

                <div className="space-y-4">
                    {[
                        { date: 'OCT 24', title: 'Live Mock Interview Session', time: '6:00 PM • Online' },
                        { date: 'OCT 28', title: 'Resume Review Workshop', time: '2:00 PM • Zoom' }
                    ].map((event, i) => (
                        <div key={i} className="flex gap-4 group cursor-pointer">
                            <div className="shrink-0 flex flex-col items-center justify-center p-2 rounded-xl bg-bg-primary border border-border-primary w-12 h-14 group-hover:border-accent-blue transition-colors">
                                <span className="text-[9px] font-bold text-text-secondary leading-none uppercase">{event.date.split(' ')[0]}</span>
                                <span className="text-sm font-black text-text-primary mt-1 leading-none">{event.date.split(' ')[1]}</span>
                            </div>
                            <div className="flex-1">
                                <h5 className="text-xs font-bold text-text-primary group-hover:text-accent-blue transition-colors line-clamp-1">{event.title}</h5>
                                <p className="text-[10px] text-text-secondary mt-1 font-medium">{event.time}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <button className="w-full mt-2 py-2.5 bg-bg-tertiary border border-white/5 rounded-xl text-xs font-bold text-text-primary hover:bg-bg-primary transition-all">
                    View All Events
                </button>
            </div>
        </div>
    );
};

export default MainRightSidebar;
