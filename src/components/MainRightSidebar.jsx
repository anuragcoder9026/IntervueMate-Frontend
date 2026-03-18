import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
    TrendingUp,
    ExternalLink,
    Plus,
    ChevronRight,
    Sparkles,
    Calendar,
    UserPlus,
    Loader2
} from 'lucide-react';
import api from '../utils/api';
import { toast } from 'react-toastify';
import { format } from 'date-fns';

const MainRightSidebar = () => {
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [events, setEvents] = useState([]);
    const [eventsLoading, setEventsLoading] = useState(true);

    useEffect(() => {
        const fetchSuggestions = async () => {
            try {
                const response = await api.get('/users/profile/suggested');
                if (response.data.success) {
                    setSuggestions(response.data.data);
                }
            } catch (err) {
                console.error('Fetch Suggestions Error:', err);
            } finally {
                setLoading(false);
            }
        };

        const fetchEvents = async () => {
            try {
                const response = await api.get('/events');
                if (response.data.success) {
                    // Filter for events with no group (visibility Anyone or null groupId)
                    // AND only show events NOT created by the current user
                    const otherPublicEvents = response.data.data.filter(e => 
                        (!e.groupId || e.visibility === 'Anyone') && 
                        e.creator?._id !== user?._id
                    );
                    setEvents(otherPublicEvents.slice(0, 3)); // Show top 3
                }
            } catch (err) {
                console.error('Fetch Events Error:', err);
            } finally {
                setEventsLoading(false);
            }
        };

        fetchSuggestions();
        fetchEvents();
    }, []);

    const handleFollow = async (userId) => {
        try {
            const response = await api.put(`/users/${userId}/follow`);
            if (response.data.success) {
                toast.success('Following user!');
                setSuggestions(prev => prev.filter(u => u._id !== userId));
            }
        } catch (err) {
            console.error('Follow Error:', err);
            toast.error(err.response?.data?.error || 'Failed to follow user');
        }
    };
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
                    {loading ? (
                        [1, 2, 3].map(i => (
                            <div key={i} className="flex items-center justify-between animate-pulse">
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-full bg-white/5"></div>
                                    <div className="space-y-2">
                                        <div className="h-2 w-20 bg-white/5 rounded"></div>
                                        <div className="h-2 w-24 bg-white/5 rounded"></div>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : suggestions.length > 0 ? (
                        suggestions.slice(0, 3).map((person) => (
                            <div key={person._id} className="flex items-center justify-between group">
                                <div 
                                    onClick={() => navigate(`/profile/${person.userId}`)}
                                    className="flex items-center gap-3 cursor-pointer min-w-0"
                                >
                                    <img 
                                        src={person.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(person.name)}&background=random`} 
                                        className="w-9 h-9 rounded-full shadow-md border border-border-primary object-cover" 
                                        alt={person.name} 
                                    />
                                    <div className="min-w-0">
                                        <p className="text-xs font-bold text-text-primary leading-none truncate group-hover:text-accent-blue transition-colors">{person.name}</p>
                                        <p className="text-[10px] text-text-secondary font-medium mt-1 truncate">{person.headline || 'Professional'}</p>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => handleFollow(person._id)}
                                    className="w-8 h-8 rounded-xl border border-accent-blue/30 text-accent-blue flex items-center justify-center hover:bg-accent-blue hover:text-white transition-all active:scale-90 shadow-sm shadow-accent-blue/5"
                                    title="Follow"
                                >
                                    <UserPlus size={14} />
                                </button>
                            </div>
                        ))
                    ) : (
                        <p className="text-[10px] text-text-secondary text-center py-2">No suggestions right now</p>
                    )}
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
                    {eventsLoading ? (
                        [1, 2].map(i => (
                            <div key={i} className="flex gap-4 animate-pulse">
                                <div className="w-12 h-14 rounded-xl bg-white/5 shrink-0"></div>
                                <div className="flex-1 space-y-2 py-1">
                                    <div className="h-2 w-full bg-white/5 rounded"></div>
                                    <div className="h-2 w-3/4 bg-white/5 rounded"></div>
                                </div>
                            </div>
                        ))
                    ) : events.length > 0 ? (
                        events.map((event) => {
                            const eventDate = new Date(event.date);
                            const month = format(eventDate, 'MMM');
                            const day = format(eventDate, 'dd');

                            return (
                                <div 
                                    key={event._id} 
                                    onClick={() => navigate(`/events`)}
                                    className="flex gap-4 group cursor-pointer"
                                >
                                    <div className="shrink-0 flex flex-col items-center justify-center p-2 rounded-xl bg-bg-primary border border-border-primary w-12 h-14 group-hover:border-accent-blue transition-colors relative overflow-hidden">
                                        <div className="absolute top-0 inset-x-0 h-1 bg-accent-blue opacity-50"></div>
                                        <span className="text-[9px] font-bold text-text-secondary leading-none uppercase">{month}</span>
                                        <span className="text-sm font-black text-text-primary mt-1 leading-none">{day}</span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h5 className="text-xs font-bold text-text-primary group-hover:text-accent-blue transition-colors line-clamp-1">{event.title}</h5>
                                        <div className="flex items-center gap-1.5 mt-1">
                                            <span className="text-[10px] text-text-secondary font-medium">{event.time}</span>
                                            <span className="w-1 h-1 rounded-full bg-white/10"></span>
                                            <span className="text-[10px] text-accent-blue font-bold uppercase tracking-tighter">{event.type || 'Session'}</span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <p className="text-[10px] text-text-secondary text-center py-2 italic">No public events scheduled</p>
                    )}
                </div>

                <button className="w-full mt-2 py-2.5 bg-bg-tertiary border border-white/5 rounded-xl text-xs font-bold text-text-primary hover:bg-bg-primary transition-all">
                    View All Events
                </button>
            </div>
        </div>
    );
};

export default MainRightSidebar;
