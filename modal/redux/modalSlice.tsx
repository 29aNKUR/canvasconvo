import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export interface Modal {
    modal: JSX.Element | JSX.Element[];
    opened: boolean;
};

const initialState: Modal = {
    modal: <></>,
    opened: false,
}

export const modalSlice = createSlice({
    name: 'modal',
    initialState,
    reducers: {
        setModal: (state, action) => {
            state.modal = action.payload.modal;
            state.opened = action.payload.opened;
        }
    }
})

export const { setModal } = modalSlice.actions;

export default modalSlice.reducer;