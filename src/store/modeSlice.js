import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    currentMode: 'general', // 'general' | 'group'
    activeGroupId: null,
};

const modeSlice = createSlice({
    name: 'mode',
    initialState,
    reducers: {
        switchMode: (state, action) => {
            const { mode, groupId } = action.payload;
            state.currentMode = mode;
            state.activeGroupId = mode === 'group' ? groupId : null;
        },
    },
});

export const { switchMode } = modeSlice.actions;
export default modeSlice.reducer;
