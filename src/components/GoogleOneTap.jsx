import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import api from '../utils/api';

const GoogleOneTap = () => {
    const { user } = useSelector((state) => state.auth);
    const initializedRef = useRef(false);

    useEffect(() => {
        let isMounted = true;
        let interval;

        // If user is already logged in, no need to show prompt
        if (user && window.google) {
            window.google.accounts.id.cancel();
            initializedRef.current = false;
            return;
        }

        const initializeOneTap = () => {
            if (!user && window.google && !initializedRef.current && isMounted) {
                const handleCallback = async (response) => {
                    try {
                        const res = await api.post('/auth/google/onetap', {
                            credential: response.credential
                        });

                        if (res.data.success) {
                            // User logged in via One Tap, refresh to update app state
                            window.location.reload();
                        }
                    } catch (error) {
                        console.error('One Tap Error:', error);
                        initializedRef.current = false;
                    }
                };

                try {
                    window.google.accounts.id.initialize({
                        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
                        callback: handleCallback,
                        cancel_on_tap_outside: false,
                        use_fedcm_for_prompt: true, // Opt-in to FedCM specifically to fix migration warning
                        auto_select: false
                    });

                    window.google.accounts.id.prompt((notification) => {
                        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
                            console.log('One Tap not displayed or skipped:', notification.getNotDisplayedReason() || notification.getSkippedReason());
                        }
                    });
                    
                    initializedRef.current = true;
                } catch (error) {
                    console.error("Failed to initialize Google One Tap", error);
                    initializedRef.current = false;
                }
            }
        };

        // If google script is already loaded
        if (window.google) {
            // Small delay to ensure any previous prompt is cancelled/cleared from DOM
            setTimeout(() => {
                if (isMounted) initializeOneTap();
            }, 100);
        } else {
            interval = setInterval(() => {
                if (window.google && isMounted) {
                    initializeOneTap();
                    clearInterval(interval);
                }
            }, 1000);
        }

        return () => {
            isMounted = false;
            if (interval) clearInterval(interval);
            if (window.google) {
                window.google.accounts.id.cancel();
            }
            initializedRef.current = false;
        };
    }, [user]);

    return null;
};

export default GoogleOneTap;
