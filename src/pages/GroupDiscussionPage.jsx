import React from 'react';
import Navbar from '../components/Navbar';
import GroupDiscussionComponent from '../components/groups/discussion/GroupDiscussionComponent';

const GroupDiscussionPage = () => {
    return (
        <div className="flex flex-col h-screen bg-[#1E232E]">
            <Navbar />
            <GroupDiscussionComponent />
        </div>
    );
};

export default GroupDiscussionPage;
