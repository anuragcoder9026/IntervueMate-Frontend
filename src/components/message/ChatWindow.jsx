import React from 'react';
import { MessageSquare, ShieldOff } from 'lucide-react';
import ChatHeader from './ChatHeader';
import MessageArea from './MessageArea';
import ChatInput from './ChatInput';

const ChatWindow = ({
    activeConversation,
    messages,
    loadingMessages,
    user,
    otherParticipant,
    isOtherOnline,
    isOtherTyping,
    setIsMobileChatOpen,
    handleSend,
    messageInput,
    handleInputChange,
    handleKeyDown,
    showEmojiPicker,
    setShowEmojiPicker,
    onEmojiClick,
    selectedFiles,
    removeSelectedFile,
    handleFileSelect,
    imageInputRef,
    fileInputRef,
    inputRef,
    emojiPickerRef,
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
    isBlocked,
    startCall
}) => {
    if (!activeConversation) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center p-4 bg-[#0d1220]" style={chatBgStyle}>
                <MessageSquare size={64} className="text-text-secondary/20 mb-4" />
                <h3 className="text-xl font-semibold text-text-secondary/50 mb-1">InterviewMate Messenger</h3>
                <p className="text-text-secondary/40 text-sm">Select a chat to start messaging</p>
            </div>
        );
    }

    return (
        <div className={`flex-1 flex flex-col h-full bg-[#0d1220]`}>
            <ChatHeader
                otherParticipant={otherParticipant}
                isOtherOnline={isOtherOnline}
                isOtherTyping={isOtherTyping}
                setIsMobileChatOpen={setIsMobileChatOpen}
                startCall={startCall}
                isBlocked={isBlocked}
            />

            <MessageArea
                messages={messages}
                loadingMessages={loadingMessages}
                user={user}
                messagesEndRef={messagesEndRef}
                chatContainerRef={chatContainerRef}
                chatBgStyle={chatBgStyle}
                formatMessageTime={formatMessageTime}
                isMyMessage={isMyMessage}
                getMessageStatus={getMessageStatus}
                setGalleryData={setGalleryData}
                handleDownload={handleDownload}
                cancelDownload={cancelDownload}
                downloadingFiles={downloadingFiles}
                downloadedFiles={downloadedFiles}
                isOtherTyping={isOtherTyping}
            />

            {isBlocked ? (
                <div className="px-4 py-4 bg-[#111827] border-t border-[#1E293B] shrink-0">
                    <div className="flex items-center justify-center gap-2 bg-red-500/5 border border-red-500/10 rounded-xl py-3 px-4">
                        <ShieldOff size={16} className="text-red-400 shrink-0" />
                        <p className="text-xs text-red-400/80 font-medium">
                            This conversation is blocked. You can't send or receive messages.
                        </p>
                    </div>
                </div>
            ) : (
                <ChatInput
                    messageInput={messageInput}
                    handleInputChange={handleInputChange}
                    handleKeyDown={handleKeyDown}
                    handleSend={handleSend}
                    showEmojiPicker={showEmojiPicker}
                    setShowEmojiPicker={setShowEmojiPicker}
                    onEmojiClick={onEmojiClick}
                    selectedFiles={selectedFiles}
                    removeSelectedFile={removeSelectedFile}
                    handleFileSelect={handleFileSelect}
                    imageInputRef={imageInputRef}
                    fileInputRef={fileInputRef}
                    inputRef={inputRef}
                    emojiPickerRef={emojiPickerRef}
                />
            )}
        </div>
    );
};

export default ChatWindow;

