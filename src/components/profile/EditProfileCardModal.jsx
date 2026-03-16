import React, { useState, useEffect } from 'react';
import { X, User, MapPin, GraduationCap, Globe, Camera, Loader2 } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { updateProfile, reset } from '../../store/authSlice';

const EditProfileCardModal = ({ isOpen, onClose, initialData = {} }) => {
    const dispatch = useDispatch();
    const { isUpdating, isSuccess } = useSelector((state) => state.auth);
    const [formData, setFormData] = useState({
        name: '',
        headline: '',
        location: '',
        education: '',
        website: '',
        role: 'user',
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name || '',
                headline: initialData.headline || '',
                location: initialData.location || '',
                education: initialData.education || '',
                website: initialData.website || '',
                role: initialData.role || 'user',
            });
        }
    }, [initialData, isOpen]);

    useEffect(() => {
        if (isSuccess && isOpen) {
            onClose();
            dispatch(reset());
        }
    }, [isSuccess, isOpen, onClose, dispatch]);

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(updateProfile(formData));
    };

    return (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className="bg-bg-secondary w-full max-w-2xl rounded-2xl border border-border-primary shadow-2xl relative z-10 overflow-hidden flex flex-col max-h-[90vh] animate-scale-in">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-border-primary shrink-0 bg-bg-secondary/80 backdrop-blur-md sticky top-0 z-20">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <User className="text-accent-blue" size={20} />
                        Edit intro
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 text-text-secondary hover:text-white hover:bg-bg-tertiary rounded-full transition-all active:scale-95"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Name */}
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-text-primary ml-1">Full Name*</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full bg-bg-primary text-text-primary border border-border-primary rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-accent-blue focus:ring-1 focus:ring-accent-blue/20 transition-all placeholder:text-text-secondary/50"
                                required
                            />
                        </div>

                        {/* Headline */}
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-text-primary ml-1">Headline*</label>
                            <textarea
                                name="headline"
                                value={formData.headline}
                                onChange={handleChange}
                                rows="3"
                                className="w-full bg-bg-primary text-text-primary border border-border-primary rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-accent-blue focus:ring-1 focus:ring-accent-blue/20 transition-all placeholder:text-text-secondary/50 resize-none"
                                required
                            />
                        </div>

                        {/* Location & More */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-text-primary ml-1 flex items-center gap-2">
                                    <MapPin size={14} className="text-text-secondary" /> Location
                                </label>
                                <input
                                    type="text"
                                    name="location"
                                    value={formData.location}
                                    onChange={handleChange}
                                    className="w-full bg-bg-primary text-text-primary border border-border-primary rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-accent-blue transition-all"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-text-primary ml-1 flex items-center gap-2">
                                    <GraduationCap size={14} className="text-text-secondary" /> Education
                                </label>
                                <input
                                    type="text"
                                    name="education"
                                    value={formData.education}
                                    onChange={handleChange}
                                    className="w-full bg-bg-primary text-text-primary border border-border-primary rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-accent-blue transition-all"
                                />
                            </div>
                        </div>

                        {/* Personal Website */}
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-text-primary ml-1 flex items-center gap-2">
                                <Globe size={14} className="text-text-secondary" /> Website
                            </label>
                            <input
                                type="url"
                                name="website"
                                value={formData.website}
                                onChange={handleChange}
                                placeholder="https://example.com"
                                className="w-full bg-bg-primary text-text-primary border border-border-primary rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-accent-blue transition-all"
                            />
                        </div>

                        {/* Role Selection */}
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-text-primary ml-1 flex items-center gap-2">
                                <User size={14} className="text-text-secondary" /> Role (Student / Professional)
                            </label>
                            <select
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                                className="w-full bg-bg-primary text-text-primary border border-border-primary rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-accent-blue transition-all cursor-pointer appearance-none"
                            >
                                <option value="student">Student</option>
                                <option value="professional">Professional</option>
                                <option value="user">User</option>
                            </select>
                        </div>
                    </form>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-border-primary bg-bg-tertiary/30 shrink-0 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-6 py-2.5 rounded-full border border-border-primary text-text-primary font-bold text-sm hover:bg-bg-tertiary transition-all active:scale-95"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={isUpdating}
                        className="px-8 py-2.5 rounded-full bg-accent-blue text-white font-bold text-sm hover:bg-blue-600 transition-all shadow-lg shadow-accent-blue/20 active:scale-95 flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isUpdating ? (
                            <>
                                <Loader2 size={16} className="animate-spin" />
                                Saving...
                            </>
                        ) : (
                            'Save'
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditProfileCardModal;
