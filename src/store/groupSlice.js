import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../utils/api';
import { likePost, addComment, addReply, deletePost, likeComment, createPost, getPostComments } from './postSlice';

// Create a group
export const createGroup = createAsyncThunk(
    'groups/create',
    async (groupData, thunkAPI) => {
        try {
            const response = await api.post('/groups', groupData);
            return response.data;
        } catch (error) {
            const message = error.response?.data?.error || error.message;
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Update a group
export const updateGroup = createAsyncThunk(
    'groups/update',
    async ({ groupId, groupData }, thunkAPI) => {
        try {
            const response = await api.put(`/groups/${groupId}`, groupData);
            return response.data;
        } catch (error) {
            const message = error.response?.data?.error || error.message;
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Get all groups
export const getGroups = createAsyncThunk(
    'groups/getAll',
    async (filters, thunkAPI) => {
        try {
            const queryParams = filters ? new URLSearchParams(filters).toString() : '';
            const response = await api.get(`/groups${queryParams ? `?${queryParams}` : ''}`);
            return response.data;
        } catch (error) {
            const message = error.response?.data?.error || error.message;
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Get single group
export const getGroup = createAsyncThunk(
    'groups/getOne',
    async (groupId, thunkAPI) => {
        try {
            const response = await api.get(`/groups/${groupId}`);
            return response.data;
        } catch (error) {
            const data = error.response?.data;
            // Pass the full response for notMember case
            if (data?.notMember) {
                return thunkAPI.rejectWithValue(data);
            }
            const message = data?.error || error.message;
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Join a group
export const joinGroup = createAsyncThunk(
    'groups/join',
    async (groupId, thunkAPI) => {
        try {
            const response = await api.put(`/groups/${groupId}/join`);
            return { groupId, ...response.data };
        } catch (error) {
            const message = error.response?.data?.error || error.message;
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Create a post in a group (admin only)
export const createGroupPost = createAsyncThunk(
    'groups/createPost',
    async ({ groupId, formData }, thunkAPI) => {
        try {
            const response = await api.post(`/groups/${groupId}/posts`, formData);
            return response.data;
        } catch (error) {
            const message = error.response?.data?.error || error.message;
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Get all posts for a group
export const getGroupPosts = createAsyncThunk(
    'groups/getPosts',
    async (groupId, thunkAPI) => {
        try {
            const response = await api.get(`/groups/${groupId}/posts`);
            return response.data;
        } catch (error) {
            const message = error.response?.data?.error || error.message;
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Get group members (admins + members)
export const getGroupMembers = createAsyncThunk(
    'groups/getMembers',
    async (groupId, thunkAPI) => {
        try {
            const response = await api.get(`/groups/${groupId}/members`);
            return response.data;
        } catch (error) {
            const message = error.response?.data?.error || error.message;
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Get recent group members
export const getRecentGroupMembers = createAsyncThunk(
    'groups/getRecentMembers',
    async (groupId, thunkAPI) => {
        try {
            const response = await api.get(`/groups/${groupId}/members/recent`);
            return response.data;
        } catch (error) {
            const message = error.response?.data?.error || error.message;
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Get group join requests (admin only)
export const getGroupJoinRequests = createAsyncThunk(
    'groups/getRequests',
    async (groupId, thunkAPI) => {
        try {
            const response = await api.get(`/groups/${groupId}/requests`);
            return response.data;
        } catch (error) {
            const message = error.response?.data?.error || error.message;
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Approve join request
export const approveJoinRequest = createAsyncThunk(
    'groups/approveRequest',
    async ({ groupId, userId }, thunkAPI) => {
        try {
            const response = await api.put(`/groups/${groupId}/requests/${userId}/approve`);
            return { groupId, userId, ...response.data };
        } catch (error) {
            const message = error.response?.data?.error || error.message;
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Remove member from group (admin only)
export const removeGroupMember = createAsyncThunk(
    'groups/removeMember',
    async ({ groupId, userId }, thunkAPI) => {
        try {
            await api.delete(`/groups/${groupId}/members/${userId}`);
            return { groupId, userId };
        } catch (error) {
            const message = error.response?.data?.error || error.message;
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Get all joined groups of current user
export const getJoinedGroupsOfUser = createAsyncThunk(
    'groups/getJoinedOfUser',
    async (_, thunkAPI) => {
        try {
            const response = await api.get('/users/profile/groups');
            return response.data;
        } catch (error) {
            const message = error.response?.data?.error || error.message;
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Reject join request
export const rejectJoinRequest = createAsyncThunk(
    'groups/rejectRequest',
    async ({ groupId, userId }, thunkAPI) => {
        try {
            const response = await api.delete(`/groups/${groupId}/requests/${userId}/reject`);
            return { groupId, userId, ...response.data };
        } catch (error) {
            const message = error.response?.data?.error || error.message;
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// --- Resource Module Thunks ---

export const fetchResources = createAsyncThunk(
    'resources/getAll',
    async (groupId, thunkAPI) => {
        try {
            const response = await api.get(`/resources/group/${groupId}`);
            return response.data;
        } catch (error) {
            const message = error.response?.data?.error || error.message;
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const createFolder = createAsyncThunk(
    'resources/createFolder',
    async (folderData, thunkAPI) => {
        try {
            const response = await api.post('/resources/folder', folderData);
            return response.data;
        } catch (error) {
            const message = error.response?.data?.error || error.message;
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const uploadResource = createAsyncThunk(
    'resources/upload',
    async (formData, thunkAPI) => {
        try {
            const response = await api.post('/resources/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            return response.data;
        } catch (error) {
            const message = error.response?.data?.error || error.message;
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const searchResources = createAsyncThunk(
    'resources/search',
    async ({ groupId, query }, thunkAPI) => {
        try {
            const response = await api.get(`/resources/search/${groupId}?q=${encodeURIComponent(query)}`);
            return response.data;
        } catch (error) {
            const message = error.response?.data?.error || error.message;
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const rateResource = createAsyncThunk(
    'resources/rate',
    async (resourceId, thunkAPI) => {
        try {
            const response = await api.put(`/resources/${resourceId}/rate`);
            return response.data;
        } catch (error) {
            const message = error.response?.data?.error || error.message;
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const deleteResource = createAsyncThunk(
    'resources/delete',
    async (resourceId, thunkAPI) => {
        try {
            const response = await api.delete(`/resources/${resourceId}`);
            return { resourceId, ...response.data };
        } catch (error) {
            const message = error.response?.data?.error || error.message;
            return thunkAPI.rejectWithValue(message);
        }
    }
);



export const verifyResource = createAsyncThunk(
    'resources/verify',
    async (resourceId, thunkAPI) => {
        try {
            const response = await api.put(`/resources/${resourceId}/verify`);
            return response.data;
        } catch (error) {
            const message = error.response?.data?.error || error.message;
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const renameResource = createAsyncThunk(
    'resources/rename',
    async ({ resourceId, name }, thunkAPI) => {
        try {
            const response = await api.put(`/resources/${resourceId}/rename`, { name });
            return response.data;
        } catch (error) {
            const message = error.response?.data?.error || error.message;
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Get featured group (most members, excluding user's groups)
export const getFeaturedGroup = createAsyncThunk(
    'groups/getFeatured',
    async (userId, thunkAPI) => {
        try {
            const query = userId ? `?excludeUser=${userId}` : '';
            const response = await api.get(`/groups/featured${query}`);
            return response.data;
        } catch (error) {
            const message = error.response?.data?.error || error.message;
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// --- Discussion Thunks ---

export const getGroupDiscussions = createAsyncThunk(
    'groups/getDiscussions',
    async (groupId, thunkAPI) => {
        try {
            const response = await api.get(`/groups/${groupId}/discussions`);
            return response.data;
        } catch (error) {
            const message = error.response?.data?.error || error.message;
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const createGroupDiscussion = createAsyncThunk(
    'groups/createDiscussion',
    async ({ groupId, discussionData }, thunkAPI) => {
        try {
            const response = await api.post(`/groups/${groupId}/discussions`, discussionData);
            return response.data;
        } catch (error) {
            const message = error.response?.data?.error || error.message;
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const getDiscussionMessages = createAsyncThunk(
    'groups/getDiscussionMessages',
    async ({ groupId, discussionId }, thunkAPI) => {
        try {
            const response = await api.get(`/groups/${groupId}/discussions/${discussionId}/messages`);
            return response.data;
        } catch (error) {
            const message = error.response?.data?.error || error.message;
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const togglePinGroupMessage = createAsyncThunk(
    'groups/togglePinMessage',
    async ({ groupId, discussionId, messageId }, thunkAPI) => {
        try {
            const response = await api.put(`/groups/${groupId}/discussions/${discussionId}/messages/${messageId}/pin`);
            return response.data;
        } catch (error) {
            const message = error.response?.data?.error || error.message;
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const getPinnedMessages = createAsyncThunk(
    'groups/getPinnedMessages',
    async ({ groupId, discussionId }, thunkAPI) => {
        try {
            const response = await api.get(`/groups/${groupId}/discussions/${discussionId}/pinned`);
            return response.data;
        } catch (error) {
            const message = error.response?.data?.error || error.message;
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// --- Event Module Thunks (Admin) ---

export const getPendingEvents = createAsyncThunk(
    'groups/getPendingEvents',
    async (groupId, thunkAPI) => {
        try {
            const response = await api.get(`/events/group/${groupId}/pending`);
            return response.data;
        } catch (error) {
            const message = error.response?.data?.error || error.message;
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const approveEvent = createAsyncThunk(
    'groups/approveEvent',
    async (eventId, thunkAPI) => {
        try {
            const response = await api.put(`/events/${eventId}/approve`);
            return response.data;
        } catch (error) {
            const message = error.response?.data?.error || error.message;
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const rejectEvent = createAsyncThunk(
    'groups/rejectEvent',
    async (eventId, thunkAPI) => {
        try {
            const response = await api.put(`/events/${eventId}/reject`);
            return response.data;
        } catch (error) {
            const message = error.response?.data?.error || error.message;
            return thunkAPI.rejectWithValue(message);
        }
    }
);

const initialState = {
    groups: [],
    currentGroup: null,
    featuredGroup: null,
    groupPosts: [],
    groupAdmins: [],
    groupMembers: [],
    recentMembers: [],
    joinedGroups: [],
    joinRequests: [],
    resources: [],
    pendingEvents: [],
    resourceLoading: false,
    resourceError: null,
    loading: false,
    quests: [],
    discussions: [],
    currentDiscussionMessages: [],
    isError: false,
    isSuccess: false,
    isLoading: false,
    isCreating: false,
    isPostsLoading: false,
    isMembersLoading: false,
    isRecentMembersLoading: false,
    isJoinedGroupsLoading: false,
    isRequestsLoading: false,
    isDiscussionsLoading: false,
    isMessagesLoading: false,
    isPinnedMessagesLoading: false,
    isEventsLoading: false,
    pinnedMessages: [],
    isSearching: false,
    message: '',
};

export const groupSlice = createSlice({
    name: 'groups',
    initialState,
    reducers: {
        reset: (state) => {
            state.isLoading = false;
            state.isSuccess = false;
            state.isError = false;
            state.isCreating = false;
            state.message = '';
        },
        receiveGroupMessage: (state, action) => {
            state.currentDiscussionMessages.push(action.payload);
        },
        removeGroupMessagesLocally: (state, action) => {
            const idsToRemove = action.payload;
            state.currentDiscussionMessages = state.currentDiscussionMessages.filter(
                msg => !idsToRemove.includes(msg._id || msg.index)
            );
        }
    },
    extraReducers: (builder) => {
        builder
            // Create Group
            .addCase(createGroup.pending, (state) => {
                state.isCreating = true;
            })
            .addCase(createGroup.fulfilled, (state, action) => {
                state.isCreating = false;
                state.isSuccess = true;
                state.groups.push(action.payload.group);
                state.currentGroup = action.payload.group;
            })
            .addCase(createGroup.rejected, (state, action) => {
                state.isCreating = false;
                state.isError = true;
                state.message = action.payload;
            })
            // Get All Groups
            .addCase(getGroups.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getGroups.fulfilled, (state, action) => {
                state.isLoading = false;
                state.groups = action.payload.groups;
            })
            .addCase(getGroups.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            // Update Group
            .addCase(updateGroup.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.currentGroup = action.payload.group;
            })
            // Get Single Group
            .addCase(getGroup.pending, (state) => {
                state.isLoading = true;
                state.isError = false;
            })
            .addCase(getGroup.fulfilled, (state, action) => {
                state.isLoading = false;
                state.currentGroup = action.payload.group;
            })
            .addCase(getGroup.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            // Join Group
            .addCase(joinGroup.fulfilled, (state, action) => {
                state.isSuccess = true;
            })
            // Create Group Post
            .addCase(createGroupPost.pending, (state) => {
                state.isCreating = true;
            })
            .addCase(createGroupPost.fulfilled, (state, action) => {
                state.isCreating = false;
                state.isSuccess = true;
                state.groupPosts.unshift(action.payload.data);
            })
            .addCase(createGroupPost.rejected, (state, action) => {
                state.isCreating = false;
                state.isError = true;
                state.message = action.payload;
            })
            // Get Group Posts
            .addCase(getGroupPosts.pending, (state) => {
                state.isPostsLoading = true;
            })
            .addCase(getGroupPosts.fulfilled, (state, action) => {
                state.isPostsLoading = false;
                state.groupPosts = action.payload.data;
            })
            .addCase(getGroupPosts.rejected, (state, action) => {
                state.isPostsLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            // Get Group Members
            .addCase(getGroupMembers.pending, (state) => {
                state.isMembersLoading = true;
            })
            .addCase(getGroupMembers.fulfilled, (state, action) => {
                state.isMembersLoading = false;
                state.groupAdmins = action.payload.admins;
                state.groupMembers = action.payload.members;
            })
            .addCase(getGroupMembers.rejected, (state, action) => {
                state.isMembersLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            // Get Recent Group Members
            .addCase(getRecentGroupMembers.pending, (state) => {
                state.isRecentMembersLoading = true;
            })
            .addCase(getRecentGroupMembers.fulfilled, (state, action) => {
                state.isRecentMembersLoading = false;
                state.recentMembers = action.payload.data;
            })
            .addCase(getRecentGroupMembers.rejected, (state, action) => {
                state.isRecentMembersLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            // Get Group Join Requests
            .addCase(getGroupJoinRequests.pending, (state) => {
                state.isRequestsLoading = true;
            })
            .addCase(getGroupJoinRequests.fulfilled, (state, action) => {
                state.isRequestsLoading = false;
                state.joinRequests = action.payload.joinRequests;
            })
            .addCase(getGroupJoinRequests.rejected, (state, action) => {
                state.isRequestsLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            // Get Joined Groups of User
            .addCase(getJoinedGroupsOfUser.pending, (state) => {
                state.isJoinedGroupsLoading = true;
            })
            .addCase(getJoinedGroupsOfUser.fulfilled, (state, action) => {
                state.isJoinedGroupsLoading = false;
                state.joinedGroups = action.payload.data;
            })
            .addCase(getJoinedGroupsOfUser.rejected, (state, action) => {
                state.isJoinedGroupsLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            // Get Featured Group
            .addCase(getFeaturedGroup.fulfilled, (state, action) => {
                state.featuredGroup = action.payload.data;
            })
            // Approve Join Request
            .addCase(approveJoinRequest.fulfilled, (state, action) => {
                state.joinRequests = state.joinRequests.filter(
                    req => req._id !== action.payload.userId
                );
                // Also update currentGroup member count if it exists
                if (state.currentGroup && state.currentGroup._id === action.payload.groupId) {
                    state.currentGroup.members.push({ user: action.payload.userId });
                }
            })
            // Reject Join Request
            .addCase(rejectJoinRequest.fulfilled, (state, action) => {
                state.joinRequests = state.joinRequests.filter(
                    req => req._id !== action.payload.userId
                );
            })
            // --- Discussion Reducers ---
            .addCase(getGroupDiscussions.pending, (state) => {
                state.isDiscussionsLoading = true;
            })
            .addCase(getGroupDiscussions.fulfilled, (state, action) => {
                state.isDiscussionsLoading = false;
                state.discussions = action.payload.data;
            })
            .addCase(getGroupDiscussions.rejected, (state, action) => {
                state.isDiscussionsLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(createGroupDiscussion.pending, (state) => {
                state.isCreating = true;
            })
            .addCase(createGroupDiscussion.fulfilled, (state, action) => {
                state.isCreating = false;
                state.isSuccess = true;
                state.discussions.push(action.payload.data);
            })
            .addCase(createGroupDiscussion.rejected, (state, action) => {
                state.isCreating = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(getDiscussionMessages.pending, (state) => {
                state.isMessagesLoading = true;
                state.currentDiscussionMessages = [];
            })
            .addCase(getDiscussionMessages.fulfilled, (state, action) => {
                state.isMessagesLoading = false;
                state.currentDiscussionMessages = action.payload.data;
            })
            .addCase(getDiscussionMessages.rejected, (state, action) => {
                state.isMessagesLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(getPinnedMessages.pending, (state) => {
                state.isPinnedMessagesLoading = true;
            })
            .addCase(getPinnedMessages.fulfilled, (state, action) => {
                state.isPinnedMessagesLoading = false;
                state.pinnedMessages = action.payload.data;
            })
            .addCase(getPinnedMessages.rejected, (state, action) => {
                state.isPinnedMessagesLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(togglePinGroupMessage.fulfilled, (state, action) => {
                const updatedMsg = action.payload.data;
                // Update in messages list
                const msgIndex = state.currentDiscussionMessages.findIndex(m => m._id === updatedMsg._id);
                if (msgIndex !== -1) {
                    state.currentDiscussionMessages[msgIndex].isPinned = updatedMsg.isPinned;
                }
                // Update pinnedMessages list
                if (updatedMsg.isPinned) {
                    state.pinnedMessages.push(updatedMsg);
                } else {
                    state.pinnedMessages = state.pinnedMessages.filter(m => m._id !== updatedMsg._id);
                }
            })
            // Sync with Post Actions
            .addCase(getPostComments.pending, (state, action) => {
                const postId = action.meta.arg;
                const post = state.groupPosts.find(p => p._id === postId);
                if (post) {
                    post.commentLoading = true;
                }
            })
            .addCase(getPostComments.fulfilled, (state, action) => {
                const { postId, comments } = action.payload;
                const post = state.groupPosts.find(p => p._id === postId);
                if (post) {
                    post.comments = comments;
                    post.commentLoading = false;
                }
            })
            .addCase(getPostComments.rejected, (state, action) => {
                const postId = action.meta.arg;
                const post = state.groupPosts.find(p => p._id === postId);
                if (post) {
                    post.commentLoading = false;
                }
            })
            .addCase(createPost.fulfilled, (state, action) => {
                const newPost = action.payload.data;
                const activeGroupId = state.currentGroup?._id;
                const postGroupId = newPost.groupId?._id || newPost.groupId;
                if (activeGroupId && postGroupId?.toString() === activeGroupId.toString()) {
                    state.groupPosts.unshift(newPost);
                }
            })
            .addCase(likePost.fulfilled, (state, action) => {
                const post = state.groupPosts.find(p => p._id === action.payload.postId);
                if (post) {
                    post.likes = action.payload.likes;
                }
            })
            .addCase(addComment.fulfilled, (state, action) => {
                const post = state.groupPosts.find(p => p._id === action.payload.postId);
                if (post) {
                    post.comments = action.payload.comments;
                }
            })
            .addCase(likeComment.fulfilled, (state, action) => {
                const { postId, commentId, likes } = action.payload;
                const post = state.groupPosts.find(p => p._id === postId);
                if (post) {
                    const comment = post.comments.find(c => c._id === commentId);
                    if (comment) {
                        comment.likes = likes;
                    }
                }
            })
            .addCase(addReply.fulfilled, (state, action) => {
                const updatedComment = action.payload;
                const postId = updatedComment.post?._id || updatedComment.post;
                const post = state.groupPosts.find(p => p._id === postId);
                if (post && Array.isArray(post.comments)) {
                    const commentIndex = post.comments.findIndex(c => c._id === updatedComment._id);
                    if (commentIndex !== -1) {
                        post.comments[commentIndex] = updatedComment;
                    }
                }
            })
            .addCase(deletePost.fulfilled, (state, action) => {
                state.groupPosts = state.groupPosts.filter(p => p._id !== action.payload);
            })
            .addCase(removeGroupMember.fulfilled, (state, action) => {
                const { userId } = action.payload;
                state.groupMembers = state.groupMembers.filter(m => m._id !== userId);
                state.groupAdmins = state.groupAdmins.filter(a => a._id !== userId);
                if (state.currentGroup) {
                    state.currentGroup.members = state.currentGroup.members.filter(
                        m => (m.user?._id || m.user || m) !== userId
                    );
                    state.currentGroup.admins = state.currentGroup.admins.filter(
                        a => (a._id || a) !== userId
                    );
                }
                state.isSuccess = true;
                state.message = 'Member removed successfully';
            })
            // --- Resource Reducers ---
            .addCase(fetchResources.pending, (state) => {
                state.resourceLoading = true;
                state.resourceError = null;
            })
            .addCase(fetchResources.fulfilled, (state, action) => {
                state.resourceLoading = false;
                state.resources = action.payload.data;
            })
            .addCase(fetchResources.rejected, (state, action) => {
                state.resourceLoading = false;
                state.resourceError = action.payload;
            })
            .addCase(createFolder.pending, (state) => {
                state.resourceLoading = true;
                state.resourceError = null;
            })
            .addCase(createFolder.fulfilled, (state, action) => {
                state.resourceLoading = false;
                const newFolder = action.payload.data;
                state.resources.push(newFolder);

                // Update parent in local state using parent ID from response
                const parentId = newFolder.parent;
                if (parentId) {
                    const parent = state.resources.find(r => r._id === parentId);
                    if (parent) {
                        if (!parent.children) parent.children = [];
                        parent.children.push(newFolder._id);
                    }
                }
            })
            .addCase(createFolder.rejected, (state, action) => {
                state.resourceLoading = false;
                state.resourceError = action.payload;
            })
            .addCase(uploadResource.pending, (state) => {
                state.resourceLoading = true;
                state.resourceError = null;
            })
            .addCase(uploadResource.fulfilled, (state, action) => {
                state.resourceLoading = false;
                const newFile = action.payload.data;
                state.resources.push(newFile);

                const parentId = newFile.parent;
                if (parentId) {
                    const parent = state.resources.find(r => r._id === parentId);
                    if (parent) {
                        if (!parent.children) parent.children = [];
                        parent.children.push(newFile._id);
                    }
                }
            })
            .addCase(uploadResource.rejected, (state, action) => {
                state.resourceLoading = false;
                state.resourceError = action.payload;
            })
            .addCase(searchResources.pending, (state) => {
                state.isSearching = true;
            })
            .addCase(searchResources.fulfilled, (state, action) => {
                state.isSearching = false;
            })
            .addCase(searchResources.rejected, (state) => {
                state.isSearching = false;
            })
            .addCase(rateResource.fulfilled, (state, action) => {
                const updatedResource = action.payload.data;
                const index = state.resources.findIndex(r => r._id === updatedResource._id);
                if (index !== -1) {
                    state.resources[index] = {
                        ...state.resources[index],
                        ratings: updatedResource.ratings,
                        rateCount: updatedResource.rateCount
                    };
                }
            })
            .addCase(deleteResource.fulfilled, (state, action) => {
                const { resourceId } = action.payload;
                state.resources = state.resources.filter(r => r._id !== resourceId);
            })
            .addCase(verifyResource.fulfilled, (state, action) => {
                const updatedResource = action.payload.data;
                const index = state.resources.findIndex(r => r._id === updatedResource._id);
                if (index !== -1) {
                    state.resources[index].isVerified = updatedResource.isVerified;
                }
            })
            .addCase(renameResource.fulfilled, (state, action) => {
                const updatedResource = action.payload.data;
                const index = state.resources.findIndex(r => r._id === updatedResource._id);
                if (index !== -1) {
                    state.resources[index].name = updatedResource.name;
                    if (updatedResource.title) {
                        state.resources[index].title = updatedResource.title;
                    }
                }
            })
            // --- Event Reducers ---
            .addCase(getPendingEvents.pending, (state) => {
                state.isEventsLoading = true;
            })
            .addCase(getPendingEvents.fulfilled, (state, action) => {
                state.isEventsLoading = false;
                state.pendingEvents = action.payload.data;
            })
            .addCase(getPendingEvents.rejected, (state, action) => {
                state.isEventsLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(approveEvent.fulfilled, (state, action) => {
                state.pendingEvents = state.pendingEvents.filter(
                    evt => evt._id !== action.payload.data._id
                );
            })
            .addCase(rejectEvent.fulfilled, (state, action) => {
                state.pendingEvents = state.pendingEvents.filter(
                    evt => evt._id !== action.payload.data._id
                );
            });
    },
});

export const { reset, receiveGroupMessage, removeGroupMessagesLocally } = groupSlice.actions;
export default groupSlice.reducer;
