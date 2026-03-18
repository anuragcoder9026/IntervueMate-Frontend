import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateProfile } from '../../store/authSlice';
import { toast } from 'react-toastify';
import { Edit2, Check, X, Plus } from 'lucide-react';

const AboutTab = ({ user, isOwnProfile }) => {
    const dispatch = useDispatch();
    const { isUpdating } = useSelector((state) => state.auth);

    const [isEditingAbout, setIsEditingAbout] = useState(false);
    const [aboutText, setAboutText] = useState(user?.about || '');

    const [isEditingSkills, setIsEditingSkills] = useState(false);
    const [skillsList, setSkillsList] = useState(user?.skills || []);
    const [newSkill, setNewSkill] = useState('');

    useEffect(() => {
        setAboutText(user?.about || '');
        setSkillsList(user?.skills || []);
    }, [user]);

    const handleUpdateAbout = async () => {
        try {
            await dispatch(updateProfile({ about: aboutText })).unwrap();
            setIsEditingAbout(false);
            toast.success('About section updated');
        } catch (err) {
            toast.error(err || 'Failed to update about section');
        }
    };

    const handleUpdateSkills = async () => {
        try {
            await dispatch(updateProfile({ skills: skillsList })).unwrap();
            setIsEditingSkills(false);
            toast.success('Skills updated');
        } catch (err) {
            toast.error(err || 'Failed to update skills');
        }
    };

    const addSkill = (e) => {
        e.preventDefault();
        if (newSkill.trim() && !skillsList.includes(newSkill.trim())) {
            setSkillsList([...skillsList, newSkill.trim()]);
            setNewSkill('');
        }
    };

    const removeSkill = (skillToRemove) => {
        setSkillsList(skillsList.filter(skill => skill !== skillToRemove));
    };

    return (
        <div className="bg-bg-secondary border border-border-primary rounded-xl p-5 sm:p-8 shadow-sm">
            {/* About Section */}
            <div className="mb-8">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-base font-bold text-white">About</h2>
                    {isOwnProfile && !isEditingAbout && (
                        <button
                            onClick={() => setIsEditingAbout(true)}
                            className="p-1.5 text-text-secondary hover:text-white hover:bg-white/5 rounded-lg transition-all"
                        >
                            <Edit2 size={16} />
                        </button>
                    )}
                    {isEditingAbout && (
                        <div className="flex gap-2">
                            <button
                                onClick={() => setIsEditingAbout(false)}
                                className="p-1.5 text-text-secondary hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
                            >
                                <X size={18} />
                            </button>
                            <button
                                onClick={handleUpdateAbout}
                                disabled={isUpdating}
                                className="p-1.5 text-accent-blue hover:bg-accent-blue/10 rounded-lg transition-all disabled:opacity-50"
                            >
                                <Check size={18} />
                            </button>
                        </div>
                    )}
                </div>

                {isEditingAbout ? (
                    <textarea
                        value={aboutText}
                        onChange={(e) => setAboutText(e.target.value)}
                        className="w-full bg-bg-primary border border-border-primary rounded-lg p-3 text-sm text-white focus:outline-none focus:border-accent-blue min-h-[150px] resize-none"
                        placeholder="Tell us about yourself..."
                    />
                ) : (
                    <div className="text-sm text-text-secondary leading-relaxed whitespace-pre-wrap">
                        {user?.about ? user.about : (isOwnProfile ? "Click the edit icon to add an about section." : "No about information shared yet.")}
                    </div>
                )}
            </div>

            {/* Top Skills Section */}
            <div>
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xs font-bold text-white tracking-wide uppercase">Top Skills</h3>
                    {isOwnProfile && !isEditingSkills && (
                        <button
                            onClick={() => setIsEditingSkills(true)}
                            className="p-1.5 text-text-secondary hover:text-white hover:bg-white/5 rounded-lg transition-all"
                        >
                            <Edit2 size={14} />
                        </button>
                    )}
                    {isEditingSkills && (
                        <div className="flex gap-2">
                            <button
                                onClick={() => {
                                    setIsEditingSkills(false);
                                    setSkillsList(user?.skills || []);
                                }}
                                className="p-1.5 text-text-secondary hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
                            >
                                <X size={16} />
                            </button>
                            <button
                                onClick={handleUpdateSkills}
                                disabled={isUpdating}
                                className="p-1.5 text-accent-blue hover:bg-accent-blue/10 rounded-lg transition-all disabled:opacity-50"
                            >
                                <Check size={16} />
                            </button>
                        </div>
                    )}
                </div>

                {isEditingSkills && (
                    <form onSubmit={addSkill} className="flex gap-2 mb-4">
                        <input
                            type="text"
                            value={newSkill}
                            onChange={(e) => setNewSkill(e.target.value)}
                            className="flex-1 bg-bg-primary border border-border-primary rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-accent-blue"
                            placeholder="Add a skill..."
                        />
                        <button
                            type="submit"
                            className="px-3 py-1.5 bg-accent-blue text-white rounded-lg text-xs font-medium hover:bg-blue-600 transition-all flex items-center gap-1"
                        >
                            <Plus size={14} /> Add
                        </button>
                    </form>
                )}

                <div className="flex flex-wrap gap-2">
                    {skillsList.length > 0 ? (
                        skillsList.map((skill, index) => (
                            <span
                                key={index}
                                className="group flex items-center gap-1.5 px-3 py-1.5 bg-bg-primary border border-border-primary rounded-lg text-xs font-medium text-text-secondary hover:text-white hover:border-white/20 transition-all"
                            >
                                {skill}
                                {isEditingSkills && (
                                    <button
                                        onClick={() => removeSkill(skill)}
                                        className="text-text-secondary hover:text-red-400 p-0.5"
                                    >
                                        <X size={12} />
                                    </button>
                                )}
                            </span>
                        ))
                    ) : (
                        <div className="text-xs text-text-secondary italic">
                            {isOwnProfile ? "No skills added yet. Add some to stand out!" : "No skills shared yet."}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AboutTab;
