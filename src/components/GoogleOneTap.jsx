import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import api from '../utils/api';

const GoogleOneTap = () => {
    const { user } = useSelector((state) => state.auth);

    useEffect(() => {
        // If user is already logged in, cancel any existing prompts
        if (user && window.google) {
            window.google.accounts.id.cancel();
            return;
        }

        const initializeOneTap = () => {
            if (!user && window.google) {
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
                    }
                };

                window.google.accounts.id.initialize({
                    client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
                    callback: handleCallback,
                    cancel_on_tap_outside: false,
                    auto_select: false
                });

                window.google.accounts.id.prompt();
            }
        };

        // If google script is already loaded
        if (window.google) {
            initializeOneTap();
        } else {
            const interval = setInterval(() => {
                if (window.google) {
                    initializeOneTap();
                    clearInterval(interval);
                }
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [user]);

    return null;
};

export default GoogleOneTap;
