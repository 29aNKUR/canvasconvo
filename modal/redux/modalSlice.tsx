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
        setModal: (state, action: PayloadAction<JSX.Element | JSX.Element[]>) => {
            state.modal = action.payload;
            state.opened = true;
        },

        closeModal: (state) => {
            state.modal = <></>;
            state.opened = false;
        }
    }
})

export const { setModal, closeModal } = modalSlice.actions;

export default modalSlice.reducer;