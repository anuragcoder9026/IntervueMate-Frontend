import React, { useEffect, useRef } from 'react';
import { Phone, PhoneOff, Mic, MicOff, User } from 'lucide-react';

const VoiceCallModal = ({
    callStatus,
    callData,
    localStream,
    remoteStream,
    isMuted,
    toggleMute,
    acceptCall,
    rejectCall,
    endCall,
    formatDuration,
    callDuration,
    isOtherOnline
}) => {
    const remoteAudioRef = useRef(null);

    // Attach remote stream to audio element
    useEffect(() => {
        if (remoteAudioRef.current && remoteStream) {
            remoteAudioRef.current.srcObject = remoteStream;
        }
    }, [remoteStream]);

    if (callStatus === 'idle') return null;

    const isIncoming = callStatus === 'receiving';
    const isActive = callStatus === 'active';
    const isCalling = callStatus === 'calling';

    // Data source depends on if we are calling or receiving
    const peerName = isIncoming ? callData?.name : callData?.name;
    const peerAvatar = isIncoming ? callData?.avatar : callData?.avatar;

    return (
        <div className="fixed inset-0 z-[100000] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-md" />

            <div className={`relative bg-[#111827] border border-white/10 rounded-3xl shadow-2xl w-full max-w-[360px] overflow-hidden flex flex-col items-center py-10 px-6 transition-all duration-300 ${isIncoming ? 'animate-pulse-ring' : 'scale-100'}`}>

                {/* Decorative background glow */}
                <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full blur-[80px] opacity-20 pointer-events-none ${isActive ? 'bg-emerald-500' : 'bg-accent-blue'}`} />

                {/* Avatar */}
                <div className="relative mb-6 z-10">
                    <div className={`w-32 h-32 rounded-full border-4 border-[#1E293B] overflow-hidden shadow-2xl relative ${isIncoming ? 'animate-bounce-slow' : ''}`}>
                        {peerAvatar ? (
                            <img src={peerAvatar} alt={peerName} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full bg-[#1e293b] flex items-center justify-center text-text-secondary">
                                <User size={48} />
                            </div>
                        )}

                        {/* Audio visualizer ring effect (fake for active) */}
                        {isActive && (
                            <div className="absolute inset-0 border-[4px] border-emerald-500/50 rounded-full animate-ping pointer-events-none" style={{ animationDuration: '2s' }} />
                        )}
                    </div>
                </div>

                {/* Name & Status */}
                <div className="text-center mb-10 z-10 w-full">
                    <h2 className="text-2xl font-bold text-white mb-2 truncate px-4">{peerName || 'Unknown User'}</h2>

                    {isIncoming && <p className="text-accent-blue font-medium animate-pulse">Incoming Voice Call...</p>}
                    {isCalling && <p className="text-text-secondary font-medium">{isOtherOnline ? 'Ringing...' : 'Calling...'}</p>}
                    {isActive && <p className="text-emerald-400 font-mono text-xl tracking-wider">{formatDuration(callDuration)}</p>}
                </div>

                {/* Controls */}
                <div className="flex items-center justify-center gap-6 w-full z-10">
                    {isIncoming ? (
                        <>
                            <button
                                onClick={rejectCall}
                                className="w-[72px] h-[72px] bg-red-500 hover:bg-red-600 rounded-full flex flex-col items-center justify-center text-white shadow-lg shadow-red-500/20 transition-transform active:scale-95"
                            >
                                <PhoneOff size={28} />
                            </button>
                            <button
                                onClick={acceptCall}
                                className="w-[72px] h-[72px] bg-emerald-500 hover:bg-emerald-600 rounded-full flex flex-col items-center justify-center text-white shadow-lg shadow-emerald-500/30 transition-transform active:scale-95 animate-bounce"
                            >
                                <Phone size={28} className="fill-current" />
                            </button>
                        </>
                    ) : (
                        <>
                            {isActive && (
                                <button
                                    onClick={toggleMute}
                                    className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${isMuted ? 'bg-white text-black' : 'bg-white/10 text-white hover:bg-white/20'}`}
                                >
                                    {isMuted ? <MicOff size={24} /> : <Mic size={24} />}
                                </button>
                            )}

                            <button
                                onClick={() => endCall(false)}
                                className="w-[72px] h-[72px] bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center text-white shadow-lg shadow-red-500/20 transition-transform active:scale-95"
                            >
                                <PhoneOff size={32} />
                            </button>
                        </>
                    )}
                </div>

                {/* Hidden Remote Audio Element */}
                <audio ref={remoteAudioRef} autoPlay playsInline className="hidden" />

                <style jsx>{`
                    @keyframes bounce-slow {
                        0%, 100% { transform: translateY(-5%); }
                        50% { transform: translateY(5%); }
                    }
                    .animate-bounce-slow {
                        animation: bounce-slow 2s infinite ease-in-out;
                    }
                    @keyframes pulse-ring {
                        0% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.4); }
                        70% { box-shadow: 0 0 0 20px rgba(59, 130, 246, 0); }
                        100% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0); }
                    }
                    .animate-pulse-ring {
                        animation: pulse-ring 2s infinite cubic-bezier(0.66, 0, 0, 1);
                    }
                `}</style>
            </div>
        </div>
    );
};

export default VoiceCallModal;
