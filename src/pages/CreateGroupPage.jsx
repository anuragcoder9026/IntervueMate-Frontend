import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useDispatch, useSelector } from 'react-redux';
import { createGroup, reset } from '../store/groupSlice';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

// New Space Theme Components
import CreateGroupSidebar from '../components/groups/create/CreateGroupSidebar';
import MissionCoordinates from '../components/groups/create/MissionCoordinates';
import VisualIdentification from '../components/groups/create/VisualIdentification';
import CoreProtocols from '../components/groups/create/CoreProtocols';
import SecurityAccess from '../components/groups/create/SecurityAccess';
import SpaceLivePreview from '../components/groups/create/SpaceLivePreview';

const CreateGroupPage = () => {
    const [activeStep, setActiveStep] = useState(1);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isCreating, isSuccess, isError, message, currentGroup } = useSelector((state) => state.group);

    const [groupData, setGroupData] = useState({
        name: '',
        category: 'Colleges',
        website: '',
        description: '',
        tags: [],
        privacy: 'public',
        logo: null,
        coverImage: null
    });

    const [rules, setRules] = useState([
        { id: 1, title: 'Respectful Comms', description: 'Crew members must engage in civil and constructive frequency.' },
        { id: 2, title: 'No Space Junk (Spam)', description: 'Avoid posting unsolicited advertisements or repeated content.' }
    ]);

    const updateGroupData = (newData) => {
        setGroupData(prev => ({ ...prev, ...newData }));
    };

    useEffect(() => {
        if (isSuccess && currentGroup) {
            toast.success('Community Created Successfully!');
            navigate(`/group/${currentGroup._id}`);
            dispatch(reset());
        }
        if (isError) {
            toast.error(message);
            dispatch(reset());
        }
    }, [isSuccess, isError, message, navigate, dispatch, currentGroup]);

    const handleSubmit = () => {
        if (!groupData.name || !groupData.description || !groupData.category) {
            toast.error('Please fill in all required fields');
            return;
        }
        const finalData = {
            ...groupData,
            rules: rules.map(({ title, description }) => ({ title, description }))
        };
        dispatch(createGroup(finalData));
    };

    useEffect(() => {
        const handleScroll = () => {
            const sections = ['phase1', 'phase2', 'phase3', 'phase4'];
            const scrollPos = window.scrollY + 200; // Offset for navbar and margin

            for (let i = sections.length - 1; i >= 0; i--) {
                const section = document.getElementById(sections[i]);
                if (section && section.offsetTop <= scrollPos) {
                    setActiveStep(i + 1);
                    break;
                }
            }
        };

        window.addEventListener('scroll', handleScroll);
        handleScroll();
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);


    return (
        <div className="bg-bg-primary min-h-screen flex flex-col font-sans selection:bg-accent-blue/30 selection:text-white relative">
            <Navbar />

            <main className="flex-1 w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="flex flex-col lg:flex-row gap-12 xl:gap-20 w-full justify-center items-start">

                    {/* Left Fixed Sidebar */}
                    <div className="hidden lg:block sticky top-16 pt-8 pb-8 border-r border-border-primary/50 self-start h-fit">
                        <CreateGroupSidebar activeStep={activeStep} />
                    </div>

                    {/* Middle Scrollable Forms */}
                    <div className="flex-1 max-w-2xl w-full mx-auto lg:mx-0 py-12">
                        <div id="phase1">
                            <MissionCoordinates groupData={groupData} updateGroupData={updateGroupData} />
                        </div>
                        <div id="phase2">
                            <VisualIdentification groupData={groupData} updateGroupData={updateGroupData} />
                        </div>
                        <div id="phase3">
                            <CoreProtocols rules={rules} setRules={setRules} />
                        </div>
                        <div id="phase4">
                            <SecurityAccess
                                privacy={groupData.privacy}
                                setPrivacy={(p) => updateGroupData({ privacy: p })}
                                onSubmit={handleSubmit}
                                isCreating={isCreating}
                            />
                        </div>
                    </div>

                    {/* Right Fixed Preview */}
                    <div className="hidden lg:block w-[380px] shrink-0 sticky top-24 pt-8 pb-8 self-start h-fit">
                        <SpaceLivePreview groupData={groupData} />
                    </div>

                </div>
            </main>

        </div>
    );
};

export default CreateGroupPage;
