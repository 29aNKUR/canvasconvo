import { useDispatch, useSelector } from "react-redux";
import { setModal } from "./modalSlice";

const useModal = () => {

    const dispatch = useDispatch();

    // const { modal, opened } = useSelector((store: any) => store.modal);

    const openModal = (newModal: JSX.Element | JSX.Element[]) => {
        dispatch(setModal({modal: newModal, opened: true}));
    }

    const closeModal = () => {
        dispatch(setModal({modal: <></>, opened:false}));
    }

   return { openModal, closeModal }; 
}

export default useModal;