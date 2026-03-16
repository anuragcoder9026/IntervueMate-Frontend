import React, { useRef, useEffect, useState } from 'react';
import { Mic, MicOff, Video, VideoOff, Users, User, Crown, MoreVertical, LogOut } from 'lucide-react';

const VideoTile = ({ name, isHost, isMe, micMuted, videoOff, isJoining, whiteboard, type, stream, avatar, isScreenSharing, canManage, onForceExit }) => {
    const videoRef = useRef();
    const [showMenu, setShowMenu] = useState(false);
    const menuRef = useRef();

    useEffect(() => {
        if (!videoRef.current || !stream) return;

        const video = videoRef.current;

        // ── Attach the stream ──
        if (video.srcObject !== stream) {
            video.srcObject = stream;
        }

        const tryPlay = () => {
            if (video.paused) {
                video.play().catch(err => {
                    if (err.name !== 'AbortError') {
                        console.warn(`[VideoTile] Play retry for ${name}:`, err.message);
                    }
                });
            }
        };

        tryPlay();

        // ── Track-level monitoring ──
        const videoTracks = stream.getVideoTracks();
        const handleUnmute = () => tryPlay();
        videoTracks.forEach(t => t.addEventListener('unmute', handleUnmute));

        const handleTrackChange = () => {
            video.srcObject = stream;
            tryPlay();
        };
        stream.addEventListener('addtrack', handleTrackChange);
        stream.addEventListener('removetrack', handleTrackChange);

        // ── Periodic health check ──
        const healthCheck = setInterval(() => {
            const hasLiveTrack = stream.getVideoTracks().some(t => t.readyState === 'live' && t.enabled);
            if (hasLiveTrack && video.videoWidth === 0 && !video.paused) {
                console.log(`[VideoTile] Force re-attach for ${name} (stuck black)`);
                video.srcObject = null;
                video.srcObject = stream;
                tryPlay();
            } else if (video.paused && hasLiveTrack) {
                tryPlay();
            }
        }, 2000);

        // ── Visibility change ──
        const handleVisibility = () => {
            if (document.visibilityState === 'visible') tryPlay();
        };
        document.addEventListener('visibilitychange', handleVisibility);

        return () => {
            clearInterval(healthCheck);
            videoTracks.forEach(t => t.removeEventListener('unmute', handleUnmute));
            stream.removeEventListener('addtrack', handleTrackChange);
            stream.removeEventListener('removetrack', handleTrackChange);
            document.removeEventListener('visibilitychange', handleVisibility);
        };
    }, [stream, isScreenSharing, name]);

    // Close menu on outside click
    useEffect(() => {
        if (!showMenu) return;
        const handleClick = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setShowMenu(false);
            }
        };
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, [showMenu]);

    if (isJoining) {
        return (
            <div className="h-full bg-[#1E2636] rounded-2xl overflow-hidden relative border border-white/5 flex flex-col items-center justify-center shadow-md shadow-black/20">
                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-2 animate-pulse">
                    <User size={24} className="text-white/20" />
                </div>
                <span className="text-xs text-text-secondary font-medium">Joining...</span>
            </div>
        );
    }


    return (
        <div className={`h-full rounded-2xl overflow-hidden relative border group transition-all duration-300 ${isHost ? 'border-accent-blue/30 shadow-lg shadow-accent-blue/5' : 'border-white/5 shadow-xl shadow-black/40'} bg-[#0F141F]`}>
            {/* Render video ALWAYS so the stream/audio stays continuously attached */}
            {stream && (
                <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted={isMe} // Local preview must be muted to avoid feedback loop
                    className={`absolute inset-0 w-full h-full ${isScreenSharing ? 'object-contain bg-black' : 'object-cover'} ${(isMe && !isScreenSharing) ? 'mirror' : ''} ${(!videoOff || isScreenSharing) ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                />
            )}

            {/* Avatar overlay - render on top when no stream OR when video is off (but not sharing screen) */}
            {(!stream || (videoOff && !isScreenSharing)) && (
                <div className="absolute inset-0 bg-[#0A0F1A] flex flex-col items-center justify-center z-10">
                    <div className="absolute inset-0 bg-gradient-to-b from-[#1C2738]/20 to-[#0A0F1A] pointer-events-none" />
                    
                    {/* Content Layer */}
                    <div className="relative flex flex-col items-center justify-center">
                        <div className={`relative rounded-full shadow-2xl flex items-center justify-center overflow-hidden transition-all duration-500
                            ${type === 'main' ? 'w-24 h-24 sm:w-32 sm:h-32' : 'w-16 h-16'} 
                            ${isMe ? 'bg-emerald-500/10 border-2 border-emerald-500/20' : isHost ? 'bg-accent-blue/10 border-2 border-accent-blue/20' : 'bg-white/5 border-2 border-white/5'}`}>
                            {avatar ? (
                                <img src={avatar} alt={name} className="w-full h-full object-cover" />
                            ) : (
                                <div className={`font-black text-white/30 uppercase ${type === 'main' ? 'text-4xl' : 'text-xl'}`}>
                                    {name?.charAt(0)}
                                </div>
                            )}

                            {/* The "Cross" Icon over the clear avatar - only if videoOff is true */}
                            {videoOff && (
                                <div className="absolute inset-0 bg-red-500/20 flex items-center justify-center backdrop-blur-[1px]">
                                    <VideoOff size={type === 'main' ? 40 : 20} className="text-white drop-shadow-md animate-in zoom-in-50 duration-300" />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* ── Three-dot Admin Menu (Creator / Admin only, not on own tile) ── */}
            {canManage && !isMe && (
                <div className="absolute flex gap-1 top-1.5 left-3 z-20" ref={menuRef}>
                    <button 
                        onClick={(e) => { e.stopPropagation(); setShowMenu(!showMenu); }}
                        className="w-7 h-7 bg-black/50 hover:bg-red-500/80 rounded-full flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 backdrop-blur-sm border border-white/10"
                    >
                        <MoreVertical size={14} />
                    </button>
                    {showMenu && (
                        <span className="relative left-0 mt-0 bg-[#111827]/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl shadow-black/50 p-1 min-w-[120px] animate-in zoom-in-95 fade-in duration-150 origin-top-left">
                            <button 
                                onClick={() => { onForceExit?.(); setShowMenu(false); }}
                                className="w-full flex items-center gap-2.5 px-3 py-1.5 text-xs font-bold text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                            >
                                <LogOut size={14} />
                                Remove
                            </button>
                        </span>
                    )}
                </div>
            )}

            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                <div className="flex items-center gap-2 bg-[#111827]/80 backdrop-blur-md px-3 py-1.5 rounded-xl text-xs font-bold text-white border border-white/10 transition-all group-hover:bg-accent-blue">
                    {micMuted ? <MicOff size={14} className="text-red-400" /> : <Mic size={14} className="text-emerald-400" />}
                    <span className="truncate max-w-[100px]">{isMe ? 'You' : name}</span>
                    {isHost && (
                        <div className="bg-accent-blue/20 text-accent-blue rounded px-1.5 py-0.5 text-[8px] font-black uppercase flex items-center gap-1 border border-accent-blue/20 ml-1">
                            <Crown size={8} />
                            Host
                        </div>
                    )}
                </div>
            </div>

            {/* Speaking Indicator */}
            {!micMuted && (
                <div className="absolute top-3 right-3 flex gap-1 items-end h-3 px-2">
                    <div className="w-1 bg-emerald-500 animate-music-bar-1 rounded-full" />
                    <div className="w-1 bg-emerald-500 animate-music-bar-2 rounded-full h-2" />
                    <div className="w-1 bg-emerald-500 animate-music-bar-3 rounded-full h-3" />
                </div>
            )}
        </div>
    );
};

export default VideoTile;
