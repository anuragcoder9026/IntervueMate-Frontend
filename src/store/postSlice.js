import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../utils/api';

// Get single post
export const getPost = createAsyncThunk(
    'post/getOne',
    async (postId, thunkAPI) => {
        try {
            const response = await api.get(`/posts/${postId}`);
            return response.data;
        } catch (error) {
            const message = error.response?.data?.error || error.message;
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Get all posts
export const getPosts = createAsyncThunk(
    'post/getAll',
    async (_, thunkAPI) => {
        try {
            const response = await api.get('/posts');
            return response.data;
        } catch (error) {
            const message = error.response?.data?.error || error.message;
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Get comments for a post
export const getPostComments = createAsyncThunk(
    'post/getComments',
    async (postId, thunkAPI) => {
        try {
            const response = await api.get(`/posts/${postId}/comments`);
            return { postId, comments: response.data.data };
        } catch (error) {
            const message = error.response?.data?.error || 'Failed to fetch comments';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Create new post
export const createPost = createAsyncThunk(
    'post/create',
    async (postData, thunkAPI) => {
        try {
            const response = await api.post('/posts', postData);
            return response.data;
        } catch (error) {
            const message = error.response?.data?.error || 'Failed to create post';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Like/Unlike post
export const likePost = createAsyncThunk(
    'post/like',
    async (postId, thunkAPI) => {
        try {
            const response = await api.put(`/posts/${postId}/like`);
            return { postId, likes: response.data.data };
        } catch (error) {
            const message = error.response?.data?.error || 'Failed to update like';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Add comment
export const addComment = createAsyncThunk(
    'post/addComment',
    async ({ postId, text }, thunkAPI) => {
        try {
            const response = await api.post(`/posts/${postId}/comment`, { text });
            return { postId, comments: response.data.data };
        } catch (error) {
            const message = error.response?.data?.error || 'Failed to add comment';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Update post
export const updatePost = createAsyncThunk(
    'post/update',
    async ({ postId, postData }, thunkAPI) => {
        try {
            const response = await api.put(`/posts/${postId}`, postData);
            return response.data;
        } catch (error) {
            const message = error.response?.data?.error || 'Failed to update post';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Delete post
export const deletePost = createAsyncThunk(
    'post/delete',
    async (postId, thunkAPI) => {
        try {
            await api.delete(`/posts/${postId}`);
            return postId;
        } catch (error) {
            const message = error.response?.data?.error || 'Failed to delete post';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Delete repost
export const deleteRepost = createAsyncThunk(
    'post/deleteRepost',
    async (repostId, thunkAPI) => {
        try {
            await api.delete(`/posts/repost/${repostId}`);
            return repostId;
        } catch (error) {
            const message = error.response?.data?.error || 'Failed to delete repost';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Like/Unlike comment
export const likeComment = createAsyncThunk(
    'post/likeComment',
    async (commentId, thunkAPI) => {
        try {
            const response = await api.put(`/posts/comment/${commentId}/like`);
            return response.data.data; // { commentId, likes, postId }
        } catch (error) {
            const message = error.response?.data?.error || 'Failed to like comment';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Add reply to comment
export const addReply = createAsyncThunk(
    'post/addReply',
    async ({ commentId, text }, thunkAPI) => {
        try {
            const response = await api.post(`/posts/comment/${commentId}/reply`, { text });
            return response.data.data; // Updated comment with replies
        } catch (error) {
            const message = error.response?.data?.error || 'Failed to add reply';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Repost a post
export const repostPost = createAsyncThunk(
    'post/repost',
    async ({ postId, repostContent }, thunkAPI) => {
        try {
            const response = await api.post(`/posts/${postId}/repost`, { repostContent });
            return response.data.data;
        } catch (error) {
            const message = error.response?.data?.error || 'Failed to repost';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

const initialState = {
    posts: [],
    isError: false,
    isSuccess: false,
    isLoading: false,
    isCreating: false,
    isCreated: false,
    message: '',
    currentPost: null,
};

export const postSlice = createSlice({
    name: 'post',
    initialState,
    reducers: {
        reset: (state) => {
            state.isLoading = false;
            state.isSuccess = false;
            state.isError = false;
            state.isCreating = false;
            state.isCreated = false;
            state.message = '';
            state.currentPost = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Get posts
            .addCase(getPosts.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getPosts.fulfilled, (state, action) => {
                state.isLoading = false;
                state.posts = action.payload.data;
            })
            .addCase(getPosts.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            // Get single post
            .addCase(getPost.pending, (state) => {
                state.isLoading = true;
                state.currentPost = null;
            })
            .addCase(getPost.fulfilled, (state, action) => {
                state.isLoading = false;
                state.currentPost = action.payload.data;
            })
            .addCase(getPost.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            // Get comments
            .addCase(getPostComments.pending, (state, action) => {
                const postId = action.meta.arg;
                state.posts.forEach(p => {
                    if (p._id === postId || p.originalPostId === postId) {
                        p.commentLoading = true;
                    }
                });
                if (state.currentPost && (state.currentPost._id === postId || state.currentPost.originalPostId === postId)) {
                    state.currentPost.commentLoading = true;
                }
            })
            .addCase(getPostComments.fulfilled, (state, action) => {
                const { postId, comments } = action.payload;
                state.posts.forEach(p => {
                    if (p._id === postId || p.originalPostId === postId) {
                        p.comments = comments;
                        p.commentLoading = false;
                    }
                });
                if (state.currentPost && (state.currentPost._id === postId || state.currentPost.originalPostId === postId)) {
                    state.currentPost.comments = comments;
                    state.currentPost.commentLoading = false;
                }
            })
            .addCase(getPostComments.rejected, (state, action) => {
                const postId = action.meta.arg;
                state.posts.forEach(p => {
                    if (p._id === postId || p.originalPostId === postId) {
                        p.commentLoading = false;
                    }
                });
                if (state.currentPost && (state.currentPost._id === postId || state.currentPost.originalPostId === postId)) {
                    state.currentPost.commentLoading = false;
                }
                state.isError = true;
                state.message = action.payload;
            })
            // Create post
            .addCase(createPost.pending, (state) => {
                state.isCreating = true;
            })
            .addCase(createPost.fulfilled, (state, action) => {
                state.isCreating = false;
                state.isCreated = true;
                state.isSuccess = true;
                state.message = 'Post created successfully!';
                state.posts.unshift(action.payload.data);
            })
            .addCase(createPost.rejected, (state, action) => {
                state.isCreating = false;
                state.isError = true;
                state.message = action.payload;
            })
            // Update post
            .addCase(updatePost.fulfilled, (state, action) => {
                const index = state.posts.findIndex(p => p._id === action.payload.data._id);
                if (index !== -1) {
                    state.posts[index] = action.payload.data;
                }
                if (state.currentPost && state.currentPost._id === action.payload.data._id) {
                    state.currentPost = action.payload.data;
                }
                state.isSuccess = true;
                state.message = 'Post updated successfully!';
            })
            .addCase(updatePost.rejected, (state, action) => {
                state.isError = true;
                state.message = action.payload;
            })
            // Like post
            .addCase(likePost.fulfilled, (state, action) => {
                state.posts.forEach(p => {
                    if (p._id === action.payload.postId || p.originalPostId === action.payload.postId) {
                        p.likes = action.payload.likes;
                    }
                });
                if (state.currentPost && (state.currentPost._id === action.payload.postId || state.currentPost.originalPostId === action.payload.postId)) {
                    state.currentPost.likes = action.payload.likes;
                }
            })
            .addCase(likePost.rejected, (state, action) => {
                state.isError = true;
                state.message = action.payload;
            })
            // Add comment
            .addCase(addComment.fulfilled, (state, action) => {
                state.posts.forEach(p => {
                    if (p._id === action.payload.postId || p.originalPostId === action.payload.postId) {
                        p.comments = action.payload.comments;
                    }
                });
                if (state.currentPost && (state.currentPost._id === action.payload.postId || state.currentPost.originalPostId === action.payload.postId)) {
                    state.currentPost.comments = action.payload.comments;
                }
                state.isSuccess = true;
                state.message = 'Comment added!';
            })
            .addCase(addComment.rejected, (state, action) => {
                state.isError = true;
                state.message = action.payload;
            })
            // Delete post
            .addCase(deletePost.fulfilled, (state, action) => {
                state.posts = state.posts.filter(p => p._id !== action.payload);
                state.isSuccess = true;
                state.message = 'Post deleted successfully';
            })
            .addCase(deletePost.rejected, (state, action) => {
                state.isError = true;
                state.message = action.payload;
            })
            // Delete repost
            .addCase(deleteRepost.fulfilled, (state, action) => {
                state.posts = state.posts.filter(p => p._id !== action.payload);
                state.isSuccess = true;
                state.message = 'Repost deleted successfully';
            })
            .addCase(deleteRepost.rejected, (state, action) => {
                state.isError = true;
                state.message = action.payload;
            })
            // Like comment
            .addCase(likeComment.fulfilled, (state, action) => {
                const { postId, commentId, likes } = action.payload;
                state.posts.forEach(p => {
                    if (p._id === postId || p.originalPostId === postId) {
                        const comment = p.comments.find(c => c._id === commentId);
                        if (comment) {
                            comment.likes = likes;
                        }
                    }
                });
                if (state.currentPost && (state.currentPost._id === postId || state.currentPost.originalPostId === postId)) {
                    const comment = state.currentPost.comments.find(c => c._id === commentId);
                    if (comment) {
                        comment.likes = likes;
                    }
                }
            })
            .addCase(likeComment.rejected, (state, action) => {
                state.isError = true;
                state.message = action.payload;
            })
            // Add reply to comment
            .addCase(addReply.fulfilled, (state, action) => {
                const updatedComment = action.payload;
                const postId = updatedComment.post?._id || updatedComment.post;

                // Update in posts list
                state.posts.forEach(p => {
                    if ((p._id === postId || p.originalPostId === postId) && Array.isArray(p.comments)) {
                        const commentIndex = p.comments.findIndex(c => c._id === updatedComment._id);
                        if (commentIndex !== -1) {
                            p.comments[commentIndex] = updatedComment;
                        }
                    }
                });

                // Update in current post
                if (state.currentPost && (state.currentPost._id === postId || state.currentPost.originalPostId === postId) && Array.isArray(state.currentPost.comments)) {
                    const commentIndex = state.currentPost.comments.findIndex(c => c._id === updatedComment._id);
                    if (commentIndex !== -1) {
                        state.currentPost.comments[commentIndex] = updatedComment;
                    }
                }

                state.isSuccess = true;
                state.message = 'Reply added!';
            })
            .addCase(addReply.rejected, (state, action) => {
                state.isError = true;
                state.message = action.payload;
            })
            // Repost post
            .addCase(repostPost.pending, (state) => {
                state.isCreating = true;
            })
            .addCase(repostPost.fulfilled, (state, action) => {
                state.isCreating = false;
                state.isSuccess = true;
                state.message = 'Post reposted successfully!';
                state.posts.unshift(action.payload);
            })
            .addCase(repostPost.rejected, (state, action) => {
                state.isCreating = false;
                state.isError = true;
                state.message = action.payload;
            });
    },
});

export const { reset } = postSlice.actions;
export default postSlice.reducer;
