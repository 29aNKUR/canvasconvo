import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    lineColor: { r: 0, g: 0, b: 0, a: 1 },
    fillColor: { r: 0, g: 0, b: 0, a: 0 },
    lineWidth: 5,
    mode: 'draw',
    shape: 'line',
    selection: null
};

export const optionSlice = createSlice({
    name: 'option',
    initialState,
    reducers: {
        setLineColor: (state,action) => {
            state.lineColor = action.payload;
        },
        setFillColor: (state,action) => {
            state.fillColor = action.payload;
        },
        setLineWidth: (state,action) => {
            state.lineWidth = action.payload;
        },
        setMode: (state,action) => {
            state.mode = action.payload;
        },
        setShape: (state,action) => {
            state.shape = action.payload;
        },
        setSelection: (state,action) => {
            state.selection = action.payload;
        },
    },
});

export const {
    setLineColor,
    setFillColor,
    setLineWidth,
    setMode,
    setShape,
    setSelection,
} = optionSlice.actions;

export default optionSlice.reducer;