import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { getMe } from '../store/authSlice';
import { toast } from 'react-toastify';
import { Loader2 } from 'lucide-react';

const AuthSuccess = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchUser = async () => {
            // Success from Google, now get the user data from backend
            const resultAction = await dispatch(getMe());
            if (getMe.fulfilled.match(resultAction)) {
                navigate('/dashboard');
            } else {
                toast.error('Authentication failed. Please try again.');
                navigate('/signup');
            }
        };

        fetchUser();
    }, [dispatch, navigate]);

    return (
        <div className="min-h-screen bg-[#0A0F1A] flex items-center justify-center">
            <div className="text-center">
                <Loader2 size={48} className="text-blue-500 animate-spin mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-white">Authenticating...</h2>
                <p className="text-gray-400">Completing your secure login</p>
            </div>
        </div>
    );
};

export default AuthSuccess;
