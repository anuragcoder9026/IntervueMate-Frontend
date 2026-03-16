import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Mic, MicOff, Video, VideoOff, Settings, ShieldCheck, Users, Info } from 'lucide-react';
import api from '../utils/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const JoinPreviewPage = () => {
    const { eventId } = useParams();
    const navigate = useNavigate();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [stream, setStream] = useState(null);
    const [isMuted, setIsMuted] = useState(false);
    const [isVideoOff, setIsVideoOff] = useState(false);
    const [permissionError, setPermissionError] = useState(null);
    const videoRef = useRef();

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const { data } = await api.get(`/events`);
                if (data.success) {
                    const evt = data.data.find(e => e._id === eventId);
                    if (!evt) {
                        navigate('/events');
                        return;
                    }
                    setEvent(evt);
                }
            } catch (err) {
                console.error('Failed to fetch event:', err);
                navigate('/events');
            } finally {
                setLoading(false);
            }
        };
        fetchEvent();
    }, [eventId, navigate]);

    useEffect(() => {
        const startPreview = async () => {
            try {
                const mediaStream = await navigator.mediaDevices.getUserMedia({
                    video: true,
                    audio: true
                });
                setStream(mediaStream);
                if (videoRef.current) {
                    videoRef.current.srcObject = mediaStream;
                }
            } catch (err) {
                console.error('Media permission error:', err);
                setPermissionError('Camera and Microphone access are required to join this session.');
            }
        };

        startPreview();

        return () => {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
        };
    }, []);

    useEffect(() => {
        if (stream) {
            stream.getAudioTracks().forEach(track => {
                track.enabled = !isMuted;
            });
            stream.getVideoTracks().forEach(track => {
                track.enabled = !isVideoOff;
            });
        }
    }, [isMuted, isVideoOff, stream]);

    const handleJoin = () => {
        // Pass preferences as state or search params
        navigate(`/live-room?id=${eventId}&muted=${isMuted}&videoOff=${isVideoOff}`);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0A0F1A] flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-accent-blue border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-bg-primary text-text-primary font-inter flex flex-col">
            <Navbar />
            
            <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col items-center">
                <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    
                    {/* Left Side: Preview */}
                    <div className="flex flex-col gap-6">
                        <div className="relative aspect-video bg-[#111827] rounded-[32px] overflow-hidden border border-white/10 shadow-2xl flex items-center justify-center group">
                            {stream && !isVideoOff ? (
                                <video
                                    ref={videoRef}
                                    autoPlay
                                    playsInline
                                    muted
                                    className="w-full h-full object-cover mirror"
                                />
                            ) : (
                                <div className="absolute inset-0 bg-gradient-to-br from-[#1C2738] to-[#0A0F1A] flex flex-col items-center justify-center">
                                    <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center mb-4 border border-white/5">
                                        <VideoOff size={40} className="text-white/20" />
                                    </div>
                                    <span className="text-white/40 font-medium tracking-wide">Camera is Off</span>
                                </div>
                            )}

                            {/* Controls Overlay */}
                            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-[#111827]/80 backdrop-blur-xl px-6 py-4 rounded-[24px] border border-white/10 shadow-2xl transition-all group-hover:bottom-8">
                                <button
                                    onClick={() => setIsMuted(!isMuted)}
                                    className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${isMuted ? 'bg-red-500/20 text-red-500 border border-red-500/30' : 'bg-white/5 text-white hover:bg-white/10'}`}
                                >
                                    {isMuted ? <MicOff size={22} /> : <Mic size={22} />}
                                </button>
                                <button
                                    onClick={() => setIsVideoOff(!isVideoOff)}
                                    className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${isVideoOff ? 'bg-red-500/20 text-red-500 border border-red-500/30' : 'bg-white/5 text-white hover:bg-white/10'}`}
                                >
                                    {isVideoOff ? <VideoOff size={22} /> : <Video size={22} />}
                                </button>
                                <button className="w-12 h-12 rounded-2xl bg-white/5 text-white hover:bg-white/10 flex items-center justify-center transition-all">
                                    <Settings size={22} />
                                </button>
                            </div>
                        </div>

                        {permissionError && (
                            <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-2xl flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
                                <Info size={18} className="text-red-500 shrink-0 mt-0.5" />
                                <p className="text-red-500 text-sm font-medium">{permissionError}</p>
                            </div>
                        )}
                    </div>

                    {/* Right Side: Event Info & Join */}
                    <div className="flex flex-col">
                        <div className="mb-8">
                            <span className="bg-accent-blue/10 text-accent-blue text-[10px] font-black px-3 py-1 rounded-full border border-accent-blue/20 uppercase tracking-widest mb-4 inline-block">
                                Preparing Session
                            </span>
                            <h1 className="text-4xl font-black text-white mb-4 leading-tight">
                                {event?.title}
                            </h1>
                            <div className="flex items-center gap-6 text-text-secondary text-sm">
                                <div className="flex items-center gap-2">
                                    <Users size={16} />
                                    <span>{event?.attendees?.length || 0} attending</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <ShieldCheck size={16} className="text-emerald-500" />
                                    <span>Verified Session</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-[#111827] border border-white/5 p-8 rounded-[32px] shadow-2xl space-y-6">
                            <div className="space-y-2">
                                <h3 className="text-white font-bold">Ready to join?</h3>
                                <p className="text-text-secondary text-sm leading-relaxed">
                                    Make sure your microphone and camera are working. You can always change these settings inside the session.
                                </p>
                            </div>

                            <button
                                onClick={handleJoin}
                                disabled={!!permissionError}
                                className="w-full bg-accent-blue hover:bg-accent-blue-hover disabled:opacity-50 disabled:cursor-not-allowed text-white py-4 rounded-2xl font-black uppercase tracking-wider transition-all shadow-xl shadow-accent-blue/20 flex items-center justify-center gap-3 group"
                            >
                                <Users size={20} className="group-hover:scale-110 transition-transform" />
                                Join Now
                            </button>

                            <p className="text-[11px] text-text-secondary/60 text-center italic">
                                By joining, you agree to our community guidelines and session protocols.
                            </p>
                        </div>
                    </div>

                </div>
            </main>

            <Footer />
        </div>
    );
};

export default JoinPreviewPage;
