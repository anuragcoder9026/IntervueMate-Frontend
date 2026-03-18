import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = '/api/notifications';

// Fetch notifications
export const fetchNotifications = createAsyncThunk(
    'notifications/fetchAll',
    async (category, { rejectWithValue }) => {
        try {
            const url = category ? `${API_URL}?category=${category}` : API_URL;
            const response = await axios.get(url);
            return response.data.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

// Mark as read
export const markNotificationRead = createAsyncThunk(
    'notifications/markRead',
    async (id, { rejectWithValue }) => {
        try {
            const response = await axios.put(`${API_URL}/${id}/read`);
            return response.data.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

// Mark all as read
export const markAllNotificationsRead = createAsyncThunk(
    'notifications/markAllRead',
    async (_, { rejectWithValue }) => {
        try {
            await axios.put(`${API_URL}/read-all`);
            return true;
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

// Delete notification
export const deleteNotification = createAsyncThunk(
    'notifications/delete',
    async (id, { rejectWithValue }) => {
        try {
            await axios.delete(`${API_URL}/${id}`);
            return id;
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

const notificationSlice = createSlice({
    name: 'notifications',
    initialState: {
        notifications: [],
        loading: false,
        error: null,
        unreadCount: 0
    },
    reducers: {
        addNotification: (state, action) => {
            state.notifications.unshift(action.payload);
            if (!action.payload.isRead) {
                state.unreadCount += 1;
            }
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchNotifications.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchNotifications.fulfilled, (state, action) => {
                state.loading = false;
                state.notifications = Array.isArray(action.payload) ? action.payload : [];
                state.unreadCount = state.notifications.filter(n => !n.isRead).length;
            })
            .addCase(fetchNotifications.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Failed to fetch notifications';
            })
            .addCase(markNotificationRead.fulfilled, (state, action) => {
                const index = state.notifications.findIndex(n => n._id === action.payload._id);
                if (index !== -1) {
                    if (!state.notifications[index].isRead) {
                        state.unreadCount -= 1;
                    }
                    state.notifications[index] = action.payload;
                }
            })
            .addCase(markAllNotificationsRead.fulfilled, (state) => {
                state.notifications.forEach(n => { n.isRead = true; });
                state.unreadCount = 0;
            })
            .addCase(deleteNotification.fulfilled, (state, action) => {
                const deleted = state.notifications.find(n => n._id === action.payload);
                if (deleted && !deleted.isRead) {
                    state.unreadCount -= 1;
                }
                state.notifications = state.notifications.filter(n => n._id !== action.payload);
            });
    }
});

export const { addNotification } = notificationSlice.actions;
export default notificationSlice.reducer;
