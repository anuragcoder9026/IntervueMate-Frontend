import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Maximize2, MoreVertical, Mic, MicOff, Video, MonitorUp, Hand, PhoneOff, Send, Info, Users, ChevronLeft, ChevronRight } from 'lucide-react';
import useSessionSocket from '../../hooks/useSessionSocket';
import api from '../../utils/api';
import { useSocket } from '../../context/SocketContext';

const LiveActiveSession = () => {
    const navigate = useNavigate();
    const [liveEvents, setLiveEvents] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [chatInput, setChatInput] = useState('');
    const { socket } = useSocket();

    const fetchLiveEvent = async () => {
        try {
            const { data } = await api.get('/events');
            if (data.success) {
                const active = data.data.filter(e => e.status === 'live');
                setLiveEvents(active || []);
            }
        } catch (err) {
            console.error('Failed to fetch live event:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLiveEvent();
    }, []);

    useEffect(() => {
        if (!socket) return;
        
        const handleStatusUpdate = (data) => {
            // Re-fetch to ensure we have the latest and correct live event
            fetchLiveEvent();
        };

        socket.on('event_status_updated', handleStatusUpdate);
        return () => socket.off('event_status_updated', handleStatusUpdate);
    }, [socket]);

    const liveEvent = liveEvents[currentIndex] || null;

    const { 
        participants, 
        messages, 
        sendMessage 
    } = useSessionSocket(liveEvent?._id, { isWatcher: true });

    const handleSendMessage = () => {
        if (!chatInput.trim()) return;
        sendMessage(chatInput);
        setChatInput('');
    };

    if (loading) return (
        <div className="h-[420px] bg-[#111622] rounded-2xl border border-white/5 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-accent-blue"></div>
        </div>
    );

    if (liveEvents.length === 0 || !liveEvent) return (
        <div className="bg-[#111622] rounded-2xl border border-white/5 p-12 text-center flex flex-col items-center justify-center shadow-lg">
            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
                <Video size={32} className="text-white/20" />
            </div>
            <h3 className="text-white font-bold text-lg mb-2">No Sessions Live Right Now</h3>
            <p className="text-text-secondary text-sm max-w-sm">
                Check back later or browse upcoming events to schedule your next session.
            </p>
            <button 
                onClick={() => navigate('/events')}
                className="mt-6 px-6 py-2 bg-accent-blue hover:bg-accent-blue/80 text-white rounded-xl font-bold transition-all text-sm"
            >
                View Upcoming Events
            </button>
        </div>
    );

    return (
        <div className="relative group">
            <div className="bg-[#111622] rounded-2xl border border-accent-blue/30 overflow-hidden relative shadow-lg shadow-accent-blue/5">
                {/* Top Header */}
            <div className="px-4 py-3 flex items-center justify-between border-b border-white/5 bg-[#171c28]">
                <div className="flex items-center gap-3">
                    <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-wider animate-pulse flex-shrink-0">Live</span>
                    <h2 className="text-white font-bold text-xs sm:text-base hidden sm:block truncate max-w-[200px] lg:max-w-md">{liveEvent.title}</h2>
                    <h2 className="text-white font-bold text-[11px] sm:text-base sm:hidden truncate max-w-[120px]">{liveEvent.title}</h2>
                    <span className="text-text-secondary text-[10px] sm:text-xs border-l border-white/10 pl-3 flex items-center gap-1.5 flex-shrink-0">
                        <Users size={12} />
                        {participants.length}
                    </span>
                    {liveEvents.length > 1 && (
                        <div className="flex items-center gap-1 ml-2 border-l border-white/10 pl-3">
                            <span className="text-xs text-accent-blue font-bold select-none text-center min-w-[32px]">
                                {currentIndex + 1} / {liveEvents.length}
                            </span>
                        </div>
                    )}
                </div>
                <div className="flex items-center gap-2 text-text-secondary">
                    <button 
                        onClick={() => navigate(`/events/join/${liveEvent._id}`)} 
                        className="p-1.5 hover:text-white hover:bg-white/5 rounded-md transition-colors" 
                        title="Full Screen"
                    >
                        <Maximize2 size={16} />
                    </button>
                    <button className="p-1.5 hover:text-white hover:bg-white/5 rounded-md transition-colors">
                        <MoreVertical size={16} />
                    </button>
                </div>
            </div>

            {/* Content Area */}
            <div className="flex flex-col lg:flex-row h-auto lg:h-[420px]">
                {/* Video Grid Placeholder */}
                <div className="flex-1 p-3 sm:p-4 relative flex flex-col justify-center bg-gradient-to-b from-[#111622] to-[#0A0F1A]">
                    <div className="grid grid-cols-2 grid-rows-2 gap-3 h-[280px] sm:h-full mb-14 lg:mb-0 pb-16 lg:pb-16">
                        {/* Static Placeholder Tiles for UI match */}
                        <div className="bg-[#1C2738] rounded-xl overflow-hidden relative border border-[#2563EB]/40 group h-full flex items-center justify-center">
                           <div className="flex flex-col items-center">
                                <div className="w-16 h-16 rounded-full bg-accent-blue/20 flex items-center justify-center mb-2 border border-accent-blue/30">
                                    <Video size={24} className="text-accent-blue" />
                                </div>
                                <span className="text-[10px] text-white/50">Viewing Feed...</span>
                           </div>
                           <div className="absolute bottom-2 left-2 flex items-center gap-1.5 bg-[#111827]/80 backdrop-blur-sm px-2 py-1 rounded text-[10px] font-medium text-white border border-white/10">
                                Session Host
                            </div>
                        </div>
                        <div className="bg-[#1C2738] rounded-xl overflow-hidden relative border border-white/5 flex flex-col p-4 justify-center items-center h-full opacity-50">
                             <div className="w-full h-full bg-white/5 animate-pulse rounded-lg" />
                             <div className="absolute bottom-2 left-2 bg-[#111827]/80 backdrop-blur-sm px-2 py-1 rounded text-[10px] font-medium text-white border border-white/10">
                                Shared Content
                            </div>
                        </div>
                        <div className="bg-[#1C2738] rounded-xl overflow-hidden relative border border-white/5 h-full opacity-50" />
                        <div className="bg-[#1C2738] rounded-xl overflow-hidden relative border border-white/5 h-full opacity-50" />
                    </div>

                    {/* Controls Overlay */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-[#1E2636]/90 backdrop-blur-md px-3 py-2 rounded-2xl border border-white/10 shadow-xl shadow-black/50">
                        <button className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors">
                            <MicOff size={18} />
                        </button>
                        <button className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors">
                            <Video size={18} />
                        </button>
                        <button 
                            onClick={() => navigate(`/events/join/${liveEvent._id}`)}
                            className="px-6 h-10 rounded-xl bg-accent-blue hover:bg-accent-blue-hover flex items-center justify-center text-white font-bold transition-colors shadow-lg shadow-accent-blue/20 text-sm ml-2"
                        >
                            Join Session
                        </button>
                    </div>
                </div>

                {/* Live Chat */}
                <div className="w-full lg:w-[320px] bg-[#171c28] border-l border-white/5 flex flex-col">
                    <div className="p-4 border-b border-white/5 flex items-center justify-between">
                        <h3 className="text-white font-bold text-sm">Live Chat</h3>
                        <span className="text-[10px] text-text-secondary bg-white/5 px-2 py-0.5 rounded-full">{participants.length} online</span>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 custom-scrollbar">
                        {messages.map((msg) => (
                            <div key={msg._id} className="flex gap-2">
                                <div className="w-6 h-6 rounded-full bg-white/5 flex shrink-0 border border-white/10 overflow-hidden">
                                     {msg.sender?.avatar ? (
                                        <img src={msg.sender.avatar} alt="" className="w-full h-full object-cover" />
                                     ) : (
                                        <div className="w-full h-full bg-accent-blue/20 flex items-center justify-center text-[8px] font-bold text-accent-blue uppercase">
                                            {msg.sender?.name?.charAt(0)}
                                        </div>
                                     )}
                                </div>
                                <div>
                                    <div className="flex items-baseline gap-2 mb-0.5">
                                        <span className="text-xs font-bold text-white">{msg.sender?.name}</span>
                                        <span className="text-[9px] text-text-secondary">{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                    </div>
                                    <p className="text-xs text-text-secondary leading-relaxed">{msg.text}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="p-3 border-t border-white/5">
                        <div className="relative flex items-center bg-[#0F141F] rounded-lg border border-white/10 focus-within:border-accent-blue/50">
                            <input
                                type="text"
                                value={chatInput}
                                onChange={(e) => setChatInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                                placeholder="Type a message..."
                                className="w-full bg-transparent border-none text-xs text-white pl-3 pr-10 py-2.5 focus:outline-none placeholder:text-text-secondary/70 h-9"
                            />
                            <button 
                                onClick={handleSendMessage}
                                className="absolute right-2 p-1.5 text-accent-blue hover:text-blue-400 transition-colors"
                            >
                                <Send size={14} />
                            </button>
                        </div>
                    </div>
                </div>
                </div>
            </div>

            {/* Big Navigation Arrows */}
            {liveEvents.length > 1 && (
                <>
                    <button 
                        onClick={() => setCurrentIndex((prev) => (prev - 1 + liveEvents.length) % liveEvents.length)}
                        className="absolute left-2 top-1/2 -translate-y-1/2 w-12 h-12 lg:-left-6 lg:w-16 lg:h-16 bg-[#0A0F1A]/90 hover:bg-accent-blue border border-white/10 rounded-full flex items-center justify-center text-white shadow-2xl opacity-100 transition-all z-10 outline-none hover:scale-110 active:scale-95 duration-300"
                    >
                        <ChevronLeft size={32} className="lg:w-10 lg:h-10" />
                    </button>
                    <button 
                        onClick={() => setCurrentIndex((prev) => (prev + 1) % liveEvents.length)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 w-12 h-12 lg:-right-6 lg:w-16 lg:h-16 bg-[#0A0F1A]/90 hover:bg-accent-blue border border-white/10 rounded-full flex items-center justify-center text-white shadow-2xl opacity-100 transition-all z-10 outline-none hover:scale-110 active:scale-95 duration-300"
                    >
                        <ChevronRight size={32} className="lg:w-10 lg:h-10" />
                    </button>
                </>
            )}
        </div>
    );
};

export default LiveActiveSession;
