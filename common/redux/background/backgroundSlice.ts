import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    mode: 'light',
    lines: true,
}

const backgroundSlice = createSlice({
    name: 'background',
    initialState,
    reducers: {
        setMode: (state,action) => {
            state.mode = action.payload;
        },
        toggleLines: (state) => {
            state.lines = !state.lines;
        }
    }
})


export const { setMode, toggleLines } = backgroundSlice.actions;

export default backgroundSlice.reducer;