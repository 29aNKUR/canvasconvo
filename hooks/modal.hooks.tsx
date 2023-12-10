import { useSetRecoilState } from 'recoil';

import { modalAtom } from '../recoil/modal.atom'

const useModal = () => {

    const setModal = useSetRecoilState(modalAtom)


}