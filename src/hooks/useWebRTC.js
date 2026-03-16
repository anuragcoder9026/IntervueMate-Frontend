import { useEffect, useRef, useState, useCallback } from 'react';
import Peer from 'simple-peer';

const useWebRTC = (socket, user, eventId, participants = [], isMuted = false, isVideoOff = false) => {
    const [localStream, setLocalStream] = useState(null);
    const [screenStream, setScreenStream] = useState(null);
    const [remoteStreams, setRemoteStreams] = useState({}); // userId -> MediaStream
    const peers = useRef({}); // userId -> Peer instance
    const [isScreenSharing, setIsScreenSharing] = useState(false);

    // ──────────────────────────────────────────────────────────
    // REFS: Always hold the latest values.
    // Every callback/effect reads from these refs so that
    // no stale closure can ever use an outdated value.
    // ──────────────────────────────────────────────────────────
    const isScreenSharingRef = useRef(false);
    const screenStreamRef = useRef(null);
    const localStreamRef = useRef(null);
    const peerReadyEmittedRef = useRef(false); // prevent duplicate peer_ready

    useEffect(() => { isScreenSharingRef.current = isScreenSharing; }, [isScreenSharing]);
    useEffect(() => { screenStreamRef.current = screenStream; }, [screenStream]);
    useEffect(() => { localStreamRef.current = localStream; }, [localStream]);

    const currentUserId = String(user?._id || user?.id || '');

    // ──────────────────────────────────────────────────────────
    // Helper: returns the video track that should be sent RIGHT NOW.
    // Always reads from refs ⇒ never stale.
    // ──────────────────────────────────────────────────────────
    const getLatestVideoTrack = useCallback(() => {
        if (isScreenSharingRef.current && screenStreamRef.current) {
            return screenStreamRef.current.getVideoTracks()[0];
        }
        return localStreamRef.current?.getVideoTracks()[0];
    }, []); // stable – reads refs internally

    // ──────────────────────────────────────────────────────────
    // Watchdog: whenever screen-share state or streams change,
    // force-sync every connected peer to the correct track.
    // Also runs on a 3-second interval to catch late connections.
    // ──────────────────────────────────────────────────────────
    useEffect(() => {
        const activeTrack = getLatestVideoTrack();
        if (!activeTrack) return;

        // Force keyframe delivery: null → track replacement restarts the
        // encoder, guaranteeing a fresh keyframe for every receiver.
        // This is critical during screen share takeover where the old
        // <video> element consumed the initial keyframe before being unmounted.
        const forceSync = () => {
            const track = getLatestVideoTrack();
            if (!track) return;

            Object.entries(peers.current).forEach(([id, peer]) => {
                try {
                    if (peer._pc && peer.connected) {
                        const sender = peer._pc.getSenders().find(s => s.track?.kind === 'video');
                        if (sender) {
                            if (sender.track !== track) {
                                sender.replaceTrack(track).catch(() => {});
                            } else {
                                // Same track — force a keyframe by null→track swap
                                sender.replaceTrack(null)
                                    .then(() => sender.replaceTrack(track))
                                    .catch(() => {});
                            }
                        }
                    }
                } catch (err) {
                    console.error(`Watchdog error for ${id}:`, err);
                }
            });
        };

        forceSync(); // immediate
        const t1 = setTimeout(forceSync, 500);  // catch late connections
        const t2 = setTimeout(forceSync, 1500); // final safety net
        const interval = setInterval(forceSync, 5000);

        return () => {
            clearTimeout(t1);
            clearTimeout(t2);
            clearInterval(interval);
        };
    }, [isScreenSharing, screenStream, localStream, getLatestVideoTrack]);

    // ──────────────────────────────────────────────────────────
    // createPeer – stable reference (deps do NOT include
    // isScreenSharing / screenStream). Uses refs internally.
    // ──────────────────────────────────────────────────────────
    const createPeer = useCallback((userIdToCall, stream, initiator = false) => {
        userIdToCall = String(userIdToCall);

        // Read the absolute latest values via refs
        const sharing = isScreenSharingRef.current;
        const scrStream = screenStreamRef.current;
        const camStream = localStreamRef.current;

        const activeVideoTrack = sharing && scrStream
            ? scrStream.getVideoTracks()[0]
            : camStream?.getVideoTracks()[0];

        // Build the initial stream with the correct video track
        let initialStream = stream;
        if (activeVideoTrack && stream) {
            const audioTrack = stream.getAudioTracks()[0];
            initialStream = new MediaStream([activeVideoTrack]);
            if (audioTrack) initialStream.addTrack(audioTrack);
        }

        console.log(`[WebRTC] ${initiator ? 'Calling' : 'Answering'} user: ${userIdToCall} (Sharing: ${sharing})`);

        const peer = new Peer({
            initiator,
            trickle: true,
            stream: initialStream || undefined,
            config: {
                iceServers: [
                    { urls: 'stun:stun.l.google.com:19302' },
                    { urls: 'stun:global.stun.twilio.com:3478' },
                    { urls: 'stun:stun1.l.google.com:19302' },
                    { urls: 'stun:stun2.l.google.com:19302' }
                ]
            }
        });

        peer.on('signal', (data) => {
            if (initiator && data.type === 'offer') {
                socket.emit('call_user', {
                    userToCall: userIdToCall,
                    signalData: data,
                    from: currentUserId,
                    name: user?.name,
                    avatar: user?.avatar,
                    conversationId: eventId,
                    isLiveSession: true
                });
            } else if (!initiator && data.type === 'answer') {
                socket.emit('answer_call', {
                    signal: data,
                    to: userIdToCall,
                    from: currentUserId
                });
            } else {
                socket.emit('ice_candidate', {
                    candidate: data,
                    to: userIdToCall,
                    from: currentUserId
                });
            }
        });

        peer.on('connect', () => {
            console.log('✅ [WebRTC] Peer connected:', userIdToCall);

            // Immediately sync to the absolute latest track (read from ref)
            const latestTrack = getLatestVideoTrack();
            if (latestTrack) {
                try {
                    const sender = peer._pc?.getSenders().find(s => s.track?.kind === 'video');
                    if (sender && sender.track !== latestTrack) {
                        sender.replaceTrack(latestTrack);
                        console.log(`📺 [WebRTC] Post-connect sync for ${userIdToCall}`);
                    }
                } catch (err) { /* safe to ignore */ }
            }

            // Delayed re-sync to guarantee keyframe delivery
            setTimeout(() => {
                try {
                    const track = getLatestVideoTrack();
                    if (track && peer._pc) {
                        const s = peer._pc.getSenders().find(x => x.track?.kind === 'video');
                        if (s && s.track !== track) {
                            s.replaceTrack(track);
                        }
                    }
                } catch (_) { /* ignore */ }
            }, 1500);
        });

        peer.on('stream', (remoteStream) => {
            console.log('📡 [WebRTC] Received remote stream from:', userIdToCall);
            setRemoteStreams((prev) => ({
                ...prev,
                [userIdToCall]: remoteStream
            }));
        });

        peer.on('error', (err) => {
            console.error('❌ [WebRTC] Peer error for', userIdToCall, ':', err);
            if (peers.current[userIdToCall]) {
                peers.current[userIdToCall].destroy();
                delete peers.current[userIdToCall];
            }
        });

        peer.on('close', () => {
            console.log('🔌 [WebRTC] Peer closed:', userIdToCall);
            setRemoteStreams((prev) => {
                const next = { ...prev };
                delete next[userIdToCall];
                return next;
            });
            delete peers.current[userIdToCall];
        });

        return peer;
    }, [socket, currentUserId, user, eventId, getLatestVideoTrack]);

    // ──────────────────────────────────────────────────────────
    // Initialize Local Media
    // ⚠️ IMPORTANT: Do NOT emit peer_ready here.
    //    peer_ready is emitted in the signaling effect AFTER
    //    all socket handlers are registered, fixing the race
    //    condition for the lowest-ID user.
    // ──────────────────────────────────────────────────────────
    useEffect(() => {
        let isMounted = true;
        peerReadyEmittedRef.current = false; // reset on new media acquisition

        const startMedia = async () => {
            try {
                console.log('🎥 [WebRTC] Requesting media permissions...');
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: { 
                        width: { ideal: 640 }, 
                        height: { ideal: 480 },
                        facingMode: "user"
                    },
                    audio: {
                        echoCancellation: true,
                        noiseSuppression: true,
                        autoGainControl: true
                    }
                });
                if (isMounted) {
                    console.log('✅ [WebRTC] Media acquired successfully');
                    setLocalStream(stream);
                    // peer_ready is now emitted in the signaling effect
                }
            } catch (err) {
                console.error('❌ [WebRTC] Media permission denied:', err);
                try {
                    const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
                    if (isMounted) {
                        setLocalStream(audioStream);
                        // peer_ready is now emitted in the signaling effect
                    }
                } catch (audioErr) {
                    console.error('❌ [WebRTC] Could not even get audio:', audioErr);
                }
            }
        };

        startMedia();
        return () => { isMounted = false; };
    }, [socket, eventId]);

    // Handle Mute / Video Off at track level
    useEffect(() => {
        if (localStream) {
            localStream.getAudioTracks().forEach(track => { track.enabled = !isMuted; });
            localStream.getVideoTracks().forEach(track => { track.enabled = !isVideoOff; });
        }
        if (screenStream) {
            screenStream.getVideoTracks().forEach(track => { track.enabled = true; });
        }
    }, [localStream, screenStream, isMuted, isVideoOff]);

    // Cleanup tracks on unmount
    useEffect(() => {
        return () => {
            if (localStream) {
                console.log('🧹 [WebRTC] Stopping all local tracks');
                localStream.getTracks().forEach(track => track.stop());
            }
            Object.keys(peers.current).forEach(id => {
                if (peers.current[id]) peers.current[id].destroy();
            });
            peers.current = {};
        };
    }, [localStream]);

    // ──────────────────────────────────────────────────────────
    // Connection Logic & Signaling Handlers
    //
    // CRITICAL FIX: peer_ready is emitted HERE, AFTER all
    // socket handlers are registered. This guarantees that
    // when the server relays incoming_call back to us,
    // our handler is already listening. Previously peer_ready
    // was emitted in the media-init effect (before handlers
    // existed), causing the lowest-ID user to miss the
    // incoming_call signal → permanent black screen.
    // ──────────────────────────────────────────────────────────
    useEffect(() => {
        if (!socket || !localStream || !currentUserId) return;

        // ── 1. Register ALL handlers FIRST ──

        const handlePeerReady = ({ userId: remoteId }) => {
            const remoteIdStr = String(remoteId);
            if (remoteIdStr === currentUserId) return;

            if (peers.current[remoteIdStr]) {
                console.log(`[WebRTC] Destroying stale peer for ${remoteIdStr}`);
                peers.current[remoteIdStr].destroy();
                delete peers.current[remoteIdStr];
            }

            const shouldInitiate = currentUserId > remoteIdStr;
            if (shouldInitiate) {
                console.log(`[WebRTC] Calling ${remoteIdStr} (I have higher ID)`);
                const peer = createPeer(remoteIdStr, localStream, true);
                peers.current[remoteIdStr] = peer;
            }
        };

        const handleIncomingCall = ({ from, signal, conversationId }) => {
            const fromId = String(from);
            if (conversationId !== eventId) return;

            console.log('📞 [WebRTC] Incoming call from:', fromId);

            if (peers.current[fromId]) {
                peers.current[fromId].destroy();
                delete peers.current[fromId];
            }

            const peer = createPeer(fromId, localStream, false);
            peers.current[fromId] = peer;

            try {
                peers.current[fromId].signal(signal);
            } catch (err) {
                console.error('[WebRTC] Signal error:', err);
            }
        };

        const handleCallAccepted = ({ signal, from }) => {
            const fromId = String(from);
            if (peers.current[fromId]) {
                try { peers.current[fromId].signal(signal); }
                catch (err) { console.error('[WebRTC] Accept signal error:', err); }
            }
        };

        const handleIceCandidate = ({ candidate, from }) => {
            const fromId = String(from);
            if (peers.current[fromId]) {
                try { peers.current[fromId].signal(candidate); }
                catch (err) { console.error('[WebRTC] ICE signal error:', err); }
            }
        };

        const handleUserLeft = ({ userId }) => {
            const leaverId = String(userId);
            console.log('👋 [WebRTC] User left:', leaverId);
            if (peers.current[leaverId]) {
                peers.current[leaverId].destroy();
                delete peers.current[leaverId];
            }
            setRemoteStreams(prev => {
                const next = { ...prev };
                delete next[leaverId];
                return next;
            });
        };

        socket.on('peer_ready', handlePeerReady);
        socket.on('user_left_session', handleUserLeft);
        socket.on('incoming_call', handleIncomingCall);
        socket.on('call_accepted', handleCallAccepted);
        socket.on('ice_candidate', handleIceCandidate);

        // ── 2. NOW emit peer_ready (handlers are guaranteed registered) ──
        if (!peerReadyEmittedRef.current) {
            console.log('📡 [WebRTC] Emitting peer_ready (handlers registered first)');
            socket.emit('peer_ready', { eventId });
            peerReadyEmittedRef.current = true;

            // Safety net: re-emit after 3s to catch any edge case where
            // the first emission was processed before a remote user's
            // signaling effect had re-registered its handlers.
            setTimeout(() => {
                if (socket?.connected) {
                    console.log('📡 [WebRTC] Re-emitting peer_ready (safety net)');
                    socket.emit('peer_ready', { eventId });
                }
            }, 3000);
        }

        // ── 3. Fallback: connect to participants already present ──
        participants.forEach(p => {
            const userId = String(p._id);
            if (userId === currentUserId) return;
            if (!peers.current[userId] && currentUserId > userId) {
                console.log(`[WebRTC] Fallback call to ${userId}`);
                const peer = createPeer(userId, localStream, true);
                peers.current[userId] = peer;
            }
        });

        // ── 4. Connection health check ──
        // Every 5 seconds, check for participants that we SHOULD be
        // connected to but aren't. This self-heals any dropped signals.
        const connectionHealthCheck = setInterval(() => {
            participants.forEach(p => {
                const userId = String(p._id);
                if (userId === currentUserId) return;

                const existingPeer = peers.current[userId];
                const peerIsAlive = existingPeer && !existingPeer.destroyed;

                if (!peerIsAlive && currentUserId > userId) {
                    console.log(`🔄 [WebRTC] Health check: reconnecting to ${userId}`);
                    if (existingPeer) {
                        try { existingPeer.destroy(); } catch (_) {}
                        delete peers.current[userId];
                    }
                    const peer = createPeer(userId, localStream, true);
                    peers.current[userId] = peer;
                }
            });
        }, 5000);

        return () => {
            clearInterval(connectionHealthCheck);
            socket.off('peer_ready', handlePeerReady);
            socket.off('user_left_session', handleUserLeft);
            socket.off('incoming_call', handleIncomingCall);
            socket.off('call_accepted', handleCallAccepted);
            socket.off('ice_candidate', handleIceCandidate);
        };
    }, [socket, localStream, currentUserId, createPeer, eventId, participants]);

    // ──────────────────────────────────────────────────────────
    // Stop Screen Share
    // `silent` = true when the server already handled the state
    //   (e.g. screen share was revoked because another user took over)
    // ──────────────────────────────────────────────────────────
    const stopScreenShare = useCallback((providedStream = null, silent = false) => {
        const streamToCleanup = providedStream || screenStreamRef.current;
        const camStream = localStreamRef.current;
        if (!camStream) return;

        if (streamToCleanup) {
            streamToCleanup.getVideoTracks().forEach(t => t.stop());
        }

        const cameraTrack = camStream.getVideoTracks()[0];
        if (cameraTrack) {
            Object.values(peers.current).forEach(peer => {
                try {
                    if (peer._pc) {
                        const sender = peer._pc.getSenders().find(s => s.track?.kind === 'video');
                        if (sender) sender.replaceTrack(cameraTrack);
                    }
                } catch (err) {
                    console.error('Failed to revert track', err);
                }
            });
        }

        setIsScreenSharing(false);
        setScreenStream(null);
        if (!silent && socket && eventId) {
            socket.emit('session_screen_share', { eventId, isSharing: false });
            console.log('📤 [WebRTC] Sent screen_share: false');
        }
    }, [socket, eventId]);

    // Listen for screen share revocation (another user took over sharing)
    useEffect(() => {
        if (!socket) return;
        const handleRevoked = () => {
            console.log('🚫 [WebRTC] Screen share revoked — another user took over');
            stopScreenShare(null, true); // silent: server already updated state
        };
        socket.on('screen_share_revoked', handleRevoked);
        return () => socket.off('screen_share_revoked', handleRevoked);
    }, [socket, stopScreenShare]);

    // ──────────────────────────────────────────────────────────
    // Toggle Screen Share
    // ──────────────────────────────────────────────────────────
    const toggleScreenShare = useCallback(async () => {
        if (!isScreenSharingRef.current) {
            try {
                const displayStream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: false });
                const screenTrack = displayStream.getVideoTracks()[0];

                setScreenStream(displayStream);
                setIsScreenSharing(true);

                // Immediately swap track on all connected peers
                Object.values(peers.current).forEach(peer => {
                    try {
                        if (peer._pc) {
                            const sender = peer._pc.getSenders().find(s => s.track?.kind === 'video');
                            if (sender) {
                                sender.replaceTrack(screenTrack);
                            }
                        }
                    } catch (err) {
                        console.error('Failed to replace track', err);
                    }
                });

                // Force keyframe delivery with delayed re-syncs.
                // Receivers may have unmounted/remounted their <video> elements
                // during the layout switch, consuming the initial keyframe.
                [500, 1500].forEach(delay => {
                    setTimeout(() => {
                        const track = screenStreamRef.current?.getVideoTracks()[0];
                        if (!track) return;
                        Object.values(peers.current).forEach(peer => {
                            try {
                                if (peer._pc && peer.connected) {
                                    const sender = peer._pc.getSenders().find(s => s.track?.kind === 'video');
                                    if (sender) {
                                        sender.replaceTrack(null)
                                            .then(() => sender.replaceTrack(track))
                                            .catch(() => {});
                                    }
                                }
                            } catch (_) {}
                        });
                    }, delay);
                });

                if (socket && eventId) {
                    socket.emit('session_screen_share', { eventId, isSharing: true });
                }

                screenTrack.onended = () => {
                    console.log('🚫 [WebRTC] Screen track ended via browser UI');
                    stopScreenShare(displayStream);
                };
            } catch (err) {
                console.error("Error sharing screen:", err);
            }
        } else {
            stopScreenShare();
        }
    }, [socket, eventId, stopScreenShare]);

    return { 
        localStream: isScreenSharing ? screenStream : localStream, 
        remoteStreams, 
        isScreenSharing, 
        toggleScreenShare 
    };
};

export default useWebRTC;
