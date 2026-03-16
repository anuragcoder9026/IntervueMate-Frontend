import React, { useState } from 'react';
import {
    Mic, MicOff, Video, VideoOff, MonitorUp, MonitorOff,
    Hand, MessageSquare, Users, PhoneOff,
    Smile
} from 'lucide-react';

const REACTION_EMOJIS = ['👍', '❤️', '😂', '🎉', '🔥', '👏', '😮', '🚀', '💯', '✨'];

const RoomControls = ({
    isMuted, setIsMuted,
    isVideoOff, setIsVideoOff,
    activePanel, setActivePanel,
    onLeave,
    isHost,
    sessionStatus,
    onStartSession,
    onEndSession,
    onEmojiReaction,
    onRaiseHand,
    isScreenSharing,
    toggleScreenShare
}) => {
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);

    return (
        <div className="absolute mb-2 bottom-4 left-1/2 -translate-x-[80%] max-w-[calc(100vw-1rem)] flex items-center gap-2 sm:gap-4 bg-[#171c28] px-2 sm:px-4 py-2 sm:py-3 rounded-2xl border border-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.5)] z-[60] w-fit">

            <div className="flex items-center gap-1 sm:gap-2 pr-2 sm:pr-4 border-r border-white/10">
                <button
                    onClick={() => setIsMuted(!isMuted)}
                    className={`w-8 h-8 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl flex items-center justify-center transition-all ${isMuted ? 'bg-red-500/20 text-red-500 hover:bg-red-500/30 border border-red-500/30' : 'bg-white/5 text-white hover:bg-white/10 border border-transparent'}`}
                >
                    {isMuted ? <MicOff size={16} className="sm:w-5 sm:h-5" /> : <Mic size={16} className="sm:w-5 sm:h-5" />}
                </button>
                <button
                    onClick={() => setIsVideoOff(!isVideoOff)}
                    className={`w-8 h-8 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl flex items-center justify-center transition-all ${isVideoOff ? 'bg-red-500/20 text-red-500 hover:bg-red-500/30 border border-red-500/30' : 'bg-white/5 text-white hover:bg-white/10 border border-transparent'}`}
                >
                    {isVideoOff ? <VideoOff size={16} className="sm:w-5 sm:h-5" /> : <Video size={16} className="sm:w-5 sm:h-5" />}
                </button>
            </div>

            <div className="flex items-center gap-1 sm:gap-2 pr-1 sm:pr-4 border-r border-white/10">
                <button 
                    onClick={toggleScreenShare}
                    className={`hidden sm:flex w-12 h-12 rounded-xl items-center justify-center transition-all border ${isScreenSharing ? 'bg-accent-blue text-white shadow-lg shadow-accent-blue/30 border-accent-blue/50' : 'bg-white/5 text-white hover:bg-white/10 border-transparent hover:border-white/5'}`}
                    title={isScreenSharing ? "Stop Sharing" : "Share Screen"}
                >
                    {isScreenSharing ? <MonitorOff size={20} /> : <MonitorUp size={20} />}
                </button>
                {/* Emoji Button & Picker Container */}
                <div className="relative">
                    <button 
                        onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                        className={`w-8 h-8 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl flex items-center justify-center transition-all border ${showEmojiPicker ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' : 'bg-white/5 text-amber-400 hover:bg-white/10 border-transparent hover:border-white/5'}`}
                    >
                        <Smile size={16} className="sm:w-5 sm:h-5" />
                    </button>

                    {/* Emoji Picker - Simplified classes for reliable visibility */}
                    {showEmojiPicker && (
                        <div className="absolute bottom-full mb-4 left-1/2 -translate-x-1/2 bg-[#111827] rounded-2xl border border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.5)] p-2 flex gap-1 z-[100] min-w-max">
                            {REACTION_EMOJIS.map((emoji) => (
                                <button
                                    key={emoji}
                                    onClick={() => {
                                        onEmojiReaction?.(emoji);
                                        setShowEmojiPicker(false);
                                    }}
                                    className="w-10 h-10 rounded-xl hover:bg-white/10 flex items-center justify-center text-2xl transition-all hover:scale-125"
                                >
                                    {emoji}
                                </button>
                            ))}
                            {/* Little arrow at the bottom */}
                            <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-[#111827] border-r border-b border-white/20 rotate-45" />
                        </div>
                    )}
                </div>

             

                {/* Raise Hand Button */}
                <button 
                    onClick={() => onRaiseHand?.()}
                    className="w-8 h-8 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-white transition-all border border-transparent hover:border-white/5 active:scale-90 active:bg-amber-500/20"
                >
                    <Hand size={16} className="sm:w-5 sm:h-5" />
                </button>
            </div>

            <div className="flex items-center gap-1 sm:gap-2">
                <button
                    onClick={() => setActivePanel(activePanel === 'participants' ? null : 'participants')}
                    className={`w-8 h-8 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl flex items-center justify-center transition-all border ${activePanel === 'participants' ? 'bg-accent-blue/20 text-accent-blue border-accent-blue/30' : 'bg-white/5 text-white hover:bg-white/10 border-transparent hover:border-white/5'}`}
                >
                    <Users size={16} className="sm:w-5 sm:h-5" />
                </button>
                <button
                    onClick={() => setActivePanel(activePanel === 'chat' ? null : 'chat')}
                    className={`w-8 h-8 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl flex items-center justify-center transition-all border relative ${activePanel === 'chat' ? 'bg-accent-blue/20 text-accent-blue border-accent-blue/30' : 'bg-white/5 text-white hover:bg-white/10 border-transparent hover:border-white/5'}`}
                >
                    <MessageSquare size={16} className="sm:w-5 sm:h-5" />
                    <span className="absolute top-1 right-1 sm:top-2 sm:right-2 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-red-500 rounded-full border border-[#171c28]" />
                </button>

                {isHost ? (
                    sessionStatus !== 'live' ? (
                        <button
                            onClick={onStartSession}
                            className="h-8 sm:h-12 px-2.5 sm:px-6 rounded-lg sm:rounded-xl bg-accent-blue hover:bg-accent-blue/80 flex items-center justify-center text-white font-black uppercase tracking-wider transition-all shadow-lg shadow-accent-blue/20 text-[9px] sm:text-sm ml-1 sm:ml-4"
                        >
                            Start Session
                        </button>
                    ) : (
                        <button
                            onClick={onEndSession}
                            className="h-8 sm:h-12 px-2.5 sm:px-6 rounded-lg sm:rounded-xl bg-red-500 hover:bg-amber-600 flex items-center justify-center text-white font-black uppercase tracking-wider transition-all shadow-lg shadow-amber-500/20 text-[9px] sm:text-sm ml-1 sm:ml-4"
                        >
                            End Session
                        </button>
                    )
                ) : (
                    <button
                        onClick={onLeave}
                        className="h-8 sm:h-12 px-2.5 sm:px-6 rounded-lg sm:rounded-xl bg-red-500 hover:bg-red-600 flex items-center justify-center text-white font-black uppercase tracking-wider transition-all shadow-lg shadow-red-500/20 text-[9px] sm:text-sm ml-1 sm:ml-4"
                    >
                        <PhoneOff size={14} className="sm:mr-2 hidden sm:block" />
                        Leave
                    </button>
                )}
            </div>
        </div>
    );
};

export default RoomControls;
