import React, { useState, useRef, useEffect } from 'react';
import { FileText, Download, Loader2, X, Play, Pause, Check, CheckCheck, Clock, Phone, PhoneMissed, PhoneOff, Video, VideoOff } from 'lucide-react';

const MessageStatus = ({ status }) => {
    switch (status) {
        case 'sending': return <Clock size={12} className="text-text-secondary/50" />;
        case 'sent': return <Check size={12} className="text-text-secondary/50" />;
        case 'reached': return <CheckCheck size={12} className="text-text-secondary/50" />;
        case 'read': return <CheckCheck size={12} className="text-accent-blue" />;
        default: return null;
    }
};

const AudioPlayer = ({ url, mine }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const audioRef = useRef(null);

    const togglePlay = () => {
        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
    };

    const handleTimeUpdate = () => {
        setCurrentTime(audioRef.current.currentTime);
    };

    const handleLoadedMetadata = () => {
        setDuration(audioRef.current.duration);
    };

    const handleSeek = (e) => {
        const time = (e.target.value / 100) * duration;
        audioRef.current.currentTime = time;
        setCurrentTime(time);
    };

    const formatTime = (time) => {
        const mins = Math.floor(time / 60);
        const secs = Math.floor(time % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="flex items-center gap-3 bg-black/20 p-2.5 py-2 rounded-xl border border-white/5 w-full min-w-0 max-w-[280px]">
            <audio
                ref={audioRef}
                src={url}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onEnded={() => setIsPlaying(false)}
            />
            <button
                onClick={togglePlay}
                className={`w-9 h-9 flex items-center justify-center rounded-full transition-all ${isPlaying ? 'bg-accent-blue/20 text-accent-blue' : 'bg-accent-blue text-white'
                    }`}
            >
                {isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" className="ml-0.5" />}
            </button>
            <div className="flex-1 flex flex-col gap-1">
                <input
                    type="range"
                    min="0"
                    max="100"
                    value={duration ? (currentTime / duration) * 100 : 0}
                    onChange={handleSeek}
                    className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-accent-blue focus:outline-none"
                    style={{
                        background: `linear-gradient(to right, #3b82f6 ${duration ? (currentTime / duration) * 100 : 0}%, rgba(255,255,255,0.1) 0%)`
                    }}
                />
                <div className="flex justify-between text-[9px] text-text-secondary/70 font-medium tabular-nums px-0.5">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(duration)}</span>
                </div>
            </div>
            <style jsx>{`
                input[type='range']::-webkit-slider-thumb {
                    appearance: none;
                    width: 10px;
                    height: 10px;
                    background: #3b82f6;
                    border-radius: 50%;
                    cursor: pointer;
                    border: 2px solid #1e293b;
                    box-shadow: 0 0 5px rgba(0,0,0,0.3);
                }
                input[type='range']::-moz-range-thumb {
                    width: 10px;
                    height: 10px;
                    background: #3b82f6;
                    border: 2px solid #1e293b;
                    border-radius: 50%;
                    cursor: pointer;
                }
            `}</style>
        </div>
    );
};

const ImageGrid = ({ images, setGalleryData }) => {
    const count = images.length;
    if (count === 0) return null;

    if (count === 1) {
        return (
            <img
                src={images[0].url}
                alt="Message"
                className="rounded-lg w-full h-auto max-h-[350px] object-cover cursor-pointer hover:opacity-90 transition-opacity"
                onClick={() => setGalleryData({ images, index: 0 })}
            />
        );
    }

    const gridClass = count === 2 ? 'grid-cols-2' : 'grid-cols-2 grid-rows-2';
    const displayImages = images.slice(0, 4);

    return (
        <div className={`grid gap-1 rounded-lg overflow-hidden w-full max-w-full sm:max-w-[400px] ${gridClass}`}>
            {displayImages.map((img, idx) => (
                <div
                    key={idx}
                    className="relative aspect-square cursor-pointer group hover:opacity-90 transition-opacity"
                    onClick={() => setGalleryData({ images, index: idx })}
                >
                    <img
                        src={img.url}
                        alt={`Photo ${idx + 1}`}
                        className="w-full h-full object-cover"
                    />
                    {idx === 3 && count > 4 && (
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-[2px]">
                            <span className="text-white text-2xl font-bold">+{count - 3}</span>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

const MessageBubble = ({
    msg,
    mine,
    isConsecutive,
    status,
    formatMessageTime,
    setGalleryData,
    handleDownload,
    cancelDownload,
    downloadingFiles,
    downloadedFiles
}) => {
    const images = msg.media?.filter(m => m.type === 'image') || [];
    const otherMedia = msg.media?.filter(m => m.type !== 'image') || [];

    if (msg.type === 'call_event') {
        const isMissed = msg.callEventType === 'missed';
        const isRejected = msg.callEventType === 'rejected';
        const isAnswered = msg.callEventType === 'answered';
        const isVideo = msg.callMode === 'video';

        const Icon = isVideo
            ? (isMissed || isRejected ? VideoOff : Video)
            : (isMissed ? PhoneMissed : isRejected ? PhoneOff : Phone);

        const colorClass = isMissed ? 'text-red-400' : isRejected ? 'text-text-secondary' : 'text-emerald-400';

        const callLabel = isVideo
            ? (isMissed ? 'Missed Video Call' : isRejected ? 'Video Call Declined' : 'Video Call')
            : (isMissed ? 'Missed Voice Call' : isRejected ? 'Call Declined' : 'Voice Call');

        const formatDuration = (seconds) => {
            if (!seconds) return '';
            const m = Math.floor(seconds / 60).toString().padStart(2, '0');
            const s = (seconds % 60).toString().padStart(2, '0');
            return `${m}:${s}`;
        };

        return (
            <div className={`flex ${mine ? 'justify-end' : 'justify-start'} mt-4 mb-2`}>
                <div className={`flex items-center gap-3 px-4 py-2 rounded-xl bg-[#1C2436]/80 border border-white/5 shadow-sm max-w-[85%] sm:max-w-[65%]`}>
                    <div className={`p-2 rounded-full bg-black/20 ${colorClass}`}>
                        <Icon size={18} />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[14px] text-gray-200 font-medium">
                            {callLabel}
                        </span>
                        <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[11px] text-text-secondary">
                                {formatMessageTime(msg.createdAt)}
                            </span>
                            {isAnswered && msg.callDuration > 0 && (
                                <>
                                    <span className="text-[10px] text-text-secondary/50">•</span>
                                    <span className="text-[11px] text-text-secondary">{formatDuration(msg.callDuration)}</span>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={`flex ${mine ? 'justify-end' : 'justify-start'} ${isConsecutive ? 'mt-[2px]' : 'mt-3'} w-full`}>
            <div className={`relative max-w-[85%] sm:max-w-[70%] lg:max-w-[60%] min-w-[60px] ${mine
                ? 'bg-[#1a3a5c] rounded-lg rounded-tr-none'
                : 'bg-[#1C2436] rounded-lg rounded-tl-none'
                } ${!isConsecutive ? '' : mine ? 'rounded-tr-lg' : 'rounded-tl-lg'} shadow-sm overflow-hidden`}>
                {!isConsecutive && (
                    <div className={`absolute top-0 w-3 h-3 ${mine ? '-right-[6px] bg-[#1a3a5c]' : '-left-[6px] bg-[#1C2436]'}`} style={{
                        clipPath: mine ? 'polygon(0 0, 0% 100%, 100% 0)' : 'polygon(100% 0, 0 0, 100% 100%)',
                    }} />
                )}
                <div className="px-3 py-2 pb-1">
                    {msg.media && msg.media.length > 0 && (
                        <div className={`flex flex-col gap-1 mb-1`}>
                            {images.length > 0 && <ImageGrid images={images} setGalleryData={setGalleryData} />}

                            {otherMedia.map((mediaItem, mIdx) => {
                                if (mediaItem.type === 'file') return (
                                    <div key={mIdx} className="mb-1 w-full max-w-[250px] flex gap-3 bg-black/20 p-3 rounded-lg border border-white/5 items-center">
                                        <div className="bg-[#1C2436] p-2 rounded-lg text-accent-blue shrink-0">
                                            <FileText size={24} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-[13px] text-gray-100 font-medium truncate" title={mediaItem.name}>{mediaItem.name}</p>
                                        </div>
                                        {!downloadedFiles[mediaItem.url] && (
                                            <button
                                                onClick={() => downloadingFiles[mediaItem.url] ? cancelDownload(mediaItem) : handleDownload(mediaItem)}
                                                className="p-2 text-text-secondary hover:text-white hover:bg-white/10 rounded-full transition-colors shrink-0"
                                                title={downloadingFiles[mediaItem.url] ? "Cancel Download" : "Download"}
                                            >
                                                {downloadingFiles[mediaItem.url] ? (
                                                    <div className="relative flex items-center justify-center w-[18px] h-[18px]">
                                                        <Loader2 size={18} className="animate-spin text-accent-blue absolute" />
                                                        <X size={8} className="text-accent-blue absolute" strokeWidth={3} />
                                                    </div>
                                                ) : (
                                                    <Download size={18} />
                                                )}
                                            </button>
                                        )}
                                    </div>
                                );
                                if (mediaItem.type === 'video') return (
                                    <div key={mIdx} className="mb-1 rounded-lg overflow-hidden bg-black/40 border border-white/5 relative group max-w-full">
                                        <video
                                            src={mediaItem.url}
                                            controls
                                            className="w-full h-auto max-h-[350px] block"
                                            preload="metadata"
                                        />
                                    </div>
                                );
                                if (mediaItem.type === 'audio') return (
                                    <AudioPlayer key={mIdx} url={mediaItem.url} mine={mine} />
                                );
                                return null;
                            })}
                        </div>
                    )}
                    {msg.text && (
                        <p className="text-[13.5px] text-gray-100 leading-[1.45] whitespace-pre-wrap [word-break:break-word] [overflow-wrap:anywhere] pb-1">
                            {(() => {
                                const urlRegex = /(https?:\/\/[^\s]+)/g;
                                const parts = msg.text.split(urlRegex);
                                return parts.map((part, i) => {
                                    if (part.match(urlRegex)) {
                                        return (
                                            <a
                                                key={i}
                                                href={part}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-accent-blue hover:underline break-all"
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                {part}
                                            </a>
                                        );
                                    }
                                    return part;
                                });
                            })()}
                        </p>
                    )}
                    <div className="flex items-center justify-end gap-1 mt-0.5 ml-auto">
                        <span className="text-[10px] text-text-secondary/70">{formatMessageTime(msg.createdAt)}</span>
                        {mine && <MessageStatus status={status} />}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MessageBubble;
