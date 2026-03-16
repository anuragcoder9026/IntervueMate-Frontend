import React, { createContext, useContext, useState, useRef, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useSocket } from './SocketContext';
import { toast } from 'react-toastify';
import VoiceCallModal from '../components/message/VoiceCallModal';
import VideoCallModal from '../components/message/VideoCallModal';

const CallContext = createContext(null);

export const useCall = () => useContext(CallContext);

const ringtoneSound = new Audio('https://assets.mixkit.co/active_storage/sfx/2855/2855-preview.mp3');
ringtoneSound.loop = true;
const dialingSound = new Audio('https://assets.mixkit.co/active_storage/sfx/2860/2860-preview.mp3');
dialingSound.loop = true;

const configuration = {
    iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' }
    ]
};

export const CallProvider = ({ children }) => {
    const { user } = useSelector((state) => state.auth);
    const { socket, onlineUsers } = useSocket() || {};

    // ---- WEBRTC CALL STATE ----
    const [callStatus, setCallStatus] = useState('idle'); // 'idle', 'calling', 'receiving', 'active'
    const [callData, setCallData] = useState(null); // { signal, from, name, avatar, remoteUserId, callType }
    const [localStream, setLocalStream] = useState(null);
    const [remoteStream, setRemoteStream] = useState(null);
    const [isMuted, setIsMuted] = useState(false);
    const [isVideoOn, setIsVideoOn] = useState(true);
    const [callDuration, setCallDuration] = useState(0);
    const [callType, setCallType] = useState('voice'); // 'voice', 'video'

    const peerConnectionRef = useRef(null);
    const localStreamRef = useRef(null);
    const callTimerRef = useRef(null);
    const autoCancelTimerRef = useRef(null);
    const callStatusRef = useRef('idle');
    const callDataRef = useRef(null);
    const callDurationRef = useRef(0);

    // Sync ref with state
    useEffect(() => {
        callStatusRef.current = callStatus;
    }, [callStatus]);

    useEffect(() => {
        callDataRef.current = callData;
    }, [callData]);

    useEffect(() => {
        callDurationRef.current = callDuration;
    }, [callDuration]);

    const formatDuration = (seconds) => {
        const m = Math.floor(seconds / 60).toString().padStart(2, '0');
        const s = (seconds % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
    };

    const startCallTimer = () => {
        setCallDuration(0);
        callTimerRef.current = setInterval(() => {
            setCallDuration(prev => prev + 1);
        }, 1000);
    };

    const stopCallTimer = () => {
        if (callTimerRef.current) {
            clearInterval(callTimerRef.current);
            callTimerRef.current = null;
        }
        setCallDuration(0);
    };

    const endCall = useCallback((isRemoteEvent = false) => {
        const isRemote = isRemoteEvent === true;
        console.log('📞 Global Call ending. Remote event:', isRemote);

        ringtoneSound.pause();
        ringtoneSound.currentTime = 0;
        dialingSound.pause();
        dialingSound.currentTime = 0;

        if (autoCancelTimerRef.current) {
            clearTimeout(autoCancelTimerRef.current);
            autoCancelTimerRef.current = null;
        }

        if (!isRemote) {
            const currentStatus = callStatusRef.current;
            const currentData = callDataRef.current;
            const targetId = currentData?.remoteUserId;

            // Caller ID is used for history logging, it's either us or them based on who initiated
            const isInitiator = currentData?.isInitiator;
            const callerId = isInitiator ? user._id : currentData?.remoteUserId;

            if (targetId) {
                socket.emit('end_call', {
                    to: targetId,
                    from: user._id,
                    conversationId: currentData?.conversationId,
                    callerId,
                    duration: callTimerRef.current ? callDurationRef.current : 0,
                    isAnswered: !!callTimerRef.current,
                    callType: currentData?.callType
                });
            }
        }

        if (localStreamRef.current) {
            localStreamRef.current.getTracks().forEach(track => track.stop());
            localStreamRef.current = null;
        }

        if (peerConnectionRef.current) {
            peerConnectionRef.current.close();
            peerConnectionRef.current = null;
        }

        setLocalStream(null);
        setRemoteStream(null);
        setCallStatus('idle');
        setCallData(null);
        setIsMuted(false);
        setIsVideoOn(true);
        stopCallTimer();
    }, [socket, user?._id]);

    const getMediaStream = async (type = 'voice') => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: true,
                video: type === 'video'
            });
            setLocalStream(stream);
            localStreamRef.current = stream;
            return stream;
        } catch (err) {
            console.error('Failed to get local stream', err);
            toast.error(type === 'video' ? 'Camera/Microphone access denied' : 'Microphone access denied');
            return null;
        }
    };

    const createPeerConnection = (stream, targetUserId) => {
        if (peerConnectionRef.current) {
            peerConnectionRef.current.close();
        }

        const pc = new RTCPeerConnection(configuration);
        stream.getTracks().forEach(track => pc.addTrack(track, stream));

        pc.onicecandidate = (event) => {
            if (event.candidate) {
                socket.emit('ice_candidate', {
                    to: targetUserId,
                    candidate: event.candidate
                });
            }
        };

        pc.ontrack = (event) => {
            console.log('📡 track received', event.track.kind);
            if (event.streams && event.streams[0]) {
                setRemoteStream(new MediaStream(event.streams[0].getTracks()));
            } else {
                setRemoteStream(new MediaStream([event.track]));
            }
        };

        pc.oniceconnectionstatechange = () => {
            if (pc.iceConnectionState === 'disconnected' || pc.iceConnectionState === 'failed' || pc.iceConnectionState === 'closed') {
                endCall();
            }
        };

        peerConnectionRef.current = pc;
        return pc;
    };

    const startCall = async (targetUser, type = 'voice', conversationId) => {
        if (callStatus !== 'idle') return;

        setCallType(type);
        const normalizedData = {
            name: targetUser.name,
            avatar: targetUser.avatar,
            remoteUserId: targetUser._id,
            callType: type,
            conversationId,
            isInitiator: true
        };
        setCallData(normalizedData);
        setCallStatus('calling');

        if (localStorage.getItem('interviewmate_messaging_sound_enabled') !== 'false') {
            dialingSound.currentTime = 0;
            dialingSound.play().catch(e => console.error('Audio play failed:', e));
        }

        const stream = await getMediaStream(type);
        if (!stream) {
            endCall();
            return;
        }

        const pc = createPeerConnection(stream, targetUser._id);

        try {
            const offer = await pc.createOffer();
            await pc.setLocalDescription(offer);

            socket.emit('call_user', {
                userToCall: targetUser._id,
                signalData: pc.localDescription,
                from: user._id,
                name: user.name,
                avatar: user.avatar,
                callType: type,
                conversationId
            });

            autoCancelTimerRef.current = setTimeout(() => {
                socket.emit('missed_call', {
                    to: targetUser._id,
                    from: user._id,
                    conversationId,
                    callType: type
                });
                endCall(true);
                toast.error('Call was not answered');
            }, 30000);

        } catch (err) {
            console.error('Error creating offer', err);
            endCall();
        }
    };

    const acceptCall = async () => {
        const currentData = callDataRef.current;
        if (!currentData) return;

        ringtoneSound.pause();
        ringtoneSound.currentTime = 0;

        const stream = await getMediaStream(currentData.callType);
        if (!stream) {
            rejectCall();
            return;
        }

        const pc = createPeerConnection(stream, currentData.remoteUserId);

        try {
            await pc.setRemoteDescription(new RTCSessionDescription(currentData.signal));
            const answer = await pc.createAnswer();
            await pc.setLocalDescription(answer);

            socket.emit('answer_call', {
                to: currentData.remoteUserId,
                signal: pc.localDescription
            });

            setCallStatus('active');
            startCallTimer();
        } catch (err) {
            console.error('Error responding to call', err);
            endCall();
        }
    };

    const rejectCall = () => {
        const currentData = callDataRef.current;
        if (currentData) {
            socket.emit('reject_call', {
                to: currentData.remoteUserId,
                from: currentData.from, // The person who called
                conversationId: currentData.conversationId,
                callType: currentData.callType
            });
        }
        endCall(false);
    };

    const toggleMute = () => {
        const stream = localStreamRef.current;
        if (stream) {
            const audioTrack = stream.getAudioTracks()[0];
            if (audioTrack) {
                audioTrack.enabled = !audioTrack.enabled;
                setIsMuted(!audioTrack.enabled);
            }
        }
    };

    const toggleVideo = () => {
        const stream = localStreamRef.current;
        if (stream) {
            const videoTrack = stream.getVideoTracks()[0];
            if (videoTrack) {
                videoTrack.enabled = !videoTrack.enabled;
                setIsVideoOn(videoTrack.enabled);
            }
        }
    };

    // ---- SOCKET EVENT LISTENERS ----
    useEffect(() => {
        if (!socket || !user) return;

        const handleIncomingCall = (data) => {
            console.log('📞 Global Incoming call:', data);

            // If this is a live session handshake, ignore it in the global call UI
            if (data.isLiveSession) {
                console.log('ℹ️ Ignoring live session signaling in CallContext');
                return;
            }

            if (callStatusRef.current !== 'idle') {
                socket.emit('reject_call', {
                    to: data.from,
                    from: user._id
                });
                return;
            }

            const currentCallType = data.callType || 'voice';
            setCallType(currentCallType);

            if (localStorage.getItem('interviewmate_messaging_sound_enabled') !== 'false') {
                ringtoneSound.currentTime = 0;
                ringtoneSound.play().catch(e => console.error('Audio play failed:', e));
            }

            const normalizedData = {
                ...data,
                remoteUserId: data.from,
                callType: currentCallType,
                isInitiator: false
            };
            setCallData(normalizedData);
            setCallStatus('receiving');
        };

        const handleCallAccepted = async (signal) => {
            console.log('📞 Call accepted by remote');
            ringtoneSound.pause();
            dialingSound.pause();

            if (autoCancelTimerRef.current) {
                clearTimeout(autoCancelTimerRef.current);
                autoCancelTimerRef.current = null;
            }

            if (peerConnectionRef.current) {
                try {
                    await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(signal));
                    setCallStatus('active');
                    startCallTimer();
                } catch (err) {
                    console.error('Error setting remote description:', err);
                    endCall();
                }
            }
        };

        const handleCallRejected = () => {
            toast.error('Call was declined');
            endCall(true);
        };

        const handleCallEnded = () => {
            endCall(true);
        };

        const handleCallMissed = () => {
            toast.error('Missed call');
            endCall(true);
        };

        const handleIceCandidate = async (candidate) => {
            if (peerConnectionRef.current && candidate) {
                try {
                    await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(candidate));
                } catch (e) {
                    console.error('Error adding received ice candidate', e);
                }
            }
        };

        socket.on('incoming_call', handleIncomingCall);
        socket.on('call_accepted', handleCallAccepted);
        socket.on('call_rejected', handleCallRejected);
        socket.on('call_ended', handleCallEnded);
        socket.on('call_missed', handleCallMissed);
        socket.on('ice_candidate', handleIceCandidate);

        return () => {
            socket.off('incoming_call', handleIncomingCall);
            socket.off('call_accepted', handleCallAccepted);
            socket.off('call_rejected', handleCallRejected);
            socket.off('call_ended', handleCallEnded);
            socket.off('call_missed', handleCallMissed);
            socket.off('ice_candidate', handleIceCandidate);
        };
    }, [socket, user?._id, endCall]);

    const isOtherOnline = callData && onlineUsers?.has(callData.remoteUserId);

    return (
        <CallContext.Provider value={{
            callStatus,
            callData,
            callType,
            localStream,
            remoteStream,
            isMuted,
            isVideoOn,
            callDuration,
            startCall,
            acceptCall,
            rejectCall,
            endCall,
            toggleMute,
            toggleVideo,
            formatDuration
        }}>
            {children}

            {callType === 'voice' && callStatus !== 'idle' && (
                <VoiceCallModal
                    callStatus={callStatus}
                    callData={callData}
                    localStream={localStream}
                    remoteStream={remoteStream}
                    isMuted={isMuted}
                    toggleMute={toggleMute}
                    acceptCall={acceptCall}
                    rejectCall={rejectCall}
                    endCall={endCall}
                    formatDuration={formatDuration}
                    callDuration={callDuration}
                    isOtherOnline={isOtherOnline}
                />
            )}

            {callType === 'video' && callStatus !== 'idle' && (
                <VideoCallModal
                    callStatus={callStatus}
                    callData={callData}
                    localStream={localStream}
                    remoteStream={remoteStream}
                    isMuted={isMuted}
                    isVideoOn={isVideoOn}
                    toggleMute={toggleMute}
                    toggleVideo={toggleVideo}
                    acceptCall={acceptCall}
                    rejectCall={rejectCall}
                    endCall={endCall}
                    formatDuration={formatDuration}
                    callDuration={callDuration}
                    isOtherOnline={isOtherOnline}
                />
            )}
        </CallContext.Provider>
    );
};
