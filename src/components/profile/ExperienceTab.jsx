import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateProfile } from '../../store/authSlice';
import { toast } from 'react-toastify';
import { Plus, Building2, Calendar, MapPin, Edit2, Trash2, X, Check, Search } from 'lucide-react';
import { format, differenceInMonths, differenceInYears, parseISO } from 'date-fns';

const ExperienceTab = ({ user, isOwnProfile }) => {
    const dispatch = useDispatch();
    const { isUpdating } = useSelector((state) => state.auth);
    const [isAdding, setIsAdding] = useState(false);
    const [editingId, setEditingId] = useState(null);

    // Form State
    const [formData, setFormData] = useState({
        title: '',
        company: '',
        location: '',
        jobType: 'Full-time',
        startDate: '',
        endDate: '',
        isCurrent: false,
        description: '',
        companyLogo: ''
    });

    const jobTypes = ['Full-time', 'Part-time', 'Self-employed', 'Freelance', 'Internship', 'Trainee', 'Contract'];

    const handleEdit = (exp) => {
        setEditingId(exp._id);
        setFormData({
            ...exp,
            startDate: exp.startDate ? format(new Date(exp.startDate), 'yyyy-MM-dd') : '',
            endDate: exp.endDate ? format(new Date(exp.endDate), 'yyyy-MM-dd') : '',
        });
        setIsAdding(true);
    };

    const handleCancel = () => {
        setIsAdding(false);
        setEditingId(null);
        setFormData({
            title: '',
            company: '',
            location: '',
            jobType: 'Full-time',
            startDate: '',
            endDate: '',
            isCurrent: false,
            description: '',
            companyLogo: ''
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        let updatedExperience;
        if (editingId) {
            updatedExperience = user.experience.map(exp => 
                exp._id === editingId ? { ...formData, _id: editingId } : exp
            );
        } else {
            updatedExperience = [...(user.experience || []), formData];
        }

        try {
            await dispatch(updateProfile({ experience: updatedExperience })).unwrap();
            toast.success(editingId ? 'Experience updated' : 'Experience added');
            handleCancel();
        } catch (err) {
            toast.error(err || 'Failed to update experience');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this experience?')) return;

        const updatedExperience = user.experience.filter(exp => exp._id !== id);
        try {
            await dispatch(updateProfile({ experience: updatedExperience })).unwrap();
            toast.success('Experience deleted');
        } catch (err) {
            toast.error(err || 'Failed to delete experience');
        }
    };

    const calculateDuration = (start, end, isCurrent) => {
        if (!start) return '';
        const startDate = new Date(start);
        const endDate = isCurrent ? new Date() : (end ? new Date(end) : new Date());
        
        const totalMonths = differenceInMonths(endDate, startDate);
        const years = Math.floor(totalMonths / 12);
        const months = totalMonths % 12;

        let duration = '';
        if (years > 0) duration += `${years} yr${years > 1 ? 's' : ''} `;
        if (months > 0) duration += `${months} mo${months > 1 ? 's' : ''}`;
        
        return duration || 'Less than a month';
    };

    return (
        <div className="bg-bg-secondary border border-border-primary rounded-xl p-5 sm:p-8 shadow-sm">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-base font-bold text-white">Experience</h2>
                {isOwnProfile && !isAdding && (
                    <button 
                        onClick={() => setIsAdding(true)}
                        className="text-accent-blue hover:text-blue-400 transition-colors p-1 rounded-md hover:bg-accent-blue/10"
                    >
                        <Plus size={20} />
                    </button>
                )}
            </div>

            {isAdding ? (
                <form onSubmit={handleSubmit} className="space-y-4 bg-bg-primary/30 p-4 rounded-lg border border-border-primary/50 mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="text-[10px] font-bold text-text-secondary uppercase tracking-wider mb-1 block">Title *</label>
                            <input
                                required
                                type="text"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                className="w-full bg-bg-primary border border-border-primary rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-accent-blue"
                                placeholder="e.g. Senior Software Engineer"
                            />
                        </div>
                        <div>
                            <label className="text-[10px] font-bold text-text-secondary uppercase tracking-wider mb-1 block">Company *</label>
                            <input
                                required
                                type="text"
                                value={formData.company}
                                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                                className="w-full bg-bg-primary border border-border-primary rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-accent-blue"
                                placeholder="e.g. Google"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="text-[10px] font-bold text-text-secondary uppercase tracking-wider mb-1 block">Location</label>
                            <input
                                type="text"
                                value={formData.location}
                                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                className="w-full bg-bg-primary border border-border-primary rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-accent-blue"
                                placeholder="e.g. Mountain View, CA"
                            />
                        </div>
                        <div>
                            <label className="text-[10px] font-bold text-text-secondary uppercase tracking-wider mb-1 block">Job Type</label>
                            <select
                                value={formData.jobType}
                                onChange={(e) => setFormData({ ...formData, jobType: e.target.value })}
                                className="w-full bg-bg-primary border border-border-primary rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-accent-blue appearance-none"
                            >
                                {jobTypes.map(type => <option key={type} value={type}>{type}</option>)}
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="text-[10px] font-bold text-text-secondary uppercase tracking-wider mb-1 block">Start Date *</label>
                            <input
                                required
                                type="date"
                                value={formData.startDate}
                                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                className="w-full bg-bg-primary border border-border-primary rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-accent-blue"
                            />
                        </div>
                        <div>
                            <label className="text-[10px] font-bold text-text-secondary uppercase tracking-wider mb-1 block">End Date</label>
                            <input
                                type="date"
                                disabled={formData.isCurrent}
                                value={formData.endDate}
                                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                                className="w-full bg-bg-primary border border-border-primary rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-accent-blue disabled:opacity-50"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            id="isCurrent"
                            checked={formData.isCurrent}
                            onChange={(e) => setFormData({ ...formData, isCurrent: e.target.checked, endDate: e.target.checked ? '' : formData.endDate })}
                            className="w-4 h-4 rounded border-border-primary bg-bg-primary text-accent-blue focus:ring-0 focus:ring-offset-0"
                        />
                        <label htmlFor="isCurrent" className="text-xs text-text-secondary">I am currently working in this role</label>
                    </div>

                    <div>
                        <label className="text-[10px] font-bold text-text-secondary uppercase tracking-wider mb-1 block">Description</label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="w-full bg-bg-primary border border-border-primary rounded-lg p-3 text-sm text-white focus:outline-none focus:border-accent-blue min-h-[100px] resize-none"
                            placeholder="Describe your responsibilities and achievements..."
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                        <button
                            type="button"
                            onClick={handleCancel}
                            className="px-4 py-2 text-xs font-bold text-text-secondary hover:text-white transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isUpdating}
                            className="px-6 py-2 bg-accent-blue hover:bg-blue-600 disabled:opacity-50 text-white text-xs font-bold rounded-lg transition-all flex items-center gap-2"
                        >
                            {isUpdating ? 'Saving...' : (editingId ? 'Update Experience' : 'Add Experience')}
                        </button>
                    </div>
                </form>
            ) : (
                <div className="space-y-8">
                    {user?.experience && user.experience.length > 0 ? (
                        [...user.experience].sort((a, b) => new Date(b.startDate) - new Date(a.startDate)).map((exp, index) => (
                            <React.Fragment key={exp._id || index}>
                                <div className="flex gap-4 items-start group">
                                    <div className="w-12 h-12 bg-bg-primary border border-border-primary rounded-lg flex items-center justify-center shrink-0 shadow-sm overflow-hidden">
                                        {exp.companyLogo ? (
                                            <img src={exp.companyLogo} alt={exp.company} className="w-10 h-10 object-contain" />
                                        ) : (
                                            <Building2 size={24} className="text-text-secondary/50" />
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="text-sm font-bold text-white">{exp.title}</h3>
                                                <p className="text-xs text-text-secondary mt-0.5 font-medium">{exp.company} · {exp.jobType}</p>
                                                <p className="text-[11px] text-text-secondary/70 mt-1">
                                                    {format(new Date(exp.startDate), 'MMM yyyy')} - {exp.isCurrent ? 'Present' : (exp.endDate ? format(new Date(exp.endDate), 'MMM yyyy') : 'Present')} · {calculateDuration(exp.startDate, exp.endDate, exp.isCurrent)}
                                                </p>
                                                {exp.location && (
                                                    <p className="text-[11px] text-text-secondary/50 mt-0.5 flex items-center gap-1">
                                                        <MapPin size={10} /> {exp.location}
                                                    </p>
                                                )}
                                            </div>
                                            {isOwnProfile && (
                                                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button 
                                                        onClick={() => handleEdit(exp)}
                                                        className="p-1.5 text-text-secondary hover:text-accent-blue hover:bg-accent-blue/10 rounded-lg transition-all"
                                                    >
                                                        <Edit2 size={14} />
                                                    </button>
                                                    <button 
                                                        onClick={() => handleDelete(exp._id)}
                                                        className="p-1.5 text-text-secondary hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                        {exp.description && (
                                            <p className="text-sm text-text-secondary mt-3 leading-relaxed whitespace-pre-wrap">
                                                {exp.description}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                {index !== user.experience.length - 1 && (
                                    <div className="h-px bg-border-primary/50 ml-16"></div>
                                )}
                            </React.Fragment>
                        ))
                    ) : (
                        <div className="text-center py-10">
                            <Building2 size={40} className="mx-auto text-text-secondary/20 mb-3" />
                            <p className="text-sm text-text-secondary">
                                {isOwnProfile ? "Showcase your professional journey by adding your experience." : "No experience listed yet."}
                            </p>
                            {isOwnProfile && (
                                <button 
                                    onClick={() => setIsAdding(true)}
                                    className="mt-4 text-xs font-bold text-accent-blue hover:underline"
                                >
                                    Add your first experience
                                </button>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ExperienceTab;
