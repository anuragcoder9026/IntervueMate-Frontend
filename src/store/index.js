import { configureStore } from '@reduxjs/toolkit';
import modeReducer from './modeSlice';
import groupReducer from './groupSlice';
import authReducer from './authSlice';
import postReducer from './postSlice';
import quizReducer from './quizSlice';

export const store = configureStore({
    reducer: {
        mode: modeReducer,
        group: groupReducer,
        auth: authReducer,
        post: postReducer,
        quiz: quizReducer,
    },
});
