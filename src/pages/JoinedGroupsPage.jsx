import React from 'react';
import Navbar from '../components/Navbar';
import { ChevronDown, Loader2, Users } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { getJoinedGroupsOfUser } from '../store/groupSlice';
import GroupListItem from '../components/groups/joined/GroupListItem';
import JoinedGroupsLeftSidebar from '../components/groups/joined/JoinedGroupsLeftSidebar';
import JoinedGroupsHeader from '../components/groups/joined/JoinedGroupsHeader';
import JoinedGroupsRightSidebar from '../components/groups/joined/JoinedGroupsRightSidebar';

const JoinedGroupsPage = () => {
    const dispatch = useDispatch();
    const { joinedGroups, isJoinedGroupsLoading } = useSelector((state) => state.group);

    React.useEffect(() => {
        dispatch(getJoinedGroupsOfUser());
    }, [dispatch]);

    return (
        <div className="bg-bg-primary min-h-screen text-text-primary pb-20">
            <Navbar />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col lg:flex-row gap-6 items-start">

                <JoinedGroupsLeftSidebar />

                {/* Center Column */}
                <div className="flex-1 w-full space-y-4">
                    <JoinedGroupsHeader groupCount={joinedGroups.length} />

                    {/* Group List */}
                    <div className="space-y-3">
                        {isJoinedGroupsLoading ? (
                            <div className="flex flex-col items-center justify-center py-20 bg-bg-secondary border border-border-primary rounded-2xl">
                                <Loader2 className="w-8 h-8 text-accent-blue animate-spin mb-4" />
                                <p className="text-text-secondary font-medium">Loading your groups...</p>
                            </div>
                        ) : joinedGroups.length > 0 ? (
                            <>
                                {joinedGroups.map((group) => (
                                    <GroupListItem
                                        key={group._id}
                                        name={group.name}
                                        members={`${group.memberCount >= 1000 ? (group.memberCount / 1000).toFixed(1) + 'k' : group.memberCount}`}
                                        image={group.logo || `https://ui-avatars.com/api/?name=${encodeURIComponent(group.name)}&background=random&color=fff`}
                                        id={group._id}
                                        groupId={group.groupId}
                                    />
                                ))}

                                <button className="w-full py-4 text-sm font-bold text-accent-blue hover:text-white flex items-center justify-center gap-2 transition-all">
                                    Show More Groups <ChevronDown size={14} />
                                </button>
                            </>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-20 bg-bg-secondary border border-border-primary rounded-2xl text-center px-4">
                                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
                                    <Users size={32} className="text-white/20" />
                                </div>
                                <h3 className="text-white font-bold text-lg">No groups yet</h3>
                                <p className="text-text-secondary text-sm max-w-xs mx-auto mt-1">
                                    You haven't joined any groups yet. Explore groups and join communities that interest you!
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                <JoinedGroupsRightSidebar />
            </div>
        </div>
    );
};

export default JoinedGroupsPage;
