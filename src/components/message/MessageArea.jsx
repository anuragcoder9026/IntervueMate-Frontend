import React, { useState, useCallback, useEffect } from 'react';
import { Loader2, ChevronDown } from 'lucide-react';
import MessageBubble from './MessageBubble';

const MessageArea = ({
    messages,
    loadingMessages,
    user,
    messagesEndRef,
    chatContainerRef,
    chatBgStyle,
    formatMessageTime,
    isMyMessage,
    getMessageStatus,
    setGalleryData,
    handleDownload,
    cancelDownload,
    downloadingFiles,
    downloadedFiles,
    isOtherTyping
}) => {
    const [showScrollDown, setShowScrollDown] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);

    const handleScroll = useCallback(() => {
        if (!chatContainerRef.current) return;
        const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
        // Show if we are scrolled up more than 150px from bottom
        const distanceToBottom = scrollHeight - scrollTop - clientHeight;
        setShowScrollDown(distanceToBottom > 150);

        // Reset unread count if we're near the bottom
        if (distanceToBottom <= 150) {
            setUnreadCount(0);
        }
    }, [chatContainerRef]);

    useEffect(() => {
        if (!chatContainerRef.current) return;
        const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
        if (scrollHeight - scrollTop - clientHeight > 150) {
            // New message arrived while not at bottom (and not sent by us)
            const lastMessage = messages[messages.length - 1];
            if (lastMessage && !isMyMessage(lastMessage)) {
                setUnreadCount(prev => prev + 1);
            }
        }
    }, [messages, isMyMessage, chatContainerRef]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        setUnreadCount(0);
    };

    return (
        <div className="flex-1 relative flex flex-col overflow-hidden min-h-0" style={chatBgStyle}>
            <div
                ref={chatContainerRef}
                onScroll={handleScroll}
                className="flex-1 overflow-y-auto custom-scrollbar px-3 sm:px-[8%] md:px-[12%] py-4 flex flex-col gap-1"
            >
                {loadingMessages ? (
                    <div className="flex-1 flex items-center justify-center">
                        <Loader2 size={28} className="animate-spin text-accent-blue" />
                    </div>
                ) : messages.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center">
                        <p className="text-text-secondary/40 text-sm bg-[#182233] px-4 py-2 rounded-lg border border-white/5">
                            No messages yet. Say hello! 👋
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="flex justify-center my-3 sticky top-0 z-10">
                            <span className="bg-[#182233] text-text-secondary text-[11px] font-medium px-4 py-1.5 rounded-lg shadow-lg border border-white/5">
                                {new Date(messages[0]?.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                            </span>
                        </div>
                        {messages.map((msg, idx) => {
                            const mine = isMyMessage(msg);
                            const isConsecutive = idx > 0 && isMyMessage(messages[idx - 1]) === mine;
                            const status = getMessageStatus(msg);
                            return (
                                <MessageBubble
                                    key={msg._id || idx}
                                    msg={msg}
                                    mine={mine}
                                    isConsecutive={isConsecutive}
                                    status={status}
                                    formatMessageTime={formatMessageTime}
                                    setGalleryData={setGalleryData}
                                    handleDownload={handleDownload}
                                    cancelDownload={cancelDownload}
                                    downloadingFiles={downloadingFiles}
                                    downloadedFiles={downloadedFiles}
                                />
                            );
                        })}
                        {isOtherTyping && (
                            <div className="flex justify-start mt-2">
                                <div className="bg-[#1C2436] rounded-lg rounded-tl-none px-4 py-3 shadow-sm">
                                    <div className="flex gap-1">
                                        <div className="w-2 h-2 bg-text-secondary/50 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                        <div className="w-2 h-2 bg-text-secondary/50 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                        <div className="w-2 h-2 bg-text-secondary/50 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                    </div>
                                </div>
                            </div>
                        )}
                    </>
                )}
                <div ref={messagesEndRef} />
            </div>

            {showScrollDown && (
                <button
                    onClick={scrollToBottom}
                    className="absolute bottom-4 right-4 sm:right-6 lg:right-8 w-10 h-10 bg-accent-blue/90 hover:bg-accent-blue text-white rounded-full flex items-center justify-center shadow-lg shadow-black/40 backdrop-blur-sm transition-all transform hover:scale-110 active:scale-95 z-20"
                    style={{ animation: 'fadeIn 0.2s ease-out' }}
                >
                    <ChevronDown size={22} />
                    {unreadCount > 0 && (
                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-[10px] font-bold shadow-md border-2 border-[#1E293B]">
                            {unreadCount > 9 ? '9+' : unreadCount}
                        </div>
                    )}
                </button>
            )}
        </div>
    );
};

export default MessageArea;
