import React, { useEffect, useRef, useState } from 'react';
import { Phone, PhoneOff, Mic, MicOff, Video, VideoOff, User } from 'lucide-react';

const VideoCallModal = ({
    callStatus,
    callData,
    localStream,
    remoteStream,
    isMuted,
    isVideoOn,
    toggleMute,
    toggleVideo,
    acceptCall,
    rejectCall,
    endCall,
    formatDuration,
    callDuration,
    isOtherOnline
}) => {
    const remoteVideoRef = useRef(null);
    const localVideoRef = useRef(null);
    const [isSwapped, setIsSwapped] = useState(false);

    const toggleSwap = (e) => {
        if (e) e.stopPropagation();
        if (isActive && remoteStream) {
            setIsSwapped(prev => !prev);
        }
    };

    // Attach remote stream
    useEffect(() => {
        if (remoteVideoRef.current && remoteStream) {
            console.log('🎥 VideoCallModal attaching remoteStream:', remoteStream.id);
            console.log('🎥 Remote tracks:', remoteStream.getTracks().map(t => `${t.kind}:${t.enabled}`));
            remoteVideoRef.current.srcObject = remoteStream;
        }
    }, [remoteStream, callStatus]);

    // Attach local stream
    useEffect(() => {
        if (localVideoRef.current && localStream) {
            localVideoRef.current.srcObject = localStream;
        }
    }, [localStream, callStatus]);

    if (callStatus === 'idle') return null;

    const isIncoming = callStatus === 'receiving';
    const isActive = callStatus === 'active';
    const isCalling = callStatus === 'calling';

    const peerName = callData?.name;
    const peerAvatar = callData?.avatar;

    return (
        <div className="fixed inset-0 z-[100000] flex items-center justify-center bg-[#0a0f18]">

            {/* Remote Video Container */}
            {isActive && remoteStream ? (
                <div
                    onClick={isSwapped ? toggleSwap : undefined}
                    className={
                        isSwapped
                            ? "absolute top-6 right-6 w-32 md:w-48 aspect-[3/4] md:aspect-video bg-gray-900 rounded-xl overflow-hidden shadow-2xl border-2 border-[#334155] z-30 transition-all cursor-pointer hover:border-accent-blue hover:scale-105 group"
                            : "absolute inset-0 w-full h-full bg-black z-0"
                    }
                >
                    <video
                        ref={remoteVideoRef}
                        autoPlay
                        playsInline
                        muted={false}
                        className="w-full h-full object-cover"
                    />
                    {isSwapped && (
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                            <span className="text-white text-xs font-medium bg-black/50 px-2 py-1 rounded">Switch</span>
                        </div>
                    )}
                </div>
            ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#111827]">
                    <div className={`w-32 h-32 rounded-full border-4 border-[#1E293B] overflow-hidden shadow-2xl relative mb-6 ${isIncoming ? 'animate-bounce-slow' : ''}`}>
                        {peerAvatar ? (
                            <img src={peerAvatar} alt={peerName} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full bg-[#1e293b] flex items-center justify-center text-text-secondary">
                                <User size={48} />
                            </div>
                        )}
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2 truncate px-4">{peerName || 'Unknown User'}</h2>
                    {isIncoming && <p className="text-accent-blue font-medium animate-pulse">Incoming Video Call...</p>}
                    {isCalling && <p className="text-text-secondary font-medium">{isOtherOnline ? 'Ringing...' : 'Calling...'}</p>}
                </div>
            )}

            {/* Local Video Container */}
            {(localStream && !isIncoming) && (
                <div
                    onClick={(!isSwapped && isActive && remoteStream) ? toggleSwap : undefined}
                    className={
                        !isSwapped
                            ? `absolute top-6 right-6 w-32 md:w-48 aspect-[3/4] md:aspect-video bg-gray-900 rounded-xl overflow-hidden shadow-2xl border-2 ${isVideoOn ? 'border-[#334155]' : 'border-red-500/50'} z-30 transition-all ${isActive && remoteStream ? 'cursor-pointer hover:border-accent-blue hover:scale-105 group' : ''}`
                            : `absolute inset-0 w-full h-full bg-black z-0`
                    }
                >
                    <video
                        ref={localVideoRef}
                        autoPlay
                        playsInline
                        muted
                        className={`w-full h-full object-cover ${!isVideoOn && 'opacity-0'} scale-x-[-1]`}
                    />
                    {!isVideoOn && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#111827]">
                            <VideoOff size={24} className="text-text-secondary" />
                        </div>
                    )}
                    {!isSwapped && isActive && remoteStream && (
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                            <span className="text-white text-xs font-medium bg-black/50 px-2 py-1 rounded">Switch</span>
                        </div>
                    )}
                </div>
            )}

            {/* Gradient Overlay for Controls */}
            {isActive && <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-black/80 to-transparent pointer-events-none z-10" />}

            {/* Header (Active Call Only) */}
            {isActive && (
                <div className="absolute top-6 left-6 z-20 flex flex-col drop-shadow-md">
                    <h2 className="text-xl font-bold text-white truncate px-2 text-shadow">{peerName}</h2>
                    <p className="text-emerald-400 font-mono text-lg tracking-wider px-2 text-shadow">{formatDuration(callDuration)}</p>
                </div>
            )}

            {/* Controls */}
            <div className="absolute bottom-10 inset-x-0 flex items-center justify-center gap-6 w-full z-20">
                {isIncoming ? (
                    <>
                        <button
                            onClick={rejectCall}
                            className="w-[72px] h-[72px] bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center text-white shadow-lg shadow-red-500/20 transition-transform active:scale-95"
                        >
                            <PhoneOff size={28} />
                        </button>
                        <button
                            onClick={acceptCall}
                            className="w-[72px] h-[72px] bg-emerald-500 hover:bg-emerald-600 rounded-full flex items-center justify-center text-white shadow-lg shadow-emerald-500/30 transition-transform active:scale-95 animate-bounce"
                        >
                            <Video size={28} className="fill-current" />
                        </button>
                    </>
                ) : (
                    <>
                        {isActive && (
                            <>
                                <button
                                    onClick={toggleMute}
                                    className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${isMuted ? 'bg-white text-black' : 'bg-black/50 backdrop-blur border border-white/10 text-white hover:bg-black/70'}`}
                                >
                                    {isMuted ? <MicOff size={24} /> : <Mic size={24} />}
                                </button>
                                <button
                                    onClick={toggleVideo}
                                    className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${!isVideoOn ? 'bg-white text-black' : 'bg-black/50 backdrop-blur border border-white/10 text-white hover:bg-black/70'}`}
                                >
                                    {!isVideoOn ? <VideoOff size={24} /> : <Video size={24} />}
                                </button>
                            </>
                        )}

                        <button
                            onClick={() => endCall(false)}
                            className="w-16 h-16 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center text-white shadow-lg shadow-red-500/20 transition-transform active:scale-95"
                        >
                            <PhoneOff size={26} />
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default VideoCallModal;
