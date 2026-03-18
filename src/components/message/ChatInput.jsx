import React, { useState, useRef, useEffect } from 'react';
import { Smile, Plus, Paperclip, Send, Mic, X, FileText, Trash2, Check, Video } from 'lucide-react';
import EmojiPicker from 'emoji-picker-react';

const ChatInput = ({
    messageInput,
    handleInputChange,
    handleKeyDown,
    handleSend,
    showEmojiPicker,
    setShowEmojiPicker,
    onEmojiClick,
    selectedFiles,
    removeSelectedFile,
    handleFileSelect,
    imageInputRef,
    fileInputRef,
    inputRef,
    emojiPickerRef
}) => {
    // Recording state
    const [isRecording, setIsRecording] = useState(false);
    const [recordingTime, setRecordingTime] = useState(0);
    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);
    const timerRef = useRef(null);

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;
            audioChunksRef.current = [];

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    audioChunksRef.current.push(event.data);
                }
            };

            mediaRecorder.onstop = () => {
                const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
                // We don't send here because stop could be from 'cancel'
            };

            mediaRecorder.start();
            setIsRecording(true);
            setRecordingTime(0);
            timerRef.current = setInterval(() => {
                setRecordingTime(prev => prev + 1);
            }, 1000);
        } catch (err) {
            console.error('Error accessing microphone:', err);
            alert('Could not access microphone. Please check permissions.');
        }
    };

    const stopRecording = (send = true) => {
        if (!mediaRecorderRef.current) return;

        mediaRecorderRef.current.onstop = () => {
            if (send && audioChunksRef.current.length > 0) {
                const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
                // Create a File object from blob so it has a name
                const audioFile = new File([audioBlob], `voice_message_${Date.now()}.webm`, { type: 'audio/webm' });
                handleSend(audioFile);
            }
            // Stop all tracks to release microphone
            mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
        };

        mediaRecorderRef.current.stop();
        clearInterval(timerRef.current);
        setIsRecording(false);
        setRecordingTime(0);
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
            if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
                mediaRecorderRef.current.stop();
                mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
            }
        };
    }, []);

    return (
        <div className="px-2 sm:px-4 py-3 bg-[#111827] border-t border-[#1E293B] relative shrink-0">
            {/* Selected files preview */}
            {selectedFiles.length > 0 && !isRecording && (
                <div className="flex flex-wrap gap-2 mb-3 bg-black/20 p-2 rounded-lg border border-white/5 max-h-[140px] overflow-y-auto">
                    {selectedFiles.map((sf, index) => (
                        <div key={index} className="relative w-20 h-20 rounded-md overflow-hidden bg-[#1C2436] border border-white/10 shrink-0">
                            {sf.type === 'image' ? (
                                <img src={sf.previewUrl} alt="Preview" className="w-full h-full object-cover" />
                            ) : sf.type === 'video' ? (
                                <div className="w-full h-full flex flex-col items-center justify-center text-accent-blue bg-black/40 p-2">
                                    <Video size={28} />
                                    <span className="text-[9px] text-white mt-1 truncate w-full text-center block" title={sf.file.name}>{sf.file.name}</span>
                                </div>
                            ) : (
                                <div className="w-full h-full flex flex-col items-center justify-center text-accent-blue p-2">
                                    <FileText size={28} />
                                    <span className="text-[9px] text-white mt-1 truncate w-full text-center block" title={sf.file.name}>{sf.file.name}</span>
                                </div>
                            )}
                            <button
                                onClick={() => removeSelectedFile(index)}
                                className="absolute top-1 right-1 bg-black/70 hover:bg-white text-white hover:text-black p-1 rounded-full text-xs transition-colors backdrop-blur-md"
                            >
                                <X size={12} strokeWidth={3} />
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* Hidden file inputs */}
            <input
                type="file"
                multiple
                accept="image/*,video/*"
                className="hidden"
                ref={imageInputRef}
                onChange={(e) => handleFileSelect(e, 'image')}
            />
            <input
                type="file"
                multiple
                className="hidden"
                ref={fileInputRef}
                onChange={(e) => handleFileSelect(e, 'file')}
            />

            {/* Emoji Picker */}
            {showEmojiPicker && (
                <div
                    ref={emojiPickerRef}
                    className="absolute bottom-[calc(100%+10px)] left-0 sm:left-[8%] md:left-[12%] z-50 shadow-2xl rounded-lg overflow-hidden border border-white/10 emoji-picker-container"
                >
                    <EmojiPicker
                        onEmojiClick={onEmojiClick}
                        theme="dark"
                        skinTonesDisabled
                        searchDisabled
                        width={320}
                        height={400}
                        previewConfig={{ showPreview: false }}
                    />
                    <style>{`
                        .emoji-picker-container .epr-body::-webkit-scrollbar {
                            width: 4px;
                        }
                        .emoji-picker-container .epr-body::-webkit-scrollbar-track {
                            background: transparent;
                        }
                        .emoji-picker-container .epr-body::-webkit-scrollbar-thumb {
                            background: #374151;
                            border-radius: 10px;
                        }
                        .EmojiPickerReact {
                            --epr-bg-color: #111827 !important;
                            --epr-category-label-bg-color: #111827 !important;
                            --epr-picker-border-color: transparent !important;
                        }
                    `}</style>
                </div>
            )}

            <div className="flex items-center gap-1.5 sm:gap-2">
                {isRecording ? (
                    <div className="flex-1 flex items-center bg-[#1C2436] rounded-full px-2 sm:px-4 py-2 border border-accent-blue/30 animate-in fade-in slide-in-from-bottom-2 duration-300 min-w-0">
                        <div className="flex items-center gap-3 flex-1">
                            <div className="relative flex items-center">
                                <div className="w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse mr-2" />
                                <span className="text-sm font-medium text-white tabular-nums">{formatTime(recordingTime)}</span>
                            </div>
                            <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
                                <div className="h-full bg-red-500/50 animate-[voice-recording_1.5s_infinite]" style={{ width: '40%' }} />
                            </div>
                        </div>
                        <div className="flex items-center gap-2 ml-4">
                            <button
                                onClick={() => stopRecording(false)}
                                className="p-2 text-text-secondary hover:text-red-400 transition-colors"
                            >
                                <Trash2 size={20} />
                            </button>
                            <button
                                onClick={() => stopRecording(true)}
                                className="p-2 bg-accent-blue text-white rounded-full shadow-lg shadow-accent-blue/20 hover:scale-105 transition-all"
                            >
                                <Send size={18} />
                            </button>
                        </div>
                        <style>{`
                            @keyframes voice-recording {
                                0% { transform: translateX(-100%); }
                                100% { transform: translateX(250%); }
                            }
                        `}</style>
                    </div>
                ) : (
                    <>
                        <div className="flex-1 flex items-center bg-[#1C2436] rounded-full border border-white/5 focus-within:border-accent-blue/20 transition-all px-1 sm:px-1.5 min-w-0">
                            <button onClick={() => imageInputRef.current?.click()} className="p-2 text-text-secondary hover:text-white rounded-full hover:bg-white/5 transition-all shrink-0 relative group">
                                <Plus size={20} strokeWidth={2} />
                                <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black/80 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">Images</span>
                            </button>
                            <button onClick={() => setShowEmojiPicker(!showEmojiPicker)} className={`p-2 rounded-full transition-all shrink-0 ${showEmojiPicker ? 'text-accent-blue bg-accent-blue/10' : 'text-text-secondary hover:text-white hover:bg-white/5'}`}>
                                <Smile size={20} />
                            </button>
                            <input
                                ref={inputRef}
                                type="text"
                                value={messageInput}
                                onChange={handleInputChange}
                                onKeyDown={handleKeyDown}
                                placeholder="Type a message"
                                className="flex-1 bg-transparent text-[14px] text-gray-200 placeholder-text-secondary/50 px-2 py-3 focus:outline-none min-w-0"
                            />
                            <button onClick={() => fileInputRef.current?.click()} className="p-2 text-text-secondary hover:text-white rounded-full hover:bg-white/5 transition-all shrink-0 relative group">
                                <Paperclip size={20} className="rotate-45" />
                                <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black/80 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">Files</span>
                            </button>
                        </div>
                        {messageInput.trim() || selectedFiles.length > 0 ? (
                            <button onClick={() => handleSend()} className="p-2 sm:p-3 bg-accent-blue hover:bg-accent-blue-hover text-white rounded-full transition-all shadow-lg shadow-accent-blue/25 shrink-0">
                                <Send size={20} />
                            </button>
                        ) : (
                            <button onClick={startRecording} className="p-2 sm:p-3 bg-[#1C2436] text-text-secondary hover:text-white rounded-full border border-white/5 hover:border-white/10 transition-all shrink-0 group">
                                <Mic size={20} className="group-hover:text-accent-blue transition-colors" />
                            </button>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default ChatInput;
