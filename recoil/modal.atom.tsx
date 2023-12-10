import { atom } from "recoil";

export interface Modal {
    modal: JSX.Element | JSX.Element[]; 
    opened: boolean;
}

export const modalAtom = atom<Modal>({
    key:'modal',
    default: {
        modal: <></>,
        opened: false
    }
})