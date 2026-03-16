import React, { useState, useEffect, useRef } from 'react';
import { X, Calendar, Clock, Globe, Briefcase, Bot, Eye, ChevronDown, Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';
import api from '../../utils/api';

const CustomDropdown = ({ label, value, options, onChange, icon: Icon, placeholder }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const selectedOption = options.find(opt => opt.value === value);

    return (
        <div className="flex flex-col gap-2" ref={dropdownRef}>
            <label className="text-[10px] font-black text-[#a3aed0] uppercase tracking-[0.15em] ml-1">{label}</label>
            <div className="relative">
                <button
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    className={`w-full flex items-center justify-between bg-[#1C2436]/50 text-white text-sm px-5 py-3.5 rounded-2xl border transition-all ${
                        isOpen ? 'border-accent-blue/50 bg-[#1C2436]' : 'border-white/5 hover:border-white/10'
                    }`}
                >
                    <div className="flex items-center gap-3">
                        {Icon && <Icon size={16} className="text-[#a3aed0]/50" />}
                        <span className={value ? 'text-white' : 'text-white/20'}>
                            {selectedOption ? selectedOption.label : placeholder}
                        </span>
                    </div>
                    <ChevronDown size={16} className={`text-[#a3aed0] transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                </button>

                {isOpen && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-[#171c28] border border-white/10 rounded-2xl shadow-[0_16px_32px_-8px_rgba(0,0,0,0.5)] overflow-hidden z-[110] animate-in fade-in slide-in-from-top-2 duration-200">
                        <div className="max-h-[200px] overflow-y-auto custom-scrollbar p-1.5 font-inter">
                            {options.map((opt) => (
                                <button
                                    key={opt.value}
                                    type="button"
                                    onClick={() => {
                                        onChange(opt.value);
                                        setIsOpen(false);
                                    }}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all text-left ${
                                        value === opt.value 
                                            ? 'bg-accent-blue text-white font-bold' 
                                            : 'text-[#a3aed0] hover:bg-white/5 hover:text-white'
                                    }`}
                                >
                                    {opt.icon && <opt.icon size={14} />}
                                    {opt.label}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

const CreateEventModal = ({ isOpen, onClose, onCreate }) => {
    const [formData, setFormData] = useState({
        title: '',
        desc: '',
        date: '',
        time: '',
        theme: 'blue',
        type: 'General Tech Talk',
        visibility: 'Anyone'
    });

    const [joinedGroups, setJoinedGroups] = useState([]);
    const [loadingGroups, setLoadingGroups] = useState(false);

    useEffect(() => {
        if (isOpen) {
            const fetchGroups = async () => {
                setLoadingGroups(true);
                try {
                    const { data } = await api.get('/users/profile/groups');
                    if (data.success) {
                        setJoinedGroups(data.data || []);
                    }
                } catch (err) {
                    console.error('Failed to fetch groups:', err);
                } finally {
                    setLoadingGroups(false);
                }
            };
            fetchGroups();
        }
    }, [isOpen]);

    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        try {
            const visibilityType = formData.visibility === 'Anyone' ? 'Anyone' : 'Group';
            const groupId = formData.visibility === 'Anyone' ? null : formData.visibility;

            const payload = {
                ...formData,
                visibility: visibilityType,
                groupId: groupId
            };

            const { data } = await api.post('/events', payload);

            if (data.success) {
                // If it's a group event, let the user know it's pending approval
                if (visibilityType === 'Group') {
                    toast.info('Session requested! It will appear on the events page once approved by group admins.');
                } else {
                    toast.success('Session published successfully!');
                }
                
                // Pass the created event back up (or just refresh)
                onCreate(data.data);
                onClose();
            }
        } catch (err) {
            const errorMsg = err.response?.data?.error || 'Failed to create session. Please try again.';
            const details = err.response?.data?.details;
            if (details) {
                const detailMsgs = Object.values(details).map(d => d.message).join(', ');
                toast.error(`${errorMsg}: ${detailMsgs}`);
            } else {
                toast.error(errorMsg);
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const typeOptions = [
        { value: 'General Tech Talk', label: 'General Tech Talk' },
        { value: 'Interview Training', label: 'Interview Training' },
        { value: 'Job Opportunity', label: 'Job Opportunity' },
        { value: 'Current News', label: 'Current News' },
        { value: 'Group Study', label: 'Group Study' }
        ];

    const visibilityOptions = [
        { value: 'Anyone', label: 'Anyone' },
        ...joinedGroups.map(g => ({ value: g._id, label: g.name }))
    ];

    return (
        <div className="fixed inset-0 bg-[#0A0F1A]/90 backdrop-blur-md z-[1000] flex items-center justify-center p-2 animate-in fade-in duration-300 font-inter pt-96 md:pt-10 overflow-y-scroll">
            <div className="bg-[#111622] rounded-[32px] w-full max-w-xl border border-white/10 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.6)] flex flex-col overflow-hidden animate-in zoom-in-95 duration-300">
                {/* Header */}
                <div className="flex items-center justify-between px-8 py-4 border-b border-white/5 bg-gradient-to-r from-white/[0.02] to-transparent">
                    <div>
                        <h2 className="text-xl font-black text-white tracking-tight">Create Event</h2>
                        <p className="text-[11px] text-[#a3aed0] font-bold uppercase tracking-[0.2em] mt-0.5 opacity-60">Host a session for the community</p>
                    </div>
                    <button onClick={onClose} className="p-2.5 text-[#a3aed0] hover:text-white rounded-full hover:bg-white/5 border border-white/0 hover:border-white/10 transition-all">
                        <X size={20} shade="none" />
                    </button>
                </div>

                <div className="p-4  flex-1">
                    <form id="createEventForm" onSubmit={handleSubmit} className="space-y-6">
                        {/* Title & Type */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="flex flex-col gap-2">
                                <label className="text-[10px] font-black text-[#a3aed0] uppercase tracking-[0.15em] ml-1">Event Title</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g. Meta Frontend Mock"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className="bg-[#1C2436]/50 text-white text-sm px-5 py-3.5 rounded-2xl border border-white/5 focus:border-accent-blue/50 focus:bg-[#1C2436] outline-none transition-all placeholder:text-white/10"
                                />
                            </div>
                            <CustomDropdown 
                                label="Session Type"
                                value={formData.type}
                                options={typeOptions}
                                onChange={(val) => setFormData({ ...formData, type: val })}
                                placeholder="Select type"
                            />
                        </div>

                        {/* Visibility & Description Row */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="md:col-span-1">
                                <CustomDropdown 
                                    label="Visible To"
                                    value={formData.visibility}
                                    options={visibilityOptions}
                                    onChange={(val) => setFormData({ ...formData, visibility: val })}
                                    icon={Eye}
                                    placeholder="Select visibility"
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-[10px] font-black text-[#a3aed0] uppercase tracking-[0.15em] ml-1">Summary</label>
                                <textarea
                                    required
                                    rows="3"
                                    placeholder="Short brief about your session..."
                                    value={formData.desc}
                                    onChange={(e) => setFormData({ ...formData, desc: e.target.value })}
                                    className="bg-[#1C2436]/50 resize-none text-white text-sm px-5 py-3.5 rounded-2xl border border-white/5 focus:border-accent-blue/50 focus:bg-[#1C2436] outline-none transition-all placeholder:text-white/10"
                                />
                            </div>
                        </div>

                        {/* Date, Time & Theme row */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                            <div className="flex flex-col gap-2 relative">
                                <label className="text-[10px] font-black text-[#a3aed0] uppercase tracking-[0.15em] ml-1">Date</label>
                                <input
                                    type="date"
                                    required
                                    value={formData.date}
                                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                    className="bg-[#1C2436]/50 text-white text-sm px-5 py-3.5 rounded-2xl border border-white/5 focus:border-accent-blue/50 focus:bg-[#1C2436] outline-none transition-all [color-scheme:dark]"
                                />
                            </div>
                            <div className="flex flex-col gap-2 relative">
                                <label className="text-[10px] font-black text-[#a3aed0] uppercase tracking-[0.15em] ml-1">Time</label>
                                <input
                                    type="time"
                                    required
                                    value={formData.time}
                                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                                    className="bg-[#1C2436]/50 text-white text-sm px-5 py-3.5 rounded-2xl border border-white/5 focus:border-accent-blue/50 focus:bg-[#1C2436] outline-none transition-all [color-scheme:dark]"
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-[10px] font-black text-[#a3aed0] uppercase tracking-[0.15em] ml-1">Theme</label>
                                <div className="flex items-center gap-2 h-full py-0.5">
                                    <button type="button" onClick={() => setFormData({ ...formData, theme: 'blue' })} className={`w-10 h-10 rounded-xl border flex items-center justify-center transition-all ${formData.theme === 'blue' ? 'border-blue-500 bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.4)]' : 'border-white/5 bg-white/5 hover:border-white/20'}`}>
                                        <Globe size={18} className={formData.theme === 'blue' ? 'text-white' : 'text-[#a3aed0]'} />
                                    </button>
                                    <button type="button" onClick={() => setFormData({ ...formData, theme: 'emerald' })} className={`w-10 h-10 rounded-xl border flex items-center justify-center transition-all ${formData.theme === 'emerald' ? 'border-emerald-500 bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.4)]' : 'border-white/5 bg-white/5 hover:border-white/20'}`}>
                                        <Briefcase size={18} className={formData.theme === 'emerald' ? 'text-white' : 'text-[#a3aed0]'} />
                                    </button>
                                    <button type="button" onClick={() => setFormData({ ...formData, theme: 'purple' })} className={`w-10 h-10 rounded-xl border flex items-center justify-center transition-all ${formData.theme === 'purple' ? 'border-purple-500 bg-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.4)]' : 'border-white/5 bg-white/5 hover:border-white/20'}`}>
                                        <Bot size={18} className={formData.theme === 'purple' ? 'text-white' : 'text-[#a3aed0]'} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>

                {/* Footer */}
                <div className="px-8 pb-8 flex gap-4">
                    <button
                        onClick={onClose}
                        className="flex-1 px-6 py-4 rounded-[20px] font-bold text-[#a3aed0] bg-white/5 hover:bg-white/10 border border-white/5 transition-all text-sm"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        form="createEventForm"
                        disabled={isSubmitting}
                        className={`flex-[2] bg-accent-blue hover:bg-accent-blue-hover text-white py-4 rounded-[20px] font-black transition-all shadow-xl shadow-accent-blue/20 hover:shadow-accent-blue/30 active:scale-[0.98] text-sm tracking-tight flex items-center justify-center gap-2 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 size={18} className="animate-spin" />
                                <span>Publishing...</span>
                            </>
                        ) : (
                            'Publish Session'
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CreateEventModal;
