import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    id: '',
    userMoves: new Map(),
    users: new Map(),
    movesWithoutUser: [],
    myMoves: [],
}

const roomSlice = createSlice({
    name: 'room',
    initialState,
    reducers: {
        setRoom: (state,action) => {
            return action.payload;
        },
        resetRoom: () => initialState,
    }
});

export const { setRoom, resetRoom }  = roomSlice.actions;
export default roomSlice.reducer;