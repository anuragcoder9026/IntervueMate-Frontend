import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
    Code,
    Search,
    Menu,
    X,
    ArrowLeft,
} from 'lucide-react';
import { getGroup, fetchResources, createFolder, uploadResource, searchResources, rateResource, deleteResource, renameResource, verifyResource } from '../store/groupSlice';
import Navbar from '../components/Navbar';

import {
    ResourceSearchInput,
    ResourceSidebar,
    ResourceBreadcrumbs,
    UploadPanel,
    ResourceList,
    AccessRestricted,
    ResourceNotFound,
    getFileMetaData,
    findFolderPath,
    getFolderById,
    collectIdsRecursively,
} from '../components/groups/resources';

const GroupResourcesPage = ({ isAdminMode = false }) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { currentGroup, isLoading, isError, message } = useSelector((state) => state.group);

    // View state
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const [isMobileSearchActive, setIsMobileSearchActive] = useState(false);
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
    const [viewMode, setViewMode] = useState('EXPLORER');
    const searchRef = useRef(null);

    // Sidebar resize state
    const { resources, resourceLoading, isSearching } = useSelector((state) => state.group);
    const { user } = useSelector((state) => state.auth);
    const [searchResults, setSearchResults] = useState([]);

    // Sidebar resize state
    const [sidebarWidth, setSidebarWidth] = useState(240);
    const [isResizing, setIsResizing] = useState(false);
    const fileInputRef = useRef(null);

    // Local VFS UI State (derived from backend)
    const [folders, setFolders] = useState([]);
    const [filesByFolder, setFilesByFolder] = useState({});

    // Inline Creation State
    const [inlineInput, setInlineInput] = useState(null);
    const [inlineValue, setInlineValue] = useState('');

    // Navigation State
    const [currentPath, setCurrentPath] = useState([]);
    const [expandedFolders, setExpandedFolders] = useState([]);
    const [selectedFolderId, setSelectedFolderId] = useState(null);
    const [selectedFileId, setSelectedFileId] = useState(null);

    // Upload Mode State
    const [showUploadPanel, setShowUploadPanel] = useState(false);
    const [uploadFileData, setUploadFileData] = useState({
        name: '',
        title: '',
        description: '',
        tags: '',
        visibility: 'public',
        fileSelected: false,
        originalFileName: ''
    });

    // Folder Visibility Menu State
    const [folderVisibilityMenu, setFolderVisibilityMenu] = useState(null);

    // Resource Options Menu State
    const [resourceOptionsMenu, setResourceOptionsMenu] = useState(null);
    const [renamingResource, setRenamingResource] = useState(null);
    const [deletingResource, setDeletingResource] = useState(null);
    const optionsMenuRef = useRef(null);

    // Debounced Search logic
    useEffect(() => {
        const delayDebounceFn = setTimeout(async () => {
            if (searchQuery.length >= 2) {
                try {
                    const response = await dispatch(searchResources({ groupId: id, query: searchQuery })).unwrap();
                    if (response.success) {
                        setSearchResults(response.data);
                    }
                } catch (error) {
                    console.error('Search failed:', error);
                }
            } else {
                setSearchResults([]);
            }
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [searchQuery, id, dispatch]);

    useEffect(() => {
        if (id) {
            // When embedded (hideNavbar), skip getGroup — the parent already fetches it.
            // Dispatching it here would set isLoading=true, causing the parent's
            // loading guard to unmount this component, creating an infinite loop.
            if (!isAdminMode) {
                dispatch(getGroup(id));
            }
            dispatch(fetchResources(id));
        }

        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setIsSearchFocused(false);
                if (window.innerWidth < 768 && !searchQuery) {
                    setIsMobileSearchActive(false);
                }
            }
            if (optionsMenuRef.current && !optionsMenuRef.current.contains(event.target)) {
                setResourceOptionsMenu(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [id, dispatch]);

    // Transform flat resources into tree and file map
    useEffect(() => {
        if (resources && currentGroup) {
            const resourceMap = {};
            const filesMap = {};

            resources.forEach(res => {
                resourceMap[res._id] = { ...res, id: res._id, children: [] };
            });

            resources.forEach(res => {
                if (res.type === 'folder' && res.children) {
                    res.children.forEach(childId => {
                        const child = resourceMap[childId];
                        if (child) {
                            if (child.type === 'folder') {
                                resourceMap[res._id].children.push(resourceMap[childId]);
                            } else {
                                if (!filesMap[res._id]) filesMap[res._id] = [];
                                filesMap[res._id].push({ ...child, id: child._id });
                            }
                        }
                    });
                }
            });

            const rootFolders = [];
            const rootId = currentGroup.rootFolder?._id || currentGroup.rootFolder;
            if (rootId && resourceMap[rootId]) {
                rootFolders.push(resourceMap[rootId]);
            } else {
                const fallbackRoot = resources.find(r => r.type === 'folder' && r?.name === 'Root');
                if (fallbackRoot) rootFolders.push(resourceMap[fallbackRoot._id]);
            }

            setFolders(rootFolders);
            setFilesByFolder(filesMap);

            if (!selectedFolderId && rootFolders.length > 0) {
                const rootNode = rootFolders[0];
                setSelectedFolderId(rootNode?.id);
                setExpandedFolders([rootNode?.id]);
                setCurrentPath([{ id: rootNode?.id, name: rootNode?.name }]);
            }
        }
    }, [resources, currentGroup]);

    // Auto-update breadcrumbs based on selected folder
    useEffect(() => {
        if (selectedFolderId && folders.length > 0) {
            const calculatedPath = findFolderPath(folders, selectedFolderId);
            if (calculatedPath) {
                setCurrentPath(calculatedPath);
                const folderIdsInPath = calculatedPath.map(p => p.id);
                setExpandedFolders(prev => [...new Set([...prev, ...folderIdsInPath])]);
            }
        }
    }, [selectedFolderId, folders]);

    // Resizing logic
    const startResizing = useCallback(() => {
        setIsResizing(true);
    }, []);

    const stopResizing = useCallback(() => {
        setIsResizing(false);
    }, []);

    const resize = useCallback((mouseMoveEvent) => {
        if (isResizing) {
            const newWidth = mouseMoveEvent.clientX;
            if (newWidth >= 180 && newWidth <= 450) {
                setSidebarWidth(newWidth);
            }
        }
    }, [isResizing]);

    useEffect(() => {
        window.addEventListener("mousemove", resize);
        window.addEventListener("mouseup", stopResizing);
        return () => {
            window.removeEventListener("mousemove", resize);
            window.removeEventListener("mouseup", stopResizing);
        };
    }, [resize, stopResizing]);

    const handleCreateItem = (e) => {
        if (e) e.preventDefault();

        if (!inlineValue.trim() || !inlineInput) {
            setInlineInput(null);
            setInlineValue('');
            return;
        }

        const newName = inlineValue.trim();
        const parentId = inlineInput.parentId;
        const type = inlineInput.type;

        setInlineInput(null);
        setInlineValue('');

        if (type === 'FOLDER') {
            dispatch(createFolder({
                name: newName,
                parent: parentId,
                group: id,
                visibility: inlineInput.visibility || 'public'
            }));
            setExpandedFolders(prev => [...new Set([...prev, parentId])]);
        } else {
            setUploadFileData({
                name: newName,
                title: newName.split('.')[0],
                description: '',
                tags: '',
                visibility: 'public',
                parentId: parentId,
                fileSelected: false,
                originalFileName: ''
            });
            setSelectedFolderId(parentId);
            setShowUploadPanel(true);
        }
    };

    const handleFinalizeUpload = async (e) => {
        e.preventDefault();

        if (!fileInputRef.current?.files[0]) {
            alert("Please select a file first");
            return;
        }

        const formData = new FormData();
        formData.append('file', fileInputRef.current.files[0]);
        formData.append('parent', uploadFileData.parentId);
        formData.append('group', id);
        formData.append('title', uploadFileData.title);
        formData.append('description', uploadFileData.description);
        formData.append('tags', uploadFileData.tags);
        formData.append('fileName', uploadFileData?.name);
        formData.append('size', uploadFileData.size);
        formData.append('visibility', uploadFileData.visibility);
        const result = await dispatch(uploadResource(formData));

        if (result.meta.requestStatus === 'fulfilled') {
            setShowUploadPanel(false);
            setUploadFileData(prev => ({ ...prev, fileSelected: false, originalFileName: '' }));
            if (result.payload?.data) {
                setSelectedFileId(result.payload.data._id);
            }
        }
    };

    const canUploadToFolder = (folderId) => {
        if (!folderId || !resources) return false;
        const folder = resources.find(r => r._id === folderId);
        if (!folder) return false;

        if (folder.visibility === 'public') return true;

        const isAdmin = currentGroup?.admins?.some(a => (a?._id || a) === user?._id);
        const isGroupCreator = (currentGroup?.creator?._id || currentGroup?.creator) === user?._id;
        const isCreator = folder.creator === user?._id || folder.creator?._id === user?._id;

        return isAdmin || isGroupCreator || isCreator;
    };

    const handleDownload = async (resource) => {
        if (!resource.fileUrl) return;

        try {
            const response = await fetch(resource.fileUrl);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;

            const cleanFileName = resource?.name || `${resource.title || 'resource'}.${resource.fileType || 'file'}`;

            link.setAttribute('download', cleanFileName);
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            window.open(resource.fileUrl, '_blank');
        }
    };

    const toggleFolder = (folderId) => {
        if (expandedFolders.includes(folderId)) {
            setExpandedFolders(expandedFolders.filter(f => f !== folderId));
        } else {
            setExpandedFolders([...expandedFolders, folderId]);
        }
    };

    // Compute active resources
    const activeFolderNode = getFolderById(folders, selectedFolderId);
    const folderIds = activeFolderNode ? collectIdsRecursively(activeFolderNode) : [];

    let activeResources = [];
    let currentFolderName = '';

    if (viewMode === 'EXPLORER') {
        activeResources = folderIds.flatMap(fid => {
            const files = filesByFolder[fid] || [];
            return files.map(f => ({ ...f, parentId: fid }));
        });
        currentFolderName = activeFolderNode?.name || 'Root';
    } else if (viewMode === 'RECENT') {
        activeResources = resources
            ?.filter(res => res.type === 'file' || (res.fileType && res.fileType !== 'folder'))
            ?.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            ?.slice(0, 50)
            ?.map(r => ({ ...r, id: r._id })) || [];
        currentFolderName = 'Recent Resources';
    } else if (viewMode === 'FAVORITES') {
        activeResources = resources
            ?.filter(res => res.type === 'file' || (res.fileType && res.fileType !== 'folder'))
            ?.sort((a, b) => (b.rateCount || 0) - (a.rateCount || 0))
            ?.filter(res => (res.rateCount || 0) > 0)
            ?.map(r => ({ ...r, id: r._id })) || [];
        currentFolderName = 'Top Rated Resources';
    }

    const selectedFile = resources?.find(r => r._id === selectedFileId);
    const selectedFileMeta = selectedFile ? getFileMetaData(selectedFile.fileType, selectedFile?.name) : null;

    // Membership Guard
    const isMember = currentGroup?.members?.some(m => (m.user?._id || m.user) === user?._id) ||
        currentGroup?.admins?.some(a => (a?._id || a) === user?._id) ||
        (currentGroup?.creator?._id || currentGroup?.creator) === user?._id;

    if (isLoading && !currentGroup) {
        return (
            <div className="h-screen bg-[#070B13] flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-accent-blue/20 border-t-accent-blue rounded-full animate-spin" />
            </div>
        );
    }

    const notMemberError = isError && (message?.notMember || (typeof message === 'string' && message.toLowerCase().includes('member')));

    if (notMemberError || (currentGroup && !isMember && !isLoading)) {
        return (
            <AccessRestricted
                groupName={currentGroup?.name || 'this group'}
                onViewGroup={() => navigate(`/groups/${id}`)}
                onBrowseGroups={() => navigate('/groups')}
            />
        );
    }

    if (isError && !notMemberError && !currentGroup) {
        return <ResourceNotFound onGoBack={() => navigate('/groups')} />;
    }


    return (
        <div className={`w-[100%] ${isAdminMode ? 'h-[calc(100vh-180px)] rounded-2xl overflow-hidden border border-white/5' : 'h-screen'} bg-[#070B13] text-text-primary flex flex-col font-inter overflow-hidden ${isResizing ? 'cursor-col-resize select-none' : ''}`}>
            {!isAdminMode && <Navbar />}

            {/* Header */}
            <header className="h-[56px] border-b border-border-primary bg-[#0A0F1A] px-4 md:px-6 flex items-center justify-between shrink-0 z-50">
                {isMobileSearchActive ? (
                    <div className="flex-1 flex items-center gap-3" ref={searchRef}>
                        <button onClick={() => { setIsMobileSearchActive(false); setIsSearchFocused(false); }} className="p-1.5 text-text-secondary hover:text-white transition-all">
                            <ArrowLeft size={20} />
                        </button>
                        <ResourceSearchInput
                            isMobile={true}
                            searchRef={searchRef}
                            searchQuery={searchQuery}
                            setSearchQuery={setSearchQuery}
                            isSearchFocused={isSearchFocused}
                            setIsSearchFocused={setIsSearchFocused}
                            setIsMobileSearchActive={setIsMobileSearchActive}
                            searchResults={searchResults}
                            isSearching={isSearching}
                            resources={resources}
                            filesByFolder={filesByFolder}
                            setSelectedFileId={setSelectedFileId}
                            setSelectedFolderId={setSelectedFolderId}
                        />
                    </div>
                ) : (
                    <>
                        <div className="flex items-center gap-3">
                            <button onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)} className="lg:hidden p-1.5 text-text-secondary hover:text-white hover:bg-white/5 rounded-lg transition-all">
                                {isMobileSidebarOpen ? <X size={20} /> : <Menu size={20} />}
                            </button>
                            <div onClick={() => navigate(`/groups/${id}`)} className="flex items-center gap-2.5 cursor-pointer hover:opacity-80 transition-opacity">
                                <div className="w-7 h-7 rounded-lg bg-accent-blue flex items-center justify-center shrink-0">
                                    <Code size={16} className="text-white" />
                                </div>
                                <span className="font-outfit text-sm md:text-base font-bold tracking-tight text-white line-clamp-1">{currentGroup?.name || 'Group Resources'}</span>
                            </div>
                        </div>
                        <div className="hidden md:flex flex-1 max-w-xl mx-8 relative">
                            <ResourceSearchInput
                                isMobile={false}
                                searchRef={searchRef}
                                searchQuery={searchQuery}
                                setSearchQuery={setSearchQuery}
                                isSearchFocused={isSearchFocused}
                                setIsSearchFocused={setIsSearchFocused}
                                setIsMobileSearchActive={setIsMobileSearchActive}
                                searchResults={searchResults}
                                isSearching={isSearching}
                                resources={resources}
                                filesByFolder={filesByFolder}
                                setSelectedFileId={setSelectedFileId}
                                setSelectedFolderId={setSelectedFolderId}
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <button onClick={() => setIsMobileSearchActive(true)} className="md:hidden p-1.5 text-text-secondary hover:text-white transition-all">
                                <Search size={18} />
                            </button>
                        </div>
                    </>
                )}
            </header>

            <div className="flex-1 flex overflow-hidden relative">
                {/* Mobile Sidebar Overlay */}
                {isMobileSidebarOpen && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[55] lg:hidden" onClick={() => setIsMobileSidebarOpen(false)} />
                )}

                {/* Sidebar */}
                <ResourceSidebar
                    sidebarWidth={sidebarWidth}
                    isMobileSidebarOpen={isMobileSidebarOpen}
                    setIsMobileSidebarOpen={setIsMobileSidebarOpen}
                    viewMode={viewMode}
                    setViewMode={setViewMode}
                    selectedFolderId={selectedFolderId}
                    selectedFileId={selectedFileId}
                    showUploadPanel={showUploadPanel}
                    folders={folders}
                    expandedFolders={expandedFolders}
                    setExpandedFolders={setExpandedFolders}
                    filesByFolder={filesByFolder}
                    inlineInput={inlineInput}
                    setInlineInput={setInlineInput}
                    inlineValue={inlineValue}
                    setInlineValue={setInlineValue}
                    handleCreateItem={handleCreateItem}
                    canUploadToFolder={canUploadToFolder}
                    setSelectedFolderId={setSelectedFolderId}
                    setSelectedFileId={setSelectedFileId}
                    setShowUploadPanel={setShowUploadPanel}
                    toggleFolder={toggleFolder}
                    folderVisibilityMenu={folderVisibilityMenu}
                    setFolderVisibilityMenu={setFolderVisibilityMenu}
                />

                {/* Resizer Slider */}
                <div onMouseDown={startResizing} className={`hidden lg:flex w-1 cursor-col-resize absolute h-full z-10 hover:bg-accent-blue/50 transition-colors items-center justify-center group ${isResizing ? 'bg-accent-blue/80' : ''}`} style={{ left: `${sidebarWidth - 2}px` }}>
                    <div className={`w-0.5 h-12 bg-white/10 rounded-full group-hover:bg-white/30 transition-colors ${isResizing ? 'bg-white/50' : ''}`} />
                </div>

                {/* Main Content */}
                <main className="flex-1 overflow-y-auto bg-[#070B13] w-full no-scrollbar scroll-smooth relative">
                    <div className="sticky top-0 z-[40]">
                        {/* Breadcrumbs */}
                        <ResourceBreadcrumbs
                            currentPath={currentPath}
                            folders={folders}
                            selectedFile={selectedFile}
                            selectedFileMeta={selectedFileMeta}
                            showUploadPanel={showUploadPanel}
                            setSelectedFolderId={setSelectedFolderId}
                            setSelectedFileId={setSelectedFileId}
                            setShowUploadPanel={setShowUploadPanel}
                            setViewMode={setViewMode}
                            handleDownload={handleDownload}
                        />
                    </div>

                    <div className="px-4 md:px-6 pt-4 md:pt-6 pb-8">
                        {showUploadPanel ? (
                            <UploadPanel
                                currentPath={currentPath}
                                uploadFileData={uploadFileData}
                                setUploadFileData={setUploadFileData}
                                fileInputRef={fileInputRef}
                                handleFinalizeUpload={handleFinalizeUpload}
                                resourceLoading={resourceLoading}
                                setShowUploadPanel={setShowUploadPanel}
                            />
                        ) : (
                            <ResourceList
                                activeResources={activeResources}
                                currentFolderName={currentFolderName}
                                selectedFileId={selectedFileId}
                                setSelectedFileId={setSelectedFileId}
                                setSelectedFolderId={setSelectedFolderId}
                                user={user}
                                currentGroup={currentGroup}
                                resourceOptionsMenu={resourceOptionsMenu}
                                setResourceOptionsMenu={setResourceOptionsMenu}
                                renamingResource={renamingResource}
                                setRenamingResource={setRenamingResource}
                                deletingResource={deletingResource}
                                setDeletingResource={setDeletingResource}
                                optionsMenuRef={optionsMenuRef}
                                handleDownload={handleDownload}
                                dispatch={dispatch}
                                rateResource={rateResource}
                                renameResource={renameResource}
                                deleteResource={deleteResource}
                                verifyResource={verifyResource}
                            />
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default GroupResourcesPage;
