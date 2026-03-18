import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getPublicProfile } from '../store/authSlice';
import { toast } from 'react-toastify';

// Profile Components
import ProfileHeader from '../components/profile/ProfileHeader';
import ResumeUpload from '../components/profile/ResumeUpload';
import ProfileStats from '../components/profile/ProfileStats';
import ProfileTabs from '../components/profile/ProfileTabs';
import AboutTab from '../components/profile/AboutTab';
import ExperienceTab from '../components/profile/ExperienceTab';
import PostsTab from '../components/profile/PostsTab';
import AchievementsTab from '../components/profile/AchievementsTab';
import GroupsTab from '../components/profile/GroupsTab';
import ProfileRightSidebar from '../components/profile/ProfileRightSidebar';

const ProfilePage = () => {
    const { userNameAndId } = useParams();
    const dispatch = useDispatch();
    const { user: currentUser } = useSelector((state) => state.auth);
    const [publicUser, setPublicUser] = React.useState(null);
    const [isLoading, setIsLoading] = React.useState(false);

    const [activeTab, setActiveTab] = React.useState('About');
    const [isUploading, setIsUploading] = React.useState(false);
    const [resumeFile, setResumeFile] = React.useState(null);
    const tabs = ['About', 'Experience', 'Posts', 'Achievements', 'Groups'];

    // Extract handle from "name-handle"
    const handle = userNameAndId?.split('-').pop();
    const isOwnProfile = !userNameAndId || handle === currentUser?.userId;

    const { isSuccess, message } = useSelector((state) => state.post);

    const navigate = useNavigate();

    // Redirection logic for self-profile
    React.useEffect(() => {
        if (userNameAndId && handle === currentUser?.userId) {
            navigate('/profile', { replace: true });
        }
    }, [userNameAndId, handle, currentUser, navigate]);

    React.useEffect(() => {
        if (!isOwnProfile && handle) {
            const fetchPublicUser = async () => {
                setIsLoading(true);
                try {
                    const resultAction = await dispatch(getPublicProfile(handle));
                    if (getPublicProfile.fulfilled.match(resultAction)) {
                        setPublicUser(resultAction.payload.user);
                    } else {
                        toast.error('User not found');
                    }
                } catch (err) {
                    toast.error('Failed to fetch profile');
                } finally {
                    setIsLoading(false);
                }
            };
            fetchPublicUser();
        }
    }, [handle, isOwnProfile, dispatch]);

    // Reset post state on mount/unmount and handle toasts
    React.useEffect(() => {
        if (isSuccess) {
            if (message) toast.success(message);
            dispatch({ type: 'post/reset' });
        }
    }, [isSuccess, message, dispatch]);

    const displayUser = isOwnProfile ? currentUser : publicUser;

    if (isLoading) {
        return (
            <div className="min-h-screen bg-bg-primary flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent-blue"></div>
            </div>
        );
    }

    if (!displayUser && !isOwnProfile) {
        return (
            <div className="min-h-screen bg-bg-primary flex flex-col pt-20 items-center">
                <Navbar />
                <h1 className="text-2xl font-bold text-white mt-20">User Not Found</h1>
            </div>
        );
    }

    return (
        <div className="bg-bg-primary min-h-screen text-text-primary overflow-x-hidden">
            <Navbar />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1">
                <div className="flex flex-col lg:flex-row gap-8 items-start">
                    {/* Left Main Content */}
                    <div className="flex-1 w-full max-w-[800px] flex flex-col space-y-6">

                        <ProfileHeader displayUser={displayUser} isOwnProfile={isOwnProfile} />

                        {isOwnProfile && (
                            <ResumeUpload
                                isUploading={isUploading}
                                setIsUploading={setIsUploading}
                                resumeFile={resumeFile}
                                setResumeFile={setResumeFile}
                            />
                        )}

                        <ProfileStats user={displayUser} />

                        <ProfileTabs
                            tabs={tabs}
                            activeTab={activeTab}
                            setActiveTab={setActiveTab}
                        />

                        {/* Tab Content */}
                        {activeTab === 'About' && <AboutTab user={displayUser} isOwnProfile={isOwnProfile} />}
                        {activeTab === 'Experience' && <ExperienceTab user={displayUser} isOwnProfile={isOwnProfile} />}
                        {activeTab === 'Posts' && <PostsTab user={displayUser} />}
                        {activeTab === 'Achievements' && <AchievementsTab user={displayUser} isOwnProfile={isOwnProfile} />}
                        {activeTab === 'Groups' && <GroupsTab user={displayUser} />}

                    </div>

                    {/* Right Sidebar */}
                    <ProfileRightSidebar user={displayUser} isOwnProfile={isOwnProfile} />
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default ProfilePage;
