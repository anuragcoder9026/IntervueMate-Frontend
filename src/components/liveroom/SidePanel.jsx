import React from 'react';
import { Send, Smile, Mic, MicOff, Video, VideoOff, X, Crown } from 'lucide-react';

const SidePanel = ({ activePanel, onClose, messages = [], sendMessage, participants = [], currentUser, hostId }) => {
    const [chatInput, setChatInput] = React.useState('');

    if (!activePanel) return null;

    const handleSendMessage = () => {
        if (!chatInput.trim()) return;
        sendMessage(chatInput);
        setChatInput('');
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    return (
        <div className={`fixed lg:relative inset-0 lg:inset-auto flex flex-col w-full lg:w-[350px] bg-[#111622] border-l border-white/5 h-full z-[60] shrink-0 shadow-[-10px_0_30px_rgba(0,0,0,0.5)]`}>
            <div className="h-14 border-b border-white/5 flex items-center px-4 justify-between bg-[#171c28]">
                <h2 className="font-bold text-sm tracking-widest uppercase">
                    {activePanel === 'chat' ? 'In-Call Messages' : 'Participants'}
                </h2>
                <button
                    onClick={onClose}
                    className="p-1.5 text-text-secondary hover:text-white hover:bg-white/5 rounded-lg transition-colors border border-transparent hover:border-white/10"
                >
                    <X size={18} />
                </button>
            </div>

            {activePanel === 'chat' ? (
                <>
                    <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 custom-scrollbar">
                        {messages.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full text-center p-6">
                                <p className="text-text-secondary text-sm">No messages yet.</p>
                                <p className="text-text-secondary text-[10px] mt-1">Start the conversation!</p>
                            </div>
                        ) : (
                            messages.map((msg, idx) => {
                                const isMe = String(msg.sender?._id) === String(currentUser?._id);
                                return (
                                    <div key={msg._id || idx} className={`flex gap-3 ${isMe ? 'flex-row-reverse' : ''}`}>
                                        <div className="w-8 h-8 rounded-full bg-white/5 flex shrink-0 border border-white/10 overflow-hidden">
                                            {msg.sender?.avatar ? (
                                                <img src={msg.sender.avatar} alt={msg.sender.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full bg-accent-blue/20 flex items-center justify-center text-[10px] font-bold text-accent-blue">
                                                    {msg.sender?.name?.charAt(0) || '?'}
                                                </div>
                                            )}
                                        </div>
                                        <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                                            <div className="flex items-baseline gap-2 mb-0.5">
                                                {!isMe && <span className="text-xs font-bold text-white">{msg.sender?.name}</span>}
                                                <span className="text-[10px] text-text-secondary">
                                                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                                {isMe && <span className="text-xs font-bold text-white">{msg.sender?.name}</span>}
                                            </div>
                                            <p className={`text-sm leading-relaxed p-2.5 rounded-xl border shadow-sm ${
                                                isMe 
                                                ? 'bg-accent-blue/10 border-accent-blue/20 text-white rounded-tr-none' 
                                                : 'bg-[#1C2436] border-white/5 text-text-secondary rounded-tl-none'
                                            }`}>
                                                {msg.text}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                    <div className="p-4 border-t border-white/5 bg-[#171c28]">
                        <div className="flex flex-col bg-[#0A0F1A] rounded-xl border border-white/10 focus-within:border-accent-blue/50 overflow-hidden shadow-inner transition-all">
                            <textarea
                                value={chatInput}
                                onChange={(e) => setChatInput(e.target.value)}
                                onKeyDown={handleKeyPress}
                                placeholder="Type a message..."
                                rows={2}
                                className="w-full bg-transparent border-none text-sm text-white p-3 focus:outline-none placeholder:text-text-secondary/50 resize-none custom-scrollbar"
                            />
                            <div className="flex items-center justify-between px-3 pb-2">
                                <button className="text-text-secondary hover:text-amber-400 transition-colors">
                                    <Smile size={18} />
                                </button>
                                <button 
                                    onClick={handleSendMessage}
                                    className="bg-accent-blue text-white p-1.5 rounded-lg hover:bg-accent-blue-hover transition-colors shadow-md shadow-accent-blue/20"
                                >
                                    <Send size={14} className="ml-0.5" />
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            ) : (
                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    <div className="p-4 flex flex-col gap-6">
                        <div className="space-y-4">
                            <div className="flex items-center justify-between px-1">
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400">Live Participants ({participants.length})</span>
                                <div className="flex gap-1">
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                </div>
                            </div>
                            <div className="space-y-1">
                                {participants.map((p) => (
                                    <ParticipantItem 
                                        key={p._id} 
                                        name={p.name} 
                                        avatar={p.avatar}
                                        isMe={String(p._id) === String(currentUser?._id)}
                                        isHost={String(p._id) === String(hostId)}
                                        micMuted={p.micMuted}
                                        videoOff={p.videoOff}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const ParticipantItem = ({ name, avatar, isHost, isMe, micMuted, videoOff }) => (
    <div className={`flex items-center justify-between p-2 rounded-xl transition-all hover:bg-white/5`}>
        <div className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-full shrink-0 border overflow-hidden ${isMe ? 'border-emerald-500/50' : 'border-white/10'}`}>
                {avatar ? (
                    <img src={avatar} alt={name} className="w-full h-full object-cover" />
                ) : (
                    <div className={`w-full h-full flex items-center justify-center text-[10px] font-bold ${isMe ? 'bg-emerald-500/20 text-emerald-500' : 'bg-white/5 text-text-secondary'}`}>
                        {name?.charAt(0)}
                    </div>
                )}
            </div>
            <div className="flex flex-col">
                <span className="text-sm font-bold text-white leading-none flex items-center gap-1.5">
                    {name} {isMe && <span className="text-[9px] bg-emerald-500/10 text-emerald-500 px-1 rounded uppercase">You</span>}
                    {isHost && <Crown size={10} className="text-amber-400" />}
                </span>
                <span className="text-[9px] text-text-secondary mt-1 uppercase tracking-wider font-medium">
                    Connected
                </span>
            </div>
        </div>
        <div className="flex gap-2 text-text-secondary shrink-0">
            {micMuted ? <MicOff size={14} className="text-red-400" /> : <Mic size={14} className="text-emerald-400" />}
            {videoOff ? <VideoOff size={14} className="text-red-400" /> : <Video size={14} className="text-accent-blue" />}
        </div>
    </div>
);

export default SidePanel;
