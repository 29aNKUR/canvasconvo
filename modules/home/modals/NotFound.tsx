import { useModal } from '@/modal';
import { AiOutlineClose } from 'react-icons/ai';

const NotFoundModal = ({ id }: { id: string }) => {
    const { closeModal } = useModal();

    return (
        <div className='relative flex flex-col items-center rounded-md bg-white p-10'></div>
    )
}