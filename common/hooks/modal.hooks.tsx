import { useSetRecoilState } from 'recoil';

import { modalAtom } from '@/modal/recoil/modal.atom'

import { Modal } from '@/modal/recoil/modal.atom';

const useModal = () => {

    const setModal = useSetRecoilState(modalAtom)

    const openModal = (modal: Modal['modal']) => {
        setModal( {modal, opened: true} )
    }

    const closeModal = () => {
        setModal( {modal: <></>, opened: false});
    }

    return { openModal, closeModal } ;
}

export default useModal;