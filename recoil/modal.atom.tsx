import { atom } from "recoil";

export const modalAtom = atom({
    key:'modal',
    default: {
        modal: <></>,
        opened: false
    }
})