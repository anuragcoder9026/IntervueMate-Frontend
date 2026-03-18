import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateProfile } from '../../store/authSlice';
import { toast } from 'react-toastify';
import { Trophy, Star, Target, Medal, Award, Plus, Edit2, Trash2, X, Check } from 'lucide-react';

const AchievementsTab = ({ user, isOwnProfile }) => {
    const dispatch = useDispatch();
    const { isUpdating } = useSelector((state) => state.auth);
    const [isAdding, setIsAdding] = useState(false);
    const [editingId, setEditingId] = useState(null);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        badge: 'trophy'
    });

    const badges = [
        { id: 'trophy', icon: Trophy, color: 'text-amber-500', bg: 'bg-amber-500/20' },
        { id: 'star', icon: Star, color: 'text-emerald-500', bg: 'bg-emerald-500/20' },
        { id: 'target', icon: Target, color: 'text-blue-500', bg: 'bg-blue-500/20' },
        { id: 'medal', icon: Medal, color: 'text-purple-500', bg: 'bg-purple-500/20' },
        { id: 'award', icon: Award, color: 'text-rose-500', bg: 'bg-rose-500/20' },
    ];

    const handleEdit = (achievement) => {
        setEditingId(achievement._id);
        setFormData({
            title: achievement.title,
            description: achievement.description,
            badge: achievement.badge || 'trophy'
        });
        setIsAdding(true);
    };

    const handleCancel = () => {
        setIsAdding(false);
        setEditingId(null);
        setFormData({ title: '', description: '', badge: 'trophy' });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        let updatedAchievements;
        if (editingId) {
            updatedAchievements = user.achievements.map(ach => 
                ach._id === editingId ? { ...formData, _id: editingId } : ach
            );
        } else {
            updatedAchievements = [...(user.achievements || []), formData];
        }

        try {
            await dispatch(updateProfile({ achievements: updatedAchievements })).unwrap();
            toast.success(editingId ? 'Achievement updated' : 'Achievement added');
            handleCancel();
        } catch (err) {
            toast.error(err || 'Failed to update achievements');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this achievement?')) return;

        const updatedAchievements = user.achievements.filter(ach => ach._id !== id);
        try {
            await dispatch(updateProfile({ achievements: updatedAchievements })).unwrap();
            toast.success('Achievement deleted');
        } catch (err) {
            toast.error(err || 'Failed to delete achievement');
        }
    };

    const getBadgeConfig = (badgeId) => {
        return badges.find(b => b.id === badgeId) || badges[0];
    };

    return (
        <div className="bg-bg-secondary border border-border-primary rounded-xl p-5 sm:p-8 shadow-sm">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-base font-bold text-white">Achievements</h2>
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
                    <div>
                        <label className="text-[10px] font-bold text-text-secondary uppercase tracking-wider mb-1 block">Title *</label>
                        <input
                            required
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="w-full bg-bg-primary border border-border-primary rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-accent-blue"
                            placeholder="e.g. Open Source Contributor"
                        />
                    </div>

                    <div>
                        <label className="text-[10px] font-bold text-text-secondary uppercase tracking-wider mb-1 block">Description</label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="w-full bg-bg-primary border border-border-primary rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-accent-blue min-h-[80px] resize-none"
                            placeholder="Briefly describe your achievement..."
                        />
                    </div>

                    <div>
                        <label className="text-[10px] font-bold text-text-secondary uppercase tracking-wider mb-2 block">Choose Icon</label>
                        <div className="flex gap-4">
                            {badges.map((b) => (
                                <button
                                    key={b.id}
                                    type="button"
                                    onClick={() => setFormData({ ...formData, badge: b.id })}
                                    className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${
                                        formData.badge === b.id 
                                        ? `${b.bg} ${b.color} ring-2 ring-accent-blue` 
                                        : 'bg-bg-primary text-text-secondary hover:bg-bg-tertiary'
                                    }`}
                                >
                                    <b.icon size={20} />
                                </button>
                            ))}
                        </div>
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
                            {isUpdating ? 'Saving...' : (editingId ? 'Update Achievement' : 'Add Achievement')}
                        </button>
                    </div>
                </form>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {user?.achievements && user.achievements.length > 0 ? (
                        user.achievements.map((ach) => {
                            const config = getBadgeConfig(ach.badge);
                            return (
                                <div key={ach._id} className="p-4 border border-border-primary rounded-xl flex items-center gap-4 bg-bg-primary group relative">
                                    <div className={`w-12 h-12 rounded-full ${config.bg} ${config.color} flex items-center justify-center shrink-0`}>
                                        <config.icon size={24} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-sm font-bold text-white truncate">{ach.title}</h3>
                                        <p className="text-xs text-text-secondary mt-1 line-clamp-2">{ach.description}</p>
                                    </div>
                                    
                                    {isOwnProfile && (
                                        <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button 
                                                onClick={() => handleEdit(ach)}
                                                className="p-1 text-text-secondary hover:text-accent-blue transition-colors"
                                            >
                                                <Edit2 size={12} />
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(ach._id)}
                                                className="p-1 text-text-secondary hover:text-red-400 transition-colors"
                                            >
                                                <Trash2 size={12} />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            );
                        })
                    ) : (
                        <div className="col-span-full text-center py-10 bg-bg-primary/20 rounded-xl border border-dashed border-border-primary">
                            <Trophy size={40} className="mx-auto text-text-secondary/20 mb-3" />
                            <p className="text-sm text-text-secondary">
                                {isOwnProfile ? "No achievements added yet. Showcase your milestones!" : "No achievements listed yet."}
                            </p>
                            {isOwnProfile && (
                                <button 
                                    onClick={() => setIsAdding(true)}
                                    className="mt-4 text-xs font-bold text-accent-blue hover:underline"
                                >
                                    Add your first achievement
                                </button>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default AchievementsTab;
