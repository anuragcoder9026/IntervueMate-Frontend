import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SuggestionsRow from './SuggestionsRow';
import api from '../../utils/api';
import { Loader2, Sparkles } from 'lucide-react';

const FriendsRightSidebar = () => {
    const navigate = useNavigate();
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSuggestions = async () => {
            try {
                const response = await api.get('/users/profile/suggested');
                if (response.data.success) {
                    setSuggestions(response.data.data);
                }
            } catch (err) {
                console.error('Fetch Suggestions Error:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchSuggestions();
    }, []);

    const handleFollowSuccess = (userId) => {
        setSuggestions(prev => prev.filter(u => u._id !== userId));
    };

    return (
        <div className="w-full lg:w-64 xl:w-[320px] shrink-0 lg:sticky top-24">
            <div className="bg-bg-secondary border border-border-primary rounded-2xl p-5 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="font-bold text-sm tracking-tight text-white flex items-center gap-2">
                        People you may know <Sparkles size={14} className="text-amber-500 animate-pulse" />
                    </h3>
                    <button 
                        onClick={() => navigate('/search')}
                        className="text-[10px] font-bold text-text-secondary hover:text-accent-blue transition-colors uppercase tracking-widest"
                    >
                        See all
                    </button>
                </div>

                <div className="space-y-6">
                    {loading ? (
                        <div className="py-8 flex flex-col items-center justify-center text-text-secondary">
                            <Loader2 size={24} className="animate-spin mb-2" />
                            <p className="text-[10px]">Finding peers...</p>
                        </div>
                    ) : suggestions.length > 0 ? (
                        suggestions.map((sug, idx) => (
                            <React.Fragment key={sug._id}>
                                <SuggestionsRow
                                    userId={sug._id}
                                    name={sug.name}
                                    headline={sug.headline}
                                    education={sug.education}
                                    image={sug.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(sug.name)}&background=random&color=fff`}
                                    onFollowSuccess={handleFollowSuccess}
                                />
                                {idx < suggestions.length - 1 && <div className="h-px bg-border-primary/30 mx-2"></div>}
                            </React.Fragment>
                        ))
                    ) : (
                        <p className="text-[10px] text-text-secondary text-center py-4 italic">No suggestions available</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FriendsRightSidebar;

