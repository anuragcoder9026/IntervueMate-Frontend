import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../utils/api';

// Async Thunks
export const fetchQuizzes = createAsyncThunk(
    'quiz/fetchQuizzes',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/quizzes');
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.error || 'Failed to fetch quizzes');
        }
    }
);

export const fetchQuizById = createAsyncThunk(
    'quiz/fetchQuizById',
    async (quizId, { rejectWithValue }) => {
        try {
            const response = await api.get(`/quizzes/${quizId}`);
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.error || 'Failed to fetch quiz');
        }
    }
);

export const submitQuiz = createAsyncThunk(
    'quiz/submitQuiz',
    async ({ quizId, answers }, { rejectWithValue }) => {
        try {
            const response = await api.post(`/quizzes/${quizId}/submit`, { answers });
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.error || 'Failed to submit quiz');
        }
    }
);

export const generateCustomQuiz = createAsyncThunk(
    'quiz/generateCustomQuiz',
    async (quizParams, { rejectWithValue }) => {
        try {
            const response = await api.post('/quizzes/generate', quizParams);
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.error || 'Failed to generate quiz');
        }
    }
);

export const submitCustomQuiz = createAsyncThunk(
    'quiz/submitCustomQuiz',
    async ({ quizId, answers }, { rejectWithValue }) => {
        try {
            const response = await api.post('/quizzes/submit-custom', { quizId, answers });
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.error || 'Failed to submit custom quiz');
        }
    }
);

export const startQuiz = createAsyncThunk(
    'quiz/startQuiz',
    async (quizId, { rejectWithValue }) => {
        try {
            const response = await api.post(`/quizzes/${quizId}/start`);
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.error || 'Failed to start quiz');
        }
    }
);

export const fetchMyAttempts = createAsyncThunk(
    'quiz/fetchMyAttempts',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/quizzes/my-attempts');
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.error || 'Failed to fetch attempts');
        }
    }
);

export const saveQuizProgress = createAsyncThunk(
    'quiz/saveQuizProgress',
    async ({ quizId, answers, remainingDuration }, { rejectWithValue }) => {
        try {
            const response = await api.post('/quizzes/save-progress', { quizId, answers, remainingDuration });
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.error || 'Failed to save progress');
        }
    }
);

// Slice
const quizSlice = createSlice({
    name: 'quiz',
    initialState: {
        quizzes: [],
        recommendedQuizzes: [],
        currentQuiz: null,
        quizResult: null,
        loading: false,
        error: null,
        submitting: false,
        generating: false,
        userAttempts: [],
        activeSessions: [],
        currentActiveSession: null,
        currentAttemptId: null,
    },
    reducers: {
        clearQuizResult: (state) => {
            state.quizResult = null;
        },
        clearCurrentQuiz: (state) => {
            state.currentQuiz = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch Quizzes
            .addCase(fetchQuizzes.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchQuizzes.fulfilled, (state, action) => {
                state.loading = false;
                state.quizzes = action.payload.quizzes || [];
                state.recommendedQuizzes = action.payload.recommended || [];
                state.activeSessions = action.payload.activeSessions || [];
            })
            .addCase(fetchQuizzes.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Fetch Quiz By ID
            .addCase(fetchQuizById.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.currentQuiz = null;
            })
            .addCase(fetchQuizById.fulfilled, (state, action) => {
                state.loading = false;
                state.currentQuiz = action.payload;
            })
            .addCase(fetchQuizById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Submit Quiz
            .addCase(submitQuiz.pending, (state) => {
                state.submitting = true;
                state.error = null;
            })
            .addCase(submitQuiz.fulfilled, (state, action) => {
                state.submitting = false;
                state.quizResult = action.payload;
            })
            .addCase(submitQuiz.rejected, (state, action) => {
                state.submitting = false;
                state.error = action.payload;
            })
            // Generate Custom Quiz
            .addCase(generateCustomQuiz.pending, (state) => {
                state.generating = true;
                state.error = null;
                state.currentQuiz = null;
            })
            .addCase(generateCustomQuiz.fulfilled, (state, action) => {
                state.generating = false;
                state.currentQuiz = action.payload.quiz;
                state.currentActiveSession = action.payload.activeSession;
            })
            .addCase(generateCustomQuiz.rejected, (state, action) => {
                state.generating = false;
                state.error = action.payload;
            })
            // Submit Custom Quiz
            .addCase(submitCustomQuiz.pending, (state) => {
                state.submitting = true;
                state.error = null;
            })
            .addCase(submitCustomQuiz.fulfilled, (state, action) => {
                state.submitting = false;
                state.quizResult = action.payload;
            })
            .addCase(submitCustomQuiz.rejected, (state, action) => {
                state.submitting = false;
                state.error = action.payload;
            })
            // Fetch User Attempts
            .addCase(fetchMyAttempts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchMyAttempts.fulfilled, (state, action) => {
                state.loading = false;
                state.userAttempts = action.payload;
            })
            .addCase(fetchMyAttempts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Save Progress
            .addCase(saveQuizProgress.fulfilled, (state, action) => {
                const updatedSession = action.payload;
                state.currentActiveSession = updatedSession;
                const index = state.activeSessions.findIndex(s => s._id === updatedSession._id);
                if (index !== -1) {
                    state.activeSessions[index] = updatedSession;
                } else {
                    state.activeSessions.unshift(updatedSession);
                }
            })
            // Start Quiz
            .addCase(startQuiz.fulfilled, (state, action) => {
                state.currentActiveSession = action.payload;
                state.currentAttemptId = action.payload?._id;
            });
    }
});

export const { clearQuizResult, clearCurrentQuiz } = quizSlice.actions;

export default quizSlice.reducer;
