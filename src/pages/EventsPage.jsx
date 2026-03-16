import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import LiveActiveSession from '../components/events/LiveActiveSession';
import EventCard from '../components/events/EventCard';
import HostSessionCard from '../components/events/HostSessionCard';
import { Globe, Users, Info, Plus, CircleUserRound } from 'lucide-react';

import EventsFilterBar from '../components/events/EventsFilterBar';
import CreateEventModal from '../components/events/CreateEventModal';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import api from '../utils/api';
import { useSocket } from '../context/SocketContext';



const EventsPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [liveEvents, setLiveEvents] = useState([]);
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
        if (location.hash) {
            const id = location.hash.replace('#', '');
            const elm = document.getElementById(id);
            if (elm) {
                setTimeout(() => elm.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
            }
        }
        fetchLiveEvent();
    }, [location]);

    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState('general');
    const [activeFilter, setActiveFilter] = useState('All Events');
    const [searchQuery, setSearchQuery] = useState('');
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    const { socket } = useSocket();

    useEffect(() => {
        if (!socket) return;
        
        const handleStatusUpdate = (data) => {
            setEvents(prev => prev.map(evt => 
                evt._id === data.eventId ? { ...evt, status: data.status } : evt
            ));
        };

        socket.on('event_status_updated', handleStatusUpdate);
        return () => socket.off('event_status_updated', handleStatusUpdate);
    }, [socket]);

    const fetchEvents = async () => {
        setLoading(true);
        try {
            const { data } = await api.get('/events');
            if (data.success) {
                setEvents(data.data);
            }
        } catch (err) {
            console.error('Failed to fetch events:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    const handleCreateEvent = (newEvent) => {
        // If it's Anyone visibility, it's added immediately. 
        // If it's Group, it's pending so we don't necessarily need to add it to the 'scheduled' list.
        fetchEvents(); 
    };

    const { user: currentUser } = useSelector((state) => state.auth);
    const currentUserId = currentUser?._id || currentUser?.id;

    const handleJoinEvent = async (eventId) => {
        if (!currentUserId) {
            toast.error('Please login to join events');
            return;
        }
        const evt = events.find(e => e._id === eventId);
        if (evt && evt.status === 'live') {
            navigate(`/events/join/${eventId}`);
            return;
        }

        if (evt && evt.status === 'pending') {
            toast.info('This session is pending approval from group admins');
            return;
        }

        if (evt && evt.status === 'rejected') {
            toast.error('This session request was rejected');
            return;
        }

        const isHost = String(evt.creator?._id || evt.creator) === String(currentUserId);
        
        if (isHost && evt.status === 'scheduled') {
            // Check if time passed to allow starting
            const d = new Date(evt.date);
            const year = d.getUTCFullYear();
            const month = d.getUTCMonth();
            const day = d.getUTCDate();
            const timeParts = (evt.time || "00:00").split(':');
            const hours = parseInt(timeParts[0], 10);
            const minutes = parseInt(timeParts[1] || "0", 10);
            const eventDateTime = new Date(year, month, day, hours, minutes, 0, 0);
            
            if (new Date() >= eventDateTime) {
                // Just navigate to the room. The host will click "Start Session" there.
                navigate(`/events/join/${eventId}`);
            } else {
                toast.info('This session is yet to start');
            }
            return;
        }

        if (isHost) {
            // Host shouldn't "attend" their own live/completed events anymore than navigating
            if (evt.status === 'live') {
                navigate(`/events/join/${eventId}`);
            }
            return;
        }

        const userIdStr = String(currentUserId);

        // Optimistic Update
        setEvents(prev => prev.map(evt => {
            if (evt._id === eventId) {
                const attendees = evt.attendees || [];
                const isAttending = attendees.some(id => String(id) === userIdStr);
                const updatedAttendees = isAttending
                    ? attendees.filter(id => String(id) !== userIdStr)
                    : [...attendees, userIdStr];
                return { ...evt, attendees: updatedAttendees };
            }
            return evt;
        }));

        try {
            const { data } = await api.put(`/events/${eventId}/attend`);
            if (data.success) {
                setEvents(prev => prev.map(evt => evt._id === eventId ? { ...evt, attendees: data.data.attendees } : evt));
                const isAttending = data.data.attendees.some(id => String(id) === String(currentUserId));
                toast.success(isAttending ? 'Attending event!' : 'Participation cancelled');
            }
        } catch (err) {
            toast.error(err.response?.data?.error || 'Failed to update attendance');
            fetchEvents();
        }

    };

    const formatEventForCard = (evt) => {
        const eventDate = new Date(evt.date);
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);

        let datePrefix = eventDate.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase();
        if (eventDate.toDateString() === today.toDateString()) datePrefix = 'TODAY';
        else if (eventDate.toDateString() === tomorrow.toDateString()) datePrefix = 'TOMORROW';

        const dateTag = `${datePrefix}, ${evt.time}`;
        const isUserAttending = (evt.attendees || []).some(id => String(id) === String(currentUserId));
        const isLive = evt.status === 'live';
        const isHost = String(evt.creator?._id || evt.creator) === String(currentUserId);

        // Calculate if it's time to start - use UTC getters to extract the intended date part
        const d = new Date(evt.date);
        const year = d.getUTCFullYear();
        const month = d.getUTCMonth(); // Correctly 0-indexed (0-11)
        const day = d.getUTCDate();
        
        // Handle "HH:mm" or "HH:mm:ss"
        const timeParts = (evt.time || "00:00").split(':');
       
        const hours = parseInt(timeParts[0], 10);
        const minutes = parseInt(timeParts[1] || "0", 10);
       
        // Construct event date-time in local time
        const eventDateTime = new Date(year, month, day, hours, minutes, 0, 0);
        const now = new Date();
        
        // Final guard: Start only if now is truly >= event time
        const isTimePassed = now.getTime() >= eventDateTime.getTime();
        let actionText = 'Attend';
        let actionVariant = 'solid';

        if (isLive) {
            actionText = 'Join';
            actionVariant = 'solid';
        } else if (isHost) {
            if (evt.status === 'scheduled') {
                if (isTimePassed) {
                    actionText = 'Start';
                    actionVariant = 'solid';
                } else {
                    actionText = 'Yet to Start';
                    actionVariant = 'outline';
                }
            } else if (evt.status === 'pending') {
                actionText = 'Requested';
                actionVariant = 'outline';
            } else if (evt.status === 'rejected') {
                actionText = 'Rejected';
                actionVariant = 'outline';
            } else {
                actionText = isUserAttending ? 'Attending' : 'Attend';
                actionVariant = isUserAttending ? 'outline' : 'solid';
            }
        } else {
            actionText = isUserAttending ? 'Attending' : 'Attend';
            actionVariant = isUserAttending ? 'outline' : 'solid';
        }

        return {
            _id: evt._id,
            theme: evt.theme,
            dateTag,
            badge: { 
                icon: evt.theme === 'blue' ? 'bot' : (evt.theme === 'emerald' ? 'building' : 'users'), 
                text: evt.groupId ? (evt.groupId.name || 'Group') : '' 
            },
            subtitle: isLive ? `LIVE - ${evt.type.toUpperCase()}` : evt.type.toUpperCase(),
            title: evt.title,
            desc: evt.desc,
            attendees: { 
                type: 'icons', 
                text: `${evt.attendees?.length || 0} attending` 
            },
            actionText,
            actionVariant,
            isHosted: isHost // Added this so EventCard can show hosting badge if needed
        };
    };

    const myEvents = events.filter(evt => String(evt.creator?._id || evt.creator) === String(currentUserId));

    // Filter discovery events based on viewMode, activeFilter, and searchQuery
    const filteredDiscoveryEvents = events.filter(evt => {
        const isMyEvent = String(evt.creator?._id || evt.creator) === String(currentUserId);
        
        // Exclude my events from General and Group sections to avoid duplication
        if (isMyEvent) return false;
        
        // Mode Filter
        if (viewMode === 'general' && evt.visibility !== 'Anyone') return false;
        if (viewMode === 'group' && evt.visibility !== 'Group') return false;

        // Type Filter
        if (activeFilter !== 'All Events' && evt.type !== activeFilter) return false;

        // Search Filter
        if (searchQuery) {
            const searchLower = searchQuery.toLowerCase();
            const matchesTitle = evt.title?.toLowerCase().includes(searchLower);
            const matchesDesc = evt.desc?.toLowerCase().includes(searchLower);
            const matchesCreator = evt.creator?.name?.toLowerCase().includes(searchLower);
            if (!matchesTitle && !matchesDesc && !matchesCreator) return false;
        }
        
        return true;
    });



    return (
        <div className="min-h-screen bg-bg-primary text-text-primary font-inter">
            <Navbar />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
                    <div>
                        <h1 className="text-2xl sm:text-4xl font-black text-white mb-2 tracking-tight">Live Discussions & Events</h1>
                        <p className="text-text-secondary text-xs sm:text-sm max-w-xl">
                            Join real-time practice sessions, tech talks, and community hangouts.
                        </p>
                    </div>
                    <div className="flex items-center gap-3 flex-wrap justify-end">
                        <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 px-3 py-2 rounded-xl">
                            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                            <span className="text-red-400 font-bold text-xs sm:text-sm">{liveEvents?.length} Sessions Live Now</span>
                        </div>
                        <button
                            onClick={() => setIsCreateModalOpen(true)}
                            className="flex items-center gap-2 bg-accent-blue hover:bg-accent-blue-hover text-white px-4 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-accent-blue/20 text-xs sm:text-sm whitespace-nowrap"
                        >
                            <Plus size={16} />
                            <span>Create Event</span>
                        </button>
                    </div>
                </div>

                {/* Live Active Session */}
                <div className="mb-10">
                    <LiveActiveSession />
                </div>
                
                {/* Your Created Events Section */}
                {myEvents.length > 0 && (
                    <div className="mb-12">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-1.5 h-6 bg-accent-blue rounded-full" />
                            <h2 className="text-xl font-bold text-white tracking-tight uppercase">Your Created Events</h2>
                            <span className="bg-accent-blue/10 text-accent-blue text-[10px] font-black px-2 py-0.5 rounded-full border border-accent-blue/20">
                                {myEvents.length}
                            </span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {myEvents.map((evt) => (
                                <div key={evt._id} className="lg:col-span-1 h-full">
                                    <EventCard 
                                        {...formatEventForCard(evt)} 
                                        badge={{ ...formatEventForCard(evt).badge, showInBanner: true }} 
                                        actionVariant={
                                            evt.status === 'pending' || evt.status === 'rejected' ? 'outline' : 'solid'
                                        }
                                        onActionClick={() => handleJoinEvent(evt._id)}
                                    />
                                </div>
                            ))}
                        </div>

                    </div>
                )}


                {/* Mode Toggle */}
                <div id="events-mode" className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 scroll-mt-24 pt-4">
                    <div className="flex bg-[#171c28] p-1 rounded-xl border border-white/5 w-fit">
                        <button
                            onClick={() => setViewMode('general')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${viewMode === 'general' ? 'bg-accent-blue text-white shadow-md' : 'text-text-secondary hover:text-white'}`}
                        >
                            <Globe size={16} />
                            General Discovery
                        </button>
                        <button
                            onClick={() => setViewMode('group')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${viewMode === 'group' ? 'bg-accent-blue text-white shadow-md' : 'text-text-secondary hover:text-white'}`}
                        >
                            <Users size={16} />
                            Group Events
                        </button>
                    </div>

                    <div className="flex items-center gap-2 text-text-secondary text-xs italic">
                        <Info size={14} className="text-white/50" />
                        <span>Filter by session type below to narrow your search</span>
                    </div>
                </div>


                {/* Filter and Content */}
                <div className="border-t border-white/5 pt-8">
                    <EventsFilterBar 
                        activeFilter={activeFilter} 
                        onFilterChange={setActiveFilter}
                        searchQuery={searchQuery}
                        onSearchChange={setSearchQuery}
                    />

                    {loading ? (
                        <div className="flex items-center justify-center py-20">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-blue"></div>
                        </div>
                    ) : filteredDiscoveryEvents.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 bg-[#171c28]/30 rounded-[32px] border border-white/5 px-6 text-center">
                            <Info size={40} className="text-white/10 mb-4" />
                            <p className="text-text-secondary font-bold">No events found for this mode.</p>
                            <p className="text-[#a3aed0] text-xs mt-1">Try switching modes or adjusting your filters.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {filteredDiscoveryEvents.map((evt) => (
                                <div key={evt._id} className="lg:col-span-1 h-full">
                                    <EventCard 
                                        {...formatEventForCard(evt)} 
                                        badge={{ ...formatEventForCard(evt).badge, showInBanner: true }} 
                                        onActionClick={() => handleJoinEvent(evt._id)}
                                    />
                                </div>
                            ))}
                            {/* Host Card */}
                            <div className="lg:col-span-1 h-full">
                                <HostSessionCard onClick={() => setIsCreateModalOpen(true)} />
                            </div>
                        </div>
                    )}

                </div>

            </main>

            <Footer />

            <CreateEventModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onCreate={handleCreateEvent}
            />
        </div>
    );
};

export default EventsPage;
