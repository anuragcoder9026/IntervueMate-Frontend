import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../utils/api';

// Register user
export const register = createAsyncThunk(
    'auth/register',
    async (userData, thunkAPI) => {
        try {
            const response = await api.post('/auth/register', userData);
            return response.data;
        } catch (error) {
            const message = error.response?.data?.error || error.message;
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Login user
export const login = createAsyncThunk(
    'auth/login',
    async (userData, thunkAPI) => {
        try {
            const response = await api.post('/auth/login', userData);
            return response.data;
        } catch (error) {
            const message = error.response?.data?.error || error.message;
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Logout user
export const logout = createAsyncThunk(
    'auth/logout',
    async (_, thunkAPI) => {
        try {
            await api.get('/auth/logout');
            return null;
        } catch (error) {
            const message = error.response?.data?.error || error.message;
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Get current user (check if logged in)
export const getMe = createAsyncThunk(
    'auth/getMe',
    async (_, thunkAPI) => {
        try {
            const response = await api.get('/auth/me');
            return response.data;
        } catch (error) {
            const message = error.response?.data?.error || error.message;
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Follow user
export const followUser = createAsyncThunk(
    'auth/follow',
    async (userId, thunkAPI) => {
        try {
            const response = await api.put(`/users/${userId}/follow`);
            return { userId, ...response.data };
        } catch (error) {
            const message = error.response?.data?.error || error.message;
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Unfollow user
export const unfollowUser = createAsyncThunk(
    'auth/unfollow',
    async (userId, thunkAPI) => {
        try {
            const response = await api.put(`/users/${userId}/unfollow`);
            return { userId, ...response.data };
        } catch (error) {
            const message = error.response?.data?.error || error.message;
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Update profile
export const updateProfile = createAsyncThunk(
    'auth/updateProfile',
    async (userData, thunkAPI) => {
        try {
            const response = await api.put('/users/profile', userData);
            return response.data;
        } catch (error) {
            const message = error.response?.data?.error || error.message;
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Get public profile by handle
export const getPublicProfile = createAsyncThunk(
    'auth/getPublicProfile',
    async (handle, thunkAPI) => {
        try {
            const response = await api.get(`/users/handle/${handle}`);
            return response.data;
        } catch (error) {
            const message = error.response?.data?.error || error.message;
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Upload resume
export const uploadResume = createAsyncThunk(
    'auth/uploadResume',
    async (file, thunkAPI) => {
        try {
            const formData = new FormData();
            formData.append('resume', file);
            const response = await api.put('/users/resume', formData);
            return response.data;
        } catch (error) {
            const message = error.response?.data?.error || error.message;
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Block user
export const blockUser = createAsyncThunk(
    'auth/block',
    async (userId, thunkAPI) => {
        try {
            const response = await api.put(`/users/${userId}/block`);
            return { userId, ...response.data };
        } catch (error) {
            const message = error.response?.data?.error || error.message;
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Unblock user
export const unblockUser = createAsyncThunk(
    'auth/unblock',
    async (userId, thunkAPI) => {
        try {
            const response = await api.put(`/users/${userId}/unblock`);
            return { userId, ...response.data };
        } catch (error) {
            const message = error.response?.data?.error || error.message;
            return thunkAPI.rejectWithValue(message);
        }
    }
);

const initialState = {
    user: null,
    isError: false,
    isSuccess: false,
    isLoading: true,
    isUpdating: false,
    message: '',
};

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        reset: (state) => {
            state.isLoading = false;
            state.isSuccess = false;
            state.isError = false;
            state.isUpdating = false;
            state.message = '';
        },
    },
    extraReducers: (builder) => {
        builder
            // Register
            .addCase(register.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(register.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.user = action.payload.user;
            })
            .addCase(register.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
                state.user = null;
            })
            // Login
            .addCase(login.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.user = action.payload.user;
            })
            .addCase(login.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
                state.user = null;
            })
            // Logout
            .addCase(logout.fulfilled, (state) => {
                state.user = null;
                state.isSuccess = false;
                state.isError = false;
                state.message = '';
            })
            // Get Me
            .addCase(getMe.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getMe.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.user = action.payload.user;
            })
            .addCase(getMe.rejected, (state) => {
                state.isLoading = false;
                state.user = null;
            })
            // Follow
            .addCase(followUser.fulfilled, (state, action) => {
                if (state.user) {
                    if (!state.user.following) state.user.following = [];
                    state.user.following.push(action.payload.userId);
                }
            })
            // Unfollow
            .addCase(unfollowUser.fulfilled, (state, action) => {
                if (state.user) {
                    state.user.following = state.user.following.filter(id => id !== action.payload.userId);
                }
            })
            // Update Profile
            .addCase(updateProfile.pending, (state) => {
                state.isUpdating = true;
            })
            .addCase(updateProfile.fulfilled, (state, action) => {
                state.isUpdating = false;
                state.isSuccess = true;
                state.user = { ...state.user, ...action.payload.user };
            })
            .addCase(updateProfile.rejected, (state, action) => {
                state.isUpdating = false;
                state.isError = true;
                state.message = action.payload;
            })
            // Upload Resume
            .addCase(uploadResume.pending, (state) => {
                state.isUpdating = true;
            })
            .addCase(uploadResume.fulfilled, (state, action) => {
                state.isUpdating = false;
                state.isSuccess = true;
                state.user = { ...state.user, ...action.payload.user };
            })
            .addCase(uploadResume.rejected, (state, action) => {
                state.isUpdating = false;
                state.isError = true;
                state.message = action.payload;
            })
            // Block User
            .addCase(blockUser.fulfilled, (state, action) => {
                if (state.user) {
                    if (!state.user.blockedUsers) state.user.blockedUsers = [];
                    state.user.blockedUsers.push(action.payload.userId);
                    // Remove from following and followers
                    state.user.following = (state.user.following || []).filter(id => (id._id || id).toString() !== action.payload.userId);
                    state.user.followers = (state.user.followers || []).filter(id => (id._id || id).toString() !== action.payload.userId);
                }
            })
            // Unblock User
            .addCase(unblockUser.fulfilled, (state, action) => {
                if (state.user) {
                    state.user.blockedUsers = (state.user.blockedUsers || []).filter(id => (id._id || id).toString() !== action.payload.userId);
                }
            })
            // Toggle Save Post (Sync from postSlice)
            .addCase('post/toggleSave/fulfilled', (state, action) => {
                if (state.user) {
                    if (!state.user.savedPosts) state.user.savedPosts = [];
                    const { postId, isSaved } = action.payload;
                    if (isSaved) {
                        state.user.savedPosts.push(postId);
                    } else {
                        state.user.savedPosts = state.user.savedPosts.filter(id => (id._id || id).toString() !== postId.toString());
                    }
                }
            });
    },
});

export const { reset } = authSlice.actions;
export default authSlice.reducer;
