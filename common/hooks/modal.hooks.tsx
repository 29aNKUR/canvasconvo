import { useSetRecoilState } from 'recoil';

import { modalAtom } from '@/common/recoil/modal.atom'

import { Modal } from '@/common/recoil/modal.atom';

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